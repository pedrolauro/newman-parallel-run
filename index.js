const path = require('path')
const async = require('async')
const newman = require('newman')

const PARALLEL_RUN_COUNT = 2

const parametersForTestRun1 = {
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/prd.AL.postman_environment.json'), //your env
    iterationData: path.join(__dirname, 'postman/docs.AL.json')
    ,reporters: ['json']
    ,reporter: { json: { export: path.join(__dirname, 'executions/output.AL.json') } }
    ,id: 'AL'
};

const parametersForTestRun2 = {
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/prd.DF.postman_environment.json'), //your env
    iterationData: path.join(__dirname, 'postman/docs.DF.json')
    ,reporters: ['json']
    ,reporter: { json: { export: path.join(__dirname, 'executions/output.DF.json') } }
    ,id: 'DF'
};

parallelCollectionRun = (i) => (done) => {
    
    let param = parametersForTestRun1
    if (i === 1) {
        param = parametersForTestRun2
    }
    
    console.log(`params, i=${i}, param.id=${param.id}`)
    newman.run(param, done);
};

let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun(index));
}

// Runs the Postman sample collection thrice, in parallel.
async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);

        results.forEach(function (result) {
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
        });
    });
