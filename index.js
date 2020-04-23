'use strict'

const path = require('path')
const async = require('async')
const newman = require('newman')
const moment = require('moment-timezone');

// PASTA PARA RESULTADOS
const NOW = moment().tz("America/Sao_Paulo").format('YYYY_MM_DD_HH_mm_ss')
console.log(`\n\nRESULTADOS ESTARÃO EM executions/${NOW}`)

// LISTA DE UFS
// var UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const UFS = ['AC', 'AP']

const parameters = (uf) => ({
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'),
    environment: path.join(__dirname, `postman/env/prd/${uf}.json`),
    iterationData: path.join(__dirname, `postman/docs/docs.${uf}.json`),
    reporters: ['json'],
    reporter: {
        json: {
            export: path.join(__dirname, `executions/${NOW}/output.${uf}.json`)
        }
    },
    id: uf
})

const parallelCollectionRun = (uf) => (done) => {
    let param = parameters(uf)
    // console.log(`params, uf=${uf}, param.id=${param.id}`)
    newman.run(param, done)
};

let commands = []
for (let index = 0; index < UFS.length; index++) {
    commands.push(parallelCollectionRun(UFS[index]))
}

// waiting para debug
// console.log(`\n\nWAITING\n\n`)
setTimeout(run, 100)

function run() {
    console.log(`\n\n#########################################`)
    console.log(`INICIO DA EXECUCAO`)
    console.log(`#########################################\n\n`)

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
            console.log(`\nGERAL: total=${totalGeral}, falhas=${falhasGeralTxt}`)
            console.log(`\n\n#########################################`)
            console.log(`TERMINO DA EXECUCAO`)
            console.log(`#########################################\n\n`)
        }
    )
}