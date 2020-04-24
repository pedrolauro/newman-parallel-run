'use strict'

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')


const BARS = `######################################################`
const S3_FOLDER = 's3/20200421'
const DOC_FOLDER = `./postman/docs/${S3_FOLDER}`
const OUTPUT_FOLDER = `./postman/docs/prep/${S3_FOLDER}`
const output = (fileName) => `${OUTPUT_FOLDER}/${fileName}`


console.log(chalk.magenta(`\n\n${BARS}`))
console.log(chalk.magenta(`INICIO DA EXECUCAO`))
console.log(chalk.magenta(`DOCUMENTOS DA PASTA `) + chalk.yellow(S3_FOLDER))
console.log(chalk.magenta(`RESULTADOS EM `) + chalk.yellow(OUTPUT_FOLDER))
console.log(chalk.magenta(`${BARS}\n\n`))

// cria pasta de saída
if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(path.join(__dirname, OUTPUT_FOLDER), { recursive: true })
}

//  lê arquivos
var files = fs.readdirSync(DOC_FOLDER)
files.forEach(file => {

    let rawdata = fs.readFileSync(path.join(__dirname, `${DOC_FOLDER}/${file}`))
    let docs = JSON.parse(rawdata)

    console.log(`${file}, total: ${docs.length}`)

    // coloca doc dentro de tag, para processamento pelo 
    // newman, que espera essa prop 'document'
    docs = docs.map((i) => ({
        document: i
    }))

    let outFile = output(file)
    // console.log(`outFile=${outFile}`)

    fs.writeFile(
        path.join(__dirname, output(file)),
        JSON.stringify(docs), {
            flag: 'a+'
        },
        (err) => {
            if (err) return console.error(err)
        }
    )
})

console.log(chalk.magenta(`\n\n${BARS}`))
console.log(chalk.magenta(`TERMINO DA EXECUCAO`))
console.log(chalk.magenta(`${BARS}\n\n`))
