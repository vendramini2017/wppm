const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const striptags = require('striptags');

const config = require('../config');

function infoAction(pluginSlug) {
    // console.log('Hello, this is ' + pluginSlug + '!' );

    request(config.pluginUrl + pluginSlug, function(error, response, body) {

        if (response.statusCode == 404) {
            console.log(chalk.red('No results for: ') + chalk.yellow('\'' + pluginSlug + '\''));
            return;
        }

        if (!error && response.statusCode == 200) {

            var $ = cheerio.load(body);

            var authors = [];

            $('.plugin-contributor-info').each(function() {

                if ($(this).find('a').length) {
                    authors.push($(this).find('a').text().trim());
                } else {
                    authors.push($(this).text().trim());
                }

            });

            var $tags = $('#plugin-tags a');
            var tags = [];

            $tags.each(function() {
                tags.push($(this).text());
            });

            var $versions = $('#compatibility-topic-version option');
            var versions = [];

            $versions.each(function() {
                versions.push($(this).val());
            });

            var plugin = {
                name: $('h2[itemprop=name]').text(),
                version: $('[itemprop=softwareVersion]').attr('content'),
                authors: authors,
                shortdesc: $('p.shortdesc[itemprop=description]').text().trim(),
                tags: tags,
                url: config.pluginUrl + pluginSlug,
                versions: versions
            };

            console.log(plugin);
        }

    });
}

module.exports = infoAction;