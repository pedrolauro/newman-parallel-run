'use strict'

const chalk = require('chalk')
const path = require('path')
const async = require('async')
const newman = require('newman')
const moment = require('moment-timezone')
const fs = require('fs')


/**
 * VARS
 */
const BARS = `######################################################`
const NOW = moment().tz('America/Sao_Paulo').format('YYYY_MM_DD_HH_mm_ss')
const S3_FOLDER = 'prep/s3/20200421'
// const S3_FOLDER = 'teste'
const DOC_FOLDER = `./postman/docs/${S3_FOLDER}`
const OUTPUT_FOLDER = `executions/${NOW}`
const FILE_PATTERN = /([A-Z]{2})_01\.json/
const ENV = 'hmg'
const ITERATION_LIMIT = 1


/**
 * FUNCS
 */
const joinPath = (filePath) => path.join(__dirname, filePath)

const createNewRunCmd = (uf, dataPath) => (done) => {
    let param = runParamByUf(uf, dataPath)
    newman.run(param, done)
}

const runParamByUf = (uf, dataPath) => ({
    id: uf,
    collection: joinPath('postman/carga_docs.postman_collection.json'),
    environment: joinPath(`postman/env/${ENV}/${uf}.json`),
    iterationData: joinPath(dataPath),
    iterationCount: ITERATION_LIMIT,
    reporters: ['json'],
    reporter: {
        json: {
            export: joinPath(`executions/${NOW}/output.${uf}.json`)
        }
    }
})

// waiting para debug
// console.log(`\n\nWAITING\n\n`)
setTimeout(run, 100)

function run() {

    console.log(chalk.magenta(`\n\n${BARS}`))
    console.log(chalk.magenta(`INICIO DA EXECUCAO`))
    console.log(chalk.magenta(`ENV `) + chalk.yellow(ENV))
    console.log(chalk.magenta(`ITERATION_LIMIT `) + chalk.yellow(ITERATION_LIMIT))
    console.log(chalk.magenta(`DOCUMENTOS DA PASTA `) + chalk.yellow(S3_FOLDER))
    console.log(chalk.magenta(`RESULTADOS EM `) + chalk.yellow(OUTPUT_FOLDER))
    console.log(chalk.magenta(`${BARS}\n\n`))

    let falha = false
    var commands = []
    var files = fs.readdirSync(DOC_FOLDER)
    files.forEach(file => {

        if (falha) {
            return
        }

        if (!file.match(FILE_PATTERN)) {
            console.log(chalk.redBright(`ARQUIVO INVALIDO: `) +
                chalk.bold.redBright(`${DOC_FOLDER}/${file}\n\n`))
            falha = true
            return
        }

        let uf = file.replace(FILE_PATTERN, '$1')
        let dataPath = `${DOC_FOLDER}/${file}`
        commands.push(createNewRunCmd(uf, dataPath))
    })

    if (falha) {
        return
    }

    // Runs the Postman sample collection thrice, in parallel.
    async.parallel(
        commands,
        (err, results) => {
            err && console.error(err)

            var totalGeral = 0
            var failuresGeral = 0
            results.forEach(function (result) {
                let name = result.environment.name
                let host = result.environment.values.filter(i => i.key === 'host')[0].value
                let total = result.run.stats.assertions.total
                let failures = result.run.stats.assertions.failed
                totalGeral += total
                failuresGeral += failures

                let falhasTxt = `${failures} (${100*failures/total}%)`
                console.log(`${name}, host=${host}, total=${total}, falhas=${falhasTxt}`)
            })

            let falhasGeralTxt = `${failuresGeral} (${100*failuresGeral/totalGeral}%)`
            
            console.log(chalk.magenta(`\n\n${BARS}`))
            console.log(chalk.magenta(`TERMINO DA EXECUCAO`))
            console.log(chalk.yellow(`execucoes=${results.length}`))
            console.log(chalk.yellow(`total=${totalGeral}`))
            console.log(chalk.redBright(`falhas=${falhasGeralTxt}`))
            console.log(chalk.magenta(`${BARS}\n\n`))
        }
    )
}
