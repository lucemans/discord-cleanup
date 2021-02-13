# Discord Channel Cleaner Utility

The aim of this application is to clean messages in discord channels, through both auto-moderated, and case-by-case basis means.

## Usage

### Prerequisites

* NodeJS
* A Discord Bot with Token (see [this tutorial](https://discordjs.guide/preparations/setting-up-a-bot-application.html))

### Running

Simply run the NPM start script
When running yarn

```shell
yarn start
```

or if you prefer using NPM

```shell
npm start
```

## Configuration

Required Parameters in the `.env` file

```env
TOKEN=InsertYourDiscordBotTokenHere
```

Optional Parameters in the `.env` file
`GUILD` and `CHANNEL` can be set to skip the initial question phase. You can retrieve these ID's from right clicking the server/channel icon and selecting `Copy ID`

```env
GUILD=11111111111111111
CHANNEL=11111111111111111
```
