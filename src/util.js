const fs = require('fs');
const path = require('path');
const http = require('http');

/*
 * Promise for reading files
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

export {
    loadPromise
}

