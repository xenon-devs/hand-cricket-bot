# hand-cricket-bot
A discord bot that plays handcricket

### Hosted
This bot is hosted by [@Eniamza](https://github.com/Eniamza). Invite it from [top.gg](https://top.gg/bot/709733907053936712)

### Self Hosting
1. Create a discord app on https://discord.com/developers/applications
2. Add a bot to the application
3. Get the token
4. Clone this repo and host it
5. Add a `.env` variable named `DISCORD_TOKEN` and put the token there.
6. Add the bot to your server (this step is more difficult than you think so google it)

#### Optional top.gg integration
1. List your bot on [top.gg](https://top.gg)
2. Create a DBL API token [here](https://top.gg/api/)
3. Add another `.env` variable named `DBL_TOKEN` and put the token there.
Your guild count will be posted on top.gg and vote count will be available in the stats command of the bot.

### Setting Up Locally
Use yarn to install the required packages.
```bash
yarn install
```

`yarn start` will build and start the bot.
