import { DiscordClient } from './src/util/discord-client';
import { prefix } from './config.json';
import DBL from 'dblapi.js';

import { setAllCommands } from './src/commands/all-commands';
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
      name: `New Updates!`,
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

setAllCommands(client, dbl);

client.on('ready', () => console.log('Logged in as ', client.user.username));

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
