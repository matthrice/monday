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
 * loading one asset and returning it to the loaded resource map
 * 
 * util.populate(this.intro_layout, this.templates, 'slides')
 */ 
const populate = (filename, dest, key) => {
    return promiseFile(filename)
        .then((data) => {
            if (data) {
                // if it's an array, push the data to the array (create an empty one if not exist)
                if (Object.prototype.toString.call(dest[key]) === '[object Array]') {
                    dest.loaded[key] = dest.loaded[key] || [];
                    dest.loaded[key].push(data);
                // otherwise, just load data
                } else {
                    dest.loaded[key] = data;
                }
            }
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

export {
    loadPromise
}

