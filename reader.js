/**
 * Reader class to manage a discord guilds messages.
 */
const Discord = require('discord.js');

const defaultPrefs = {
    channel: "default",
    bufferSize: 0,
    fullstop: ".",
    limitToWord: false
};

/**
 * Message filter for the Readers
 * @param {*} message 
 */
function readMessage(message) {
    if (message.author.bot) {return false;}
    if (this.userBuffer && this.bufferSize > 0) {
        return !this.userBuffer.includes(message.author.id);
    }
    if (this.limitToWord) {
        return !/\s/g.test(message.content);
    }
    if (message.content == this.fullstop) {
        this.stop(`${message.author.tag} sent fullstop`);
        return false;
    }
    return true;
}

class MessageReader extends Discord.MessageCollector {
    /**
     * Constructs the reader Class and creates the first message collector
     * @param {*} channel
     * @param {*} prefs 
     */
    constructor(channel, prefs) {
        super(channel, readMessage);
        
        if (prefs.writeChannel) {
            this.writeChannel = channel.guild.channels.get(prefs.writeChannel);
        }

        this.bufferSize = prefs.bufferSize;
        this.fullstop = prefs.fullstop;
        this.limitToWord = prefs.limitToWord;

        this.userBuffer = [];
    }
    /**
     * Creates a new reader object with default settings.
     * @param {*} channel 
     */
    static buildDefault(channel) {
        var defPref = defaultPrefs;
        defPref.channel = channel;
        return new MessageReader(channel, defPref);
    }

    /**
     * Compiles and returns the story as currently written
     */
    get currentStory() {
        return this.collected.reduce((story, word) => {
            return story + " " + word.content;
        });
    }
    /**
     * Called when ready to publish
     */
    cleanup() {
        var fullStory = this.currentStory,
            publishChannel;
        if (this.writeChannel) {
            publishChannel = this.writeChannel;
        } else {
            publishChannel = super.channel;
        }
        publishChannel.send(fullStory)
        .then(super.cleanup())
        .catch(e => {throw e;});
    }
}

module.exports = MessageReader;