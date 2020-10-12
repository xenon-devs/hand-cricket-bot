import { DiscordClient } from './src/util/discord-client';
import Discord, { Message, MessageEmbed, TextChannel, DMChannel } from 'discord.js';
import { prefix } from './config.json';
import DBL from 'dblapi.js';

import { SinglePlayerMatch } from './src/game/single-player';

import { config } from 'dotenv';
config(); // Import .env environment variables

const client = new DiscordClient();
let dbl: DBL | null = null;

if (process.env.DBL_TOKEN) {
  dbl = new DBL(process.env.DBL_TOKEN, client)
  dbl.on('error', console.log)
}

client.on('ready', () => {
  client.user.setPresence({
    activity: {
      name: `${prefix}help`,
      type: 'LISTENING'
    }
  })
})

client.onCommand('help', '', async (msg: Message, prefix: string) => {
  const helpEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Hand Cricketer Help')
    .setDescription(`\
**Custom Prefix**: You can use a custom prefix in a certain server by changing the nickname of the bot to \`[prefix] Name\`. Here the prefix can be anything such as \`!\`, \`?\` or \`.\` and the rest of the nickname doesn't matter and can be anything.

Following is a list of all Hand Cricketer commands.
`)
    .addFields(
      { name: `${prefix}help`, value: 'Help Command.' },
      { name: `${prefix}play`, value: 'Start a game with the bot. This command will also work in a DM with the bot.' },
      { name: `${prefix}challenge`, value: `Challenge a person to multiplayer battle (in DM)` },
      { name: `${prefix}dm`, value: 'Sends a DM so that the user can play versus bot privately.' },
      { name: `${prefix}rules`, value: `Explain the rules of the game.` },
      { name: `${prefix}stats`, value: 'Stats about the bot.'}
    )
    .setTimestamp()
    .setThumbnail(client.user.displayAvatarURL())
    .addField('Vote and Invite', `[top.gg](https://top.gg/bot/${client.user.id})`, true)
    .addField(`It's Open Source`, `[Github](https://github.com/HarshKhandeparkar/hand-cricket-bot)`, true)

    if (dbl !== null) {
      const botStats = await dbl.getBot(client.user.id);

      if (botStats.support) helpEmbed.addField('Support Server', `[Join It!](https://discord.gg/${botStats.support})`, true);
    }

    msg.channel.send(helpEmbed);
})

client.onCommand('rules', '', async (msg: Message) => {
  const rulesEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Extremely Official Rules of Hand Cricket')
    .setDescription('One player bowls and the other bats. The player has to type any number between 0 and 6(representing the number of fingers), once the player enters, the bot will generate a random number as it\'s output.')
    .addFields(
      { name: '1. ', value: 'If the number of fingers are equal, the batsman is out.' },
      { name: '2. ', value: 'If the number of fingers do not match, the number of fingers on the batsman is the number of runs scored.' },
      { name: '3. ', value: 'All rules of cricket apply.' }
    )
    .setThumbnail(client.user.displayAvatarURL())
    .setTimestamp()

  msg.channel.send(rulesEmbed);
})

client.onCommand('play', 'Starting Game', async (msg: Message) => new SinglePlayerMatch(client, <TextChannel>msg.channel, msg.author));
client.onCommand('dm', `You've received mail ;)`, (msg: Message) => msg.author.send('You can use any commands here.'));

client.onCommand('stats', '', async (msg: Message) => {
  const statsEmbed = new MessageEmbed()
    .setTitle('Hand Cricketer Stats')
    .addField('Servers', `\`${client.guilds.cache.array().length}\``, true)
    .addField('Users', `\`${client.guilds.cache.array().map(guild => guild.memberCount).reduce((a, b) => a + b)}\``, true)
    .setThumbnail(client.user.displayAvatarURL())

  if (dbl !== null) {
    const botStats = await dbl.getBot(client.user.id);
    statsEmbed.addField(`top.gg votes`, `\`${botStats.points}\``, true);

    if (botStats.invite) statsEmbed.addField('Vote and Invite', `[top.gg](https://top.gg/bot/${client.user.id})`, true);
  }

  msg.channel.send(statsEmbed);
})

// client.onCommand(
//   'challenge',
//   'Starting Multiplayer Challenge',
//   (msg: Message) => {
//     if (msg.channel.type != 'dm') startChallenge(client, msg.channel as TextChannel, msg)
//   }
// )

client.on('ready', () => console.log('Logged in as ', client.user.username));

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
