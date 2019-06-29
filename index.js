const Reader = require("./reader.js");
const Bot = require("./discord.js");
const Data = require("./data");

const settings = require("./settings.json");

var library = [];

async function constructReaders(rDataList) {
    await rDataList.forEach(rData => {
        var channel = Bot.client.channels.get(rData.readChannel);
        if (channel) {
            library.push(new Reader(channel, rData));
        }
    });
    console.log(library);
}

function startup() {
    console.log(`Logged in as ${Bot.client.user.username} within ${Bot.client.guilds.size} guilds!`);

    Data.getAllData()
    .then(constructReaders)
    .catch(console.error);
}

Bot.client.on("ready", startup);

if (settings) {
    Bot.client.login(settings.token)
    .then()
    .catch(console.error);
} else {
    console.error("settings.json file missing!");
}