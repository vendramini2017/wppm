const request = require('request');
const config = require('../config');
const cheerio = require('cheerio');
const striptags = require('striptags');
const chalk = require('chalk');
require('console.table');

function searchAction(pluginName) {

    request(config.searchUrl + pluginName, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            var $ = cheerio.load(body);
            var $pluginCards = $('.plugin-card');

            var plugins = [];

            $pluginCards.each(function() {

                plugins.push({
                    slug: $(this).find('.plugin-icon').attr("href").split('/').slice(-2)[0],
                    // name: $(this).find('.name.column-name a').text(),
                    authors: striptags($(this).find('.authors').text()),
                    rating: $(this).find(".num-ratings").text().replace(/[^0-9]/g, ''),
                    // description: $(this).find('.desc.column-description p:first-child').text() 
                });
            });

            if (!plugins.length) {
                console.log(chalk.red('No results for: ') + chalk.yellow('\'' + pluginName + '\''));
                return;
            }

            plugins.sort(function(a, b) {
                return Number(a.rating) - Number(b.rating);
            });


            var printableTable = [];

            plugins.forEach(function(plugin) {

                printableTable.push({
                    Slug: chalk.blue(plugin.slug) + '(' + chalk.yellow(plugin.rating) + ')',
                    Authors: chalk.green(plugin.authors.slice(0, 20) + '...'),
                    // Rating: chalk.yellow(Array(Number(plugin.rating)).join('*'))
                    // Rating: chalk.yellow(plugin.rating)
                });

            });

            console.table(printableTable);

        }
    });
}

module.exports = searchAction;