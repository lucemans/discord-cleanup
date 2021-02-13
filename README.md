# Discord Channel Cleaner Utility

The aim of this application is to clean messages in discord channels, through both auto-moderated, and case-by-case basis means.

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
