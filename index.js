const path = require('path')
const async = require('async')
const newman = require('newman')

const PARALLEL_RUN_COUNT = 5

const parametersForTestRun1 = {
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/local.postman_environment.json'), //your env
    // environment: path.join(__dirname, 'postman/homologacao.postman_environment.json'), //your env
    iterationData: path.join(__dirname, 'postman/documents.1.json')
    ,iterationCount: 1
    // ,reporters: 'cli'
};

const parametersForTestRun2 = {
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/local.postman_environment.json'), //your env
    // environment: path.join(__dirname, 'postman/homologacao.postman_environment.json'), //your env
    iterationData: path.join(__dirname, 'postman/documents.2.json')
    ,iterationCount: 1
    // ,reporters: 'cli'
};

const parametersForTestRun3 = {
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/local.postman_environment.json'), //your env
    // environment: path.join(__dirname, 'postman/homologacao.postman_environment.json'), //your env
    iterationData: path.join(__dirname, 'postman/documents.3.json')
    ,iterationCount: 1
    // ,reporters: 'cli'
};

const parametersForTestRun4 = {
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/local.postman_environment.json'), //your env
    // environment: path.join(__dirname, 'postman/homologacao.postman_environment.json'), //your env
    iterationData: path.join(__dirname, 'postman/documents.4.json')
    ,iterationCount: 1
    // ,reporters: 'cli'
};

const parametersForTestRun5 = {
    collection: path.join(__dirname, 'postman/carga_docs.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/local.postman_environment.json'), //your env
    // environment: path.join(__dirname, 'postman/homologacao.postman_environment.json'), //your env
    iterationData: path.join(__dirname, 'postman/documents.5.json')
    ,iterationCount: 1
    // ,reporters: 'cli'
};

parallelCollectionRun = function (done, i) {

    let param = parametersForTestRun1
    if (i == 2) {
        param = parametersForTestRun2
    }
    if (i == 3) {
        param = parametersForTestRun3
    }
    if (i == 4) {
        param = parametersForTestRun4
    }
    if (i == 5) {
        param = parametersForTestRun5
    }

    newman.run(param, done);
};

let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
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
