# Hand Cricketer
A [discord](https://discord.com) bot that plays Hand Cricket!

[![servers](https://top.gg/api/widget/servers/709733907053936712.svg)](https://top.gg/bot/709733907053936712)
[![votes](https://top.gg/api/widget/upvotes/709733907053936712.svg)](https://top.gg/bot/709733907053936712)

### Add to your server
This bot is hosted by [@Eniamza](https://github.com/Eniamza). Invite it from [top.gg](https://top.gg/bot/709733907053936712). Use the command `?help` for more info.

### Self Hosting (or dev environment)
1. Create a discord app on https://discord.com/developers/applications
2. Add a bot to the application
3. Get the token
4. Clone this repo and host it
5. Add a `.env` variable named `DISCORD_TOKEN` and put the token there.
6. Add a `.env` variable named `dbLoc` which is an **absolute path** to a **safe, secure, backed up** folder where the database will reside.
7. Add the bot to your server (this step is more difficult than you think so google it)

#### Optional top.gg integration
1. List your bot on [top.gg](https://top.gg)
2. Create a DBL API token [here](https://top.gg/api/docs)
3. Add another `.env` variable named `DBL_TOKEN` and put the token there.
Your guild count will be posted on top.gg and vote count will be available in the stats command of the bot.

### Setting Up Locally
1) Use yarn to install the required packages.
```bash
yarn install
```
2) Add the `.env` variables.

3) `yarn start` to build and start the bot or `yarn dev` to 
