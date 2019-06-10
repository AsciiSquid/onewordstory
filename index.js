const Reader = require("./reader.js");

function test() {
    const discord = require("discord.js");
    var client = new discord.Client();

    client.on("ready", () => {
        var testChannel = client.channels.get("587145668846419968");
        var testReader = new Reader(testChannel, {
            channel: "587145668846419968",
            writeChannel: "587145718045736972",
            bufferSize: 0,
            fullstop: ".",
            limitToWord: false
        });

        testReader.on("collect", (m, r) => {
            console.log(m);
            console.log(r.recieved);
        });

        testReader.on("end", (c, r) => {
            console.log(r);
        });
    });

    client.login("MzQ3NDE0ODY3NDQ5NDc5MTY5.XNo34w.Xr28YpxqMI99PEWR8wBLQ1Vi1Hg");
}

test();