/**
 * Handles all the data stored within this data file
 */
const fs = require('fs');
    path = require('path');

/**
 * Converts Reader Class to a JSON-safe object
 */
exports.readerToObject = function toData(reader) {
    return {
        readChannel: reader.readChannel,
        writeChannel: reader.writeChannel,
        bufferSize: reader.settings.userBuffer,
        fullstop: reader.settings.endMsg,
        limitToWord: reader.settings.limitWords
    };
};

/**
 * Searches for a data file and returns the JSON object
 */
exports.getReaderData = function getData(guildID) {
    return new Promise((resolve, reject) => {
        fs.promises.readFile(path.join(__dirname, guildID + ".json"), 'utf8')
            .then(f => resolve(JSON.parse(f)))
            .catch(reject);
    });
};

/**
 * Edits the given reader file based on the provided data, if the file cannot be found, a new one is made
 */
exports.editReaderData = function editData(dataObj) {
    return new Promise((resolve, reject) => {
        var jsonData = JSON.stringify(dataObj, null, 4);
        fs.promises.writeFile(path.join(__dirname, dataObj.guild + ".json"), jsonData, 'utf8')
              .then(resolve)
              .catch(reject);
    });
};

/**
 * Checks to see if a file exists for the guild
 */
exports.readerDataExists = function dataExists(guildID) {
    return fs.promises.access(path.join(__dirname, guildID + ".json"), fs.constants.F_OK);
};

/**
 * Returns an array of all guildID's with a file in storage
 */
exports.getDataList = function listData() {
    return new Promise((resolve, reject) => {
        fs.promises.readdir(__dirname, 'utf8')
            .then(files => {
                resolve(files.reduce((dataFiles, f) => {
                    if (f.endsWith(".json")) {
                        dataFiles.push(f.slice(0, -5));
                    }
                    return dataFiles;
                }, []));
            })
            .catch(reject);
    });
};

/**
 * Returns all saved data objects currently in the directory
 */
exports.getAllData = async function getAll() {
    var allData;
    await exports.getDataList()
        .then(files => {
             allData = Promise.all(files.map(exports.getReaderData));
        })
        .catch(console.error);
    return allData;
};