import { DiscordClient } from './src/util/discord-client';
import { prefix } from './config.json';

import { setAllCommands } from './src/commands/all-commands';
import { config } from 'dotenv';
config(); // Import .env environment variables

const client = new DiscordClient({
  messageCacheLifetime: 2,
  messageCacheMaxSize: 2,
  messageSweepInterval: 30
})

client.on('ready', () => {
  client.user.setPresence({
    activity: {
      name: `${prefix}help`,
      type: 'LISTENING'
    }
  })
})

setAllCommands(client);

client.on('ready', () => console.log('Logged in as ', client.user.username));
client.on('rateLimit', console.log);

client.onCommand('set_status', '', async (msg) => {
  if (client.dblIntegration) {
    const botInfo = await client.dbl.getBot(client.user.id);
    let isOwner = false;

    botInfo.owners.forEach(ownerId => {
      // Need to do this because topgg API is broken. It says ownerId is a number but it is a string.

      if (ownerId.toString() === msg.author.id.toString()) isOwner = true;
    })

    if (!isOwner) return;
  }

  const statusType = msg.content.toUpperCase().split(' ')[1].trim();
  const statusMsg = msg.content.split(' ').slice(2).join(' ');

  if ((statusType === 'LISTENING' || statusType === 'WATCHING') && statusMsg !== '') {
    client.user.setPresence({
      activity: {
        name: statusMsg,
        type: <'LISTENING' | 'WATCHING'>statusType
      }
    })

    client.setTimeout(() => {
      client.user.setPresence({
        activity: {
          name: `${prefix}help`,
          type: 'LISTENING'
        }
      })
    }, 3 * 24 * 60 * 60 * 1000) // 3 days
  }
})

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
