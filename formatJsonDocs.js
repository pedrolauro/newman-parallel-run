'use strict'

const path = require('path')
const fs = require('fs')

let fileName = 'DCM_EXAMES_2020_bundles.v2'
let input = `postman/${fileName}.json`
let output = `postman/${fileName}.prep.json`

let rawdata = fs.readFileSync(path.join(__dirname, input))
let docs = JSON.parse(rawdata)
console.log(`TOTAL DE DOCS: ${docs.length}`)

// coloca doc dentro de tag, para processamento pelo 
// newman, que espera essa prop 'document'
docs = docs.map((i) => ({
    document: i
}))

fs.writeFile(
    path.join(__dirname, output),
    JSON.stringify(docs),
    (err) => {
        if (err) return console.error(err)
    }
)