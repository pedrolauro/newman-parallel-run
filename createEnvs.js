'use strict'

const { v4: uuidv4 } = require('uuid');
const path = require('path')
const fs = require('fs')
const moment = require('moment');

var UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
const ENV = 'prd'


let input = `postman/env/template.json`
let output = (uf) => (`postman/env/${ENV}/${uf}.json`)

let rawdata = fs.readFileSync(path.join(__dirname, input))
let template = JSON.parse(rawdata)

var envs = UFS.map(uf => ({
    ...template,
    id: uuidv4(),
    uf,
    name: `${template.name} ${ENV.toUpperCase()} ${uf}`,
    values: [{
        key: "host",
        // value: `http://localhost:8080`,
        value: `https://${uf.toLowerCase()}-ehr-services.saude.gov.br`,
        enabled: true
    }]
}))

envs.forEach(i => {
    fs.writeFile(
        path.join(__dirname, output(i.uf)),
        JSON.stringify(i),
        (err) => {
            if (err) return console.error(err)
        }
    )
})