import DiscordClient from './src/util/DiscordClient';
import Discord, { Message, TextChannel } from 'discord.js';
import { prefix } from './config.json';
import onCommand from './src/util/command';
import startGame from './src/game/vsBot/startGame';
import startChallenge from './src/game/multiplayer/startChallenge';

import { config } from 'dotenv';
config(); // Import .env environment variables

const client = new DiscordClient();

onCommand(client, 'help',
  new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Handcricketer Help')
    .setDescription('Following is a list of all handcricketer commands.')
    .addFields(
      { name: `${prefix}play`, value: 'Start a game with the bot. This command will also work in a DM with the bot.' },
      { name: `${prefix}challenge`, value: `Challenge a person to multiplayer battle (in DM)` },
      { name: `${prefix}dm`, value: 'Sends a DM so that the user can play versus bot privately.' },
      { name: `${prefix}rules - Explain the rules.`, value: `Explain the rules of the game.` }
)
.setTimestamp())

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

onCommand(client, 'play', 'Starting Game', (msg: Message) => startGame(client, msg.channel as TextChannel, msg));
onCommand(client, 'dm', `You've received mail ;)`, (msg: Message) => msg.author.send('You can use any commands here.'));

onCommand(
  client,
  'challenge',
  'Starting Multiplayer Challenge',
  (msg: Message) => {
    if (msg.channel.type != 'dm') startChallenge(client, msg.channel as TextChannel, msg)
  }
)

client.on('ready', () => console.log('Logged In'));

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
