# wppm - Wordpress Plugin Manager
- Install your plugins as a piece of cake (like npm and composer)

## Usage


1. Install wppm using npm( nodejs required ):

```
npm install -g wppm
```

2. Run wppm using a command:

```
wppm [command] [args...]
```

---

## Commands

- install - install plugins
- search - search plugins
- info - get information about plugin

```
wppm install [pluginSlugs...]
```

![install](http://filebin.ca/34vISHgonXDv/install-opt.gif)

---

### Install using wppm.json

* In the terminal, go to the directory of wppm.json and run the command below:

```
wppm install
```

- The model of wppm.json

```
{
    "dependencies": {
        "plugin-slug": "",
        "another-plugin-slug": "",
        "other-plugin-slug": ""
        ...
    }
}
``` 

![install-json](http://filebin.ca/34w4CjgOeOcv/install-json.gif)

---

### Saving installation in wppm.json

* You can save your plugins installation in wppm.json using *--save* option
![save-install](http://filebin.ca/35ARlNb6vN3P/save-install.gif)

---

### Install specific versions of plugins

* You can install old version of plugins( see 'wppm info plugin-slug' to see the available versions)

* Just like npm, wppm follows package@version, unluckily the WP plugins'versions didn't follow semantic version (semver) accurately, but wppm tries to make the best approach to it.

![install-version](http://filebin.ca/35ALe2DDhSq4/install-version.gif)

---

```
wppm search <search-term>
```

![search](http://filebin.ca/34vPvItF1Q2J/search.gif)


---

```
wppm info <plugin-slug>
```

![info](http://filebin.ca/34vSaT18uImu/info.gif)

## Authors
* Lucas Vendramini

## License
* MIT
