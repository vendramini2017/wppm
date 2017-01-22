var Promise = require('bluebird');
var chalk = require("chalk");

function simulateTask(name, duration, chalk) {
    return new Promise(function(resolve, reject) {

        process.stdout.write(chalk('Executing task \'' + name + '\'...'));

        setTimeout(function() {
            console.log(chalk(' Task \'' + name + '\' complete!'));
            resolve();
        }, duration);
    });
}

var iterations = 100;
var iterationArray = [];

for (var i = 0; i < iterations; i++) {
    iterationArray.push(i);
    
};

Promise.each(iterationArray, function(item) {
    return simulateTask('Download #' + item, 5000 * Math.random(), chalk.red).then(function() {
        return simulateTask('Extract #' + item, 5000 * Math.random(), chalk.yellow);
    }).then(function() {
        return simulateTask('Clean #' + item, 5000 * Math.random(), chalk.blue);
    });
}).done(function() {
    console.log(chalk.green('DONE!'));
});