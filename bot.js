// Import the discord.js module
const Discord = require('discord.js');
// Get Duration of MP3
const mp3Duration = require('mp3-duration');
// Create an instance of a Discord client
const client = new Discord.Client();
//add sleep
const sleep = require('sleep');
var totalSoundDuration = 13000;
// The token of your bot - https://discordapp.com/developers/applications/me
const AuthDetails = require("./auth.json");
// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
//Function to find number of letters and play a Sound
function soundPerWord(phrase, connection) {
    var numberOfLetters = 0;
    console.log("Phrase: " + phrase);
    for (i = 0; i < phrase.length; i++){
        if (phrase[i] != " ") {
            numberOfLetters++;
        }
        if (phrase[i] == " " || i==(phrase.length-1)){
            console.log("Number of letters: " + numberOfLetters);
            if (numberOfLetters <= 3) {
                var sound1 = 'Sounds/bear1' + Math.ceil(Math.random() * 2) + '.mp3';
                mp3Duration(sound1, function(err, duration) {
                    if (err) return console.log(err.message);
                        const dispatcher = connection.playFile(sound1);
                        console.log("duration: "+duration);
                        console.log("Playing: "+ sound1);
                        sleep.sleep(1);
                    console.log("Word of size three or less duration:" + duration);
                    totalSoundDuration += (duration*1000);
                    console.log("Total Sound Duration:"+totalSoundDuration);
                });
                process.on('unhandledRejection', console.error);
            } else if (numberOfLetters <= 7) {
                var sound2 = 'Sounds/bear2' + Math.ceil(Math.random() * 4) + '.mp3';
                mp3Duration(sound2, function(err, duration) {
                    if (err) return console.log(err.message);
                    setTimeout(function() {
                        const dispatcher = connection.playFile(sound2);
                        console.log("Playing: "+ sound2);
                    }, (duration*1000));
                    console.log("Word of size 3<x<7 duration:" + duration);
                    totalSoundDuration += (duration*1000);
                    console.log("Total Sound Duration:"+totalSoundDuration);
                });
                process.on('unhandledRejection', console.error);
            } else if (numberOfLetters >= 8) {
                var sound3 = 'Sounds/bear3' + Math.ceil(Math.random() * 2) + '.mp3';
                mp3Duration(sound3, function(err, duration) {
                    if (err) return console.log(err.message);
                    setTimeout(function() {
                        const dispatcher = connection.playFile(sound3);
                        console.log("Playing: "+ sound3);
                    }, (duration*1000));
                    console.log("Word of size x>=7 duration:" + duration);
                    totalSoundDuration += (duration*1000);
                    console.log("Total Sound Duration:"+totalSoundDuration);
                });
                process.on('unhandledRejection', console.error);
            }
            numberOfLetters = 0;
        }
    }
}
client.on('ready', () => {
    console.log('I am ready! ');
});
client.on('message', message => {
    const tegu = message.guild.emojis.find("name", "tegu");
    message.react(tegu.id);
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 5) == '/ttbs') {
        const channel = message.member.voiceChannel;
        if (channel != null) {
            var bearMessage = message.content.substring(6, message.content.length);
            var newMessage = "*In bear speech:* " + bearMessage;
            message.channel.send(newMessage)
                .then(function(message) {
                    message.react(tegu.id);
                });
            message.delete()
                .then(msg => console.log(`Deleted message from ` + msg.author + ' '))
                .catch(console.error);
            channel.join()
                .then(connection => {
                    soundPerWord(bearMessage, connection);
                }).catch(console.error);
            console.log(totalSoundDuration);
            setTimeout(function() {
                channel.leave();
                console.log("disconnected ");
            }, totalSoundDuration);
        }
    };
});
// Log our bot in
client.login(AuthDetails.token);
