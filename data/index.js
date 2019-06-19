/**
 * Handles all the data stored within this data file
 */
const fs = require('fs');

/**
 * Converts Reader Class to a JSON-safe object
 */
exports.readerToObject = function toData(reader) {
    return {
        guild: reader.guildID,
        channel: {
            read: reader.readChannel,
            write: reader.writeChannel
        },
        settings: {
            userBuffer: reader.settings.userBuffer,
            endMsg: reader.settings.endMsg,
            limitWords: reader.settings.limitWords
        }
    };
};

/**
 * Searches for a data file and returns the JSON object
 */
exports.getReaderData = function getData(guildID, callback) {
    fs.readFile(guildID + ".json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            callback(err);
        }
        callback(JSON.parse(data));
    });
};

/**
 * Edits the given reader file based on the provided data, if the file cannot be found, a new one is made
 */
exports.editReaderData = function editData(dataObj, callback) {
    var jsonData = JSON.stringify(dataObj, null, 4);
    fs.writeFile(dataObj.guild + ".json", jsonData, 'utf8', (err) => {
        if (err) {
            callback(err);
        } else {
            callback(dataObj);
        }
    });
};

/**
 * Checks to see if a file exists for the guild
 */
exports.readerDataExists = function dataExists(guildID, callback) {
    fs.access(guildID + ".json", fs.constants.F_OK, (err) => {
        callback(!err);
    });
};

/**
 * Returns an array of all guildID's with a file in storage
 */
exports.getDataList = function listData(callback) {
    fs.readdir(__dirname, 'utf8', (err, files) => {
        if (err) { throw err; }
        callback( files.filter((f) => {
            f.endsWith(".json");
        }));
    });
};

exports.getAllData = function getAll(callback) {
    listData(files => {
        files.forEach(f => {
            getData(f.replace(".json", ""), callback);
        });
    });
};