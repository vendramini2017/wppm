const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const Promise = require('bluebird');
const unzip = require('unzip');
const jsonfile = require('jsonfile');
const path = require('path');

const config = require('../config');
var data = {};

function savePlugin(options) {

    return new Promise(function(resolve, reject) {

        if (options && options.save) {
            jsonfile.readFile('./wppm.json', function(err, wppmObj) {

                if (err) {
                    console.error(chalk.red('Error: invalid wppm.json! Check the model of file before use it!'));
                    return;
                }

                wppmObj.dependencies[data.pluginSlug] = data.pluginVersion;
                fs.writeFile('./wppm.json', JSON.stringify(wppmObj, null, 2), 'utf-8');
                resolve();
            });

        } else {
            resolve();
        }
    });
}

function getPlugin(pluginSlug, options, pluginVersion) {
    return requestPlugin(pluginSlug, pluginVersion).then(function(args) {
        return downloadPlugin(args.downloadLink, args.fileName, args.pluginSlug, args.pluginVersion);
    }).then(function(fileName) {
        return extractPlugin(fileName);
    }).then(function(fileName) {
        return cleanPlugin(fileName);
    }).then(function() {
        return savePlugin(options);
    });
}

function cleanPlugin(fileName) {
    return new Promise(function(resolve, reject) {
        // process.stdout.write('Clearning ' + fileName + '...');
        fs.unlink(fileName);
        // console.log('OK!');
        resolve();
    });
}

function extractPlugin(fileName) {
    return new Promise(function(resolve, reject) {
        process.stdout.write(chalk.blue('Extracting ') + chalk.yellow(fileName) + '... ');
        fs.createReadStream(fileName).pipe(unzip.Extract({ path: '.' }));
        console.log(chalk.green('OK!'));
        resolve(fileName);
    });
}

function downloadPlugin(downloadPluginUrl, fileName, pluginSlug, pluginVersion) {

    return new Promise(function(resolve, reject) {

        process.stdout.write(chalk.blue('Downloading ') + chalk.yellow(pluginSlug) + chalk.red(' (v. ' + pluginVersion + ')') + '... ');
        request({ url: downloadPluginUrl, encoding: null }, function(err, res, body) {

            if (res.statusCode == 404) {
                reject(new Error(chalk.red("invalid version '" + pluginVersion + "'! Check 'wppm info " + pluginSlug + "' for version details.")));
            } else {

                fs.writeFileSync(fileName, body);
                console.log(chalk.green('OK!'));
                resolve(fileName);
            }
        });
    });
}

function requestPlugin(pluginSlug, pluginVersion) {
    return new Promise(function(resolve, reject) {

        if (pluginVersion) {
            var fileName = pluginSlug + '.' + pluginVersion + '.zip';

            data = { downloadLink: config.downloadUrl + fileName, fileName, pluginSlug, pluginVersion };

            resolve(data);
        } else {
            request(config.pluginUrl + pluginSlug, function(err, res, body) {

                if (err) {
                    reject(new Error('plugin request failed! Check internet connection!'));
                    return;
                }

                if (res.statusCode == 404) {
                    console.log(chalk.red('No results for: ') + chalk.yellow('\'' + pluginSlug + '\''));
                    reject(new Error('plugin not found!'));
                    return;
                }

                if (!err && res.statusCode == 200) {

                    var $ = cheerio.load(body);
                    $downloadLink = $('[itemprop="downloadUrl"]');
                    var fileName = $downloadLink.attr('href').split('/').slice(-1)[0]
                    var downloadLink = $downloadLink.attr('href');
                    var pluginVersion = $('[itemprop=softwareVersion]').attr('content');

                    data = { downloadLink, fileName, pluginSlug, pluginVersion };
                    resolve(data);
                }
            });
        }
    });
}

function promiseAction(arrTasks, options) {
    return Promise.each(arrTasks, function(task) {

        var semverPattern = /(([a-z\-]+)@([0-9\.]+))/;

        if (typeof task == 'object') {
            return getPlugin(task.pluginSlug, options, task.pluginVersion);
        } else if (task.match(semverPattern)) {

            var taskMatch = task.match(semverPattern);

            var pluginSlug = taskMatch[2];
            var pluginVersion = taskMatch[3];

            return getPlugin(pluginSlug, options, pluginVersion);

        } else {
            return getPlugin(task, options, '');
        }

    }).done(function() {
        console.log(chalk.green('DONE!'));
    });
}

function installAction(cmd, env) {

    var options = {
        save: env.save
    };

    if (cmd.length) {
        return promiseAction(cmd, options);
    } else {
        jsonfile.readFile('wppm.json', function(err, wppmObj) {

            if (err) {
                console.error(chalk.red('Error: wppm.json not found!'));
                return;
            }

            var dependencies = [];

            for (var key in wppmObj.dependencies) {
                dependencies.push({
                    pluginSlug: key,
                    pluginVersion: wppmObj.dependencies[key]
                });
            }

            return promiseAction(dependencies, options);
        });
    }
}

module.exports = installAction;