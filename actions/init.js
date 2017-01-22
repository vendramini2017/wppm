const fs = require('fs');
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function initAction(cmd, env) {

    if (fs.existsSync('./wppm.json')) {
        console.log(chalk.red('Error: wppm.json already file exists!'));
        process.exit();
    } else {

        var json = {};
        json.dependencies = {};

        var answer = 'a';

        var infiniteLoop = function() {

            rl.question('Plugin slug (put nothing to stop the loop): ', (answer) => {
                // TODO: Log the answer in a database
                // console.log(`Thank you for your valuable feedback: ${answer}`);

                if (answer == '') {
                    fs.writeFile('./wppm.json', JSON.stringify(json, null, 2), 'utf-8');
                    rl.close();
                    console.log('DONE!');
                    return;
                }

                json.dependencies[answer] = '';

                infiniteLoop();

            });
        };

        infiniteLoop();
    }

    process.exit();

};

module.exports = initAction;