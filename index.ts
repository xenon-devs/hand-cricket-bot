import { DiscordClient } from './src/util/discord-client';
import { prefix } from './config.json';

import { setAllCommands } from './src/commands/all-commands';
import { config } from 'dotenv';
config(); // Import .env environment variables

const client = new DiscordClient();

client.on('ready', () => {
  client.user.setPresence({
    activity: {
      name: `Leaderboard! See the help command`,
      type: 'LISTENING'
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
})

setAllCommands(client);

client.on('ready', () => console.log('Logged in as ', client.user.username));

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
