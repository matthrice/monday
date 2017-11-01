const fs = require('fs');
const path = require('path');
const http = require('http');

/*
 * Promise for reading files
 * 
 * @return {Promise.<string>} file contents
 */ 
const promiseFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    })
}

/*
 * Promise for GET requests
 */ 
const promiseGET = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
    
            res.on('data', (chunk) => {
                data += chunk;
            });
    
            res.on('err', (err) => {
                console.log(err);
                reject();
            });
    
            res.on('end', () => {
                resolve(data);
            });
        });
    });
}   

/*
 * Promise for either GET or file
 */ 
const loadPromise = (str) => {
    if (str.match(/^https?:\/\//)) {
        return promiseGET(str);
    }
    else {
        return promiseFile(str);
    }
}

/*
 * loading one asset and returning it to the loaded resource map
 * 
 * util.populate(this.intro_layout, this.templates, 'slides')
 */ 
const populate = (filename, dest, key) => {
    return loadPromise(filename)
        .then((data) => {
            if (data) {
                // if an array already exists, just push the data
                if (Object.prototype.toString.call(dest[key]) === '[object Array]') {
                    dest.loaded[key] = dest.loaded[key] || [];
                    dest.loaded[key].push(data);
                // otherwise, just initialize a new piece of data
                } else {
                    dest.loaded[key] = data;
                }
            }
        });
}

/*
 * loads files from map and places them into loaded
 * 
 * @return {Promise.<Array.<Object>>} same map with a loaded field
 */ 
const loadMap = (map, opt) => {
    let promises = [];
    let loaded = {}; // dictionary to be filled with data promises
    let filename;
    
    let options = opt || {};

    // iterates through keys
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            filename = map[key];
            // adds them to iterable promises, with loaded on the same keys receiving data
            promises.push(loadPromise(filename)
                .then((key2) => {
                    return (data) => {
                        loaded[key2] = data;
                    };
                })(key));
        }
    }

    map.loaded = loaded;

    return Promise.all(promises);
}

/*
 * Load any user settings defined in a json file
 */ 
const loadSettings = (source, dest) => {
    return loadPromise(source)
        .then((data) => {
            if (data) {
                data = JSON.parse(data);
                dest.override = data.override;
            }
        })
}

/*
 * Put it all together to load the templates, styles, and scripts
 */ 
const loadTemplateAndStyle = (source, central_dest) => {
    source += '/';

    return Promises.all([
        loadSettings(source + 'settings.json', central_dest),
        populate(source + 'style.css', central_dest.external, 'style'),
        populate(source + 'layout.pug', central_dest.templates, 'layout'),
        populate(source + 'template.pug', central_dest.templates, 'slides'),
        populate(source + 'script.js', central_dest.external, 'script')
    ]);
}

export {
    loadPromise,
    populate,
    loadMap,
    loadTemplateAndStyle
}

