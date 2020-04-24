'use strict'

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')


const RESULTS_FOLDER = '2020_04_24_13_49_11'
// const RESULTS_FOLDER = '2020_04_24_14_33_32'
const FILE_PATTERN = /output\.([A-Z]{2})\.json/
const BARS = `######################################################`
const READING_FOLDER = `./executions/${RESULTS_FOLDER}`


console.log(chalk.magenta(`\n\n${BARS}`))
console.log(chalk.magenta(`INICIO DA EXECUCAO`))
console.log(chalk.magenta(`DOCUMENTOS DA PASTA `) + chalk.yellow(READING_FOLDER))
console.log(chalk.magenta(`${BARS}\n\n`))


//  lê arquivos
var output = {
    ufs: {},
    summary: {
        total: 0,
        failures: 0
    }
}
let falha = false
var files = fs.readdirSync(READING_FOLDER)
files.forEach(file => {

    if (falha) {
        return
    }

    if (!file.match(FILE_PATTERN)) {
        console.log(chalk.redBright(`ARQUIVO INVALIDO: `) +
            chalk.bold.redBright(`${READING_FOLDER}/${file}\n\n`))
        return
    }

    let uf = file.replace(FILE_PATTERN, '$1')

    let rawdata = fs.readFileSync(path.join(__dirname, `${READING_FOLDER}/${file}`))
    let result = JSON.parse(rawdata)

    let name = result.environment.name
    let host = result.environment.values.filter(i => i.key === 'host')[0].value
    let total = result.run.stats.assertions.total
    let failures = result.run.stats.assertions.failed

    output.summary.total += total
    output.summary.failures += failures

    let falhasTxt = `${failures} (${100*failures/total}%)`
    console.log(`${name}, host=${host}, total=${total}, falhas=${falhasTxt}`)

    let executions = result.run.executions.map(e => {
        let body = JSON.parse(e.request.body.raw)

        let identifier = body.identifier
        let code = e.response.code
        let status = e.response.status
        let id
        let success = false
        let response

        if (code === 201) {
            success = true    
            let location = e.response.header.filter(i => i.key === 'Location')[0].value
            let pieces = location.split('/')
            id = pieces[pieces.length - 1]

        } else {
            var responseBuffer = Buffer.from(e.response.stream)
            response = JSON.parse(responseBuffer.toString())
        }

        return {
            identifier,
            success,
            code,
            status,
            response,
            id
        }
    })

    output.ufs[uf] = {
        env: name,
        host,
        total,
        failures,
        executions,
    }
})

if (!falha) {
    fs.writeFile(
        path.join(__dirname, `${READING_FOLDER}/summary.json`),
        JSON.stringify(output), {
            flag: 'a+'
        },
        (err) => {
            if (err) return console.error(err)
        }
    )
}

console.log(chalk.magenta(`\n\n${BARS}`))
console.log(chalk.magenta(`TERMINO DA EXECUCAO`))
console.log(chalk.yellow(`total=${output.summary.total}`))
console.log(chalk.redBright(`falhas=${output.summary.failures}`))
console.log(chalk.magenta(`${BARS}\n\n`))