# hand-cricket-bot
A discord bot that plays handcricket!

### Add the bot to your server
Open https://discord.com/api/oauth2/authorize?client_id=721390046715969576&permissions=0&scope=bot and ADD IT! (This is hosted by a third party because they needed it on their server, there is no guarantee that it will be hosted reliably)

### Self Hosting
1. Create a discord app on https://discord.com/developers/applications
2. Add a bot to the application
3. Get the token
4. Clone this repo and host it
5. Add a `.env` variable named `DISCORD_TOKEN` and put the token there.
6. Add the bot to your server (this step is more difficult than you think so google it)

### Setting Up Locally
Use yarn to install the required packages.
```bash
yarn install
```

`yarn build` is for building the js dist files from ts, `yarn dev` will build upon update.
`yarn start` will build and start the bot, `yarn devServer` will start nodemon which will look for changes and run the bot locally (`yarn dev` should be run in a separate terminal).