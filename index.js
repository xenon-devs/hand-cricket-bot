const Discord = require('discord.js');
const { prefix } = require('./config.json');

const onCommand = require('./src/util/command');
const startGame = require('./src/game/startGame');

require('dotenv').config();
const client = new Discord.Client();

onCommand(client, 'help handcricket', `\
${prefix}play - Start a game with the bot.
${prefix}rules - Explain the rules
`)

onCommand(client, 'rules',
  new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Extremely Official Rules of Hand Cricket')
    .setDescription('One player bowls and the other bats. The player has to type any number between 0 and 6(representing the number of fingers), once the player enters, the bot will generate a random number as it\'s output.')
    .addFields(
      { name: '1. ', value: 'If the number of fingers are equal, the batsman is out.' },
      { name: '2. ', value: 'If the number of fingers do not match, the number of fingers on the batsman is the number of runs scored.' },
      { name: '3. ', value: 'All rules of cricket apply.' }
    )
    .setTimestamp()
)

onCommand(client, 'play', 'Starting Game', (msg) => startGame(client, msg.channel, msg));
client.on('ready', () => console.log('Logged In'));

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
