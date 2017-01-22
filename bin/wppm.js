#! /usr/bin/env node

const program = require('commander');
// const initAction = require('../actions/init');
const searchAction = require('../actions/search');
const infoAction = require('../actions/info');
const installAction = require('../actions/install');

var package = require('../package.json');
program
    .version(package.version)

// program
//     .command('init')
//     .action(initAction);

program
    .command('search <pluginName>')
    .action(searchAction);

program
    .command('info <pluginSlug>')
    .action(infoAction);

program
    .command('install [pluginSlugs...]')
    .option('-s, --save')
    .action(installAction);


program.parse(process.argv);