import { DiscordClient } from './src/util/discord-client';
import { prefix, useCustomStatus, customStatus } from './config.json';

import { setAllCommands } from './src/commands/all-commands';
import { config } from 'dotenv';
config(); // Import .env environment variables

const client = new DiscordClient();

client.on('ready', () => {
  if (useCustomStatus) {
    client.user.setPresence({
      activity: {
        name: customStatus.name,
        type: <'WATCHING' | 'LISTENING' | 'PLAYING'>customStatus.type
      }
    })
  }

  client.setTimeout(() => {
    client.user.setPresence({
      activity: {
        name: `${prefix}help`,
        type: 'LISTENING'
      }
    })
  }, useCustomStatus ? 3 * 24 * 60 * 60 * 1000 : 0) // 3 days or 0
})

setAllCommands(client);

client.on('ready', () => console.log('Logged in as ', client.user.username));

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
