'use strict'

const { v4: uuidv4 } = require('uuid')
const path = require('path')
const fs = require('fs')
const moment = require('moment')

const ENV = 'local'
const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const input = `postman/env/template.json`
const OUTPUT_FOLDER = `./postman/env/${ENV}`
const output = (uf) => (`${OUTPUT_FOLDER}/${uf}.json`)

// cria pasta de saída
if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(path.join(__dirname, OUTPUT_FOLDER), { recursive: true })
}

let rawdata = fs.readFileSync(path.join(__dirname, input))
let template = JSON.parse(rawdata)

var envs = UFS.map(uf => ({
    ...template,
    id: uuidv4(),
    uf,
    name: `${template.name} ${ENV.toUpperCase()} ${uf}`,
    values: [{
        key: "host",
        value: `http://localhost:8080`,
        // value: `https://${uf.toLowerCase()}-ehr-services.saude.gov.br`,
        // value: `https://ehr-services.hmg.saude.gov.br`,
        enabled: true
    }]
}))


envs.forEach(i => {
    console.log(output(i.uf))
    fs.writeFile(
        path.join(__dirname, output(i.uf)),
        JSON.stringify(i),
        (err) => {
            if (err) return console.error(err)
        }
    )
})