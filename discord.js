const Discord = require("discord.js");

const client = exports.client = new Discord.Client();

client.on("warn", console.log);
client.on("debug", console.log);
client.on("error", console.error);