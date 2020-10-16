import { DiscordClient } from './src/util/discord-client';
import { prefix } from './config.json';
import DBL from 'dblapi.js';

import { SinglePlayerMatch } from './src/game/single-player';
import { MultiPlayerMatch } from './src/game/multi-player';

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

client.on('ready', () => console.log('Logged in as ', client.user.username));

const tryLogin = () => {
  console.log('Login failed. Trying again');
  setTimeout(() => client.login(process.env.DISCORD_TOKEN).catch(tryLogin), 1000);
}
client.login(process.env.DISCORD_TOKEN).catch(tryLogin);
