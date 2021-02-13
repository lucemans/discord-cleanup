import { gray, green, white, cyan, red, yellow } from 'chalk';
import { Channel, Client, Collection, Guild, GuildChannel, Message, NewsChannel, Snowflake, TextChannel } from 'discord.js';
import { createInterface } from 'readline';
require('dotenv').config();

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

async function getGuild(guild_id: string): Promise<Guild> {
    return client.guilds.cache.find(g => g.id === guild_id);
}

async function getChannel(guild: Guild, channel_id: string): Promise<GuildChannel> {
    return guild.channels.cache.find(c => c.id == channel_id);
}

async function askQuestion(q: string, validate: (reply) => boolean | Promise<boolean>) {
    return new Promise<string>((resolve, reject) => {
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        rl.question(q, async (reply) => {
            rl.close();
            if (await validate(reply)) {
                resolve(reply);
            } else {
                resolve(await askQuestion(q, validate));
            }
        });
    });
}

async function fetchLast(channel: TextChannel, amount: number, before: Snowflake = null): Promise<Collection<string, Message>> {
    console.log(log.info + gray('Fetching messages... (last ' + amount + ')'));
    let messages: Collection<string, Message>;
    if (before)
        messages = await channel.messages.fetch({ limit: amount, before: before });
    else
        messages = await channel.messages.fetch({ limit: amount });
    return messages;
}

async function handleMessages(channel: TextChannel, before: Snowflake = null) {
    const messages = await fetchLast(channel, 20, before);

    if (messages.size === 0) {
        console.log(log.success + "Reached end of line");
        return;
    }

    let last: Snowflake = before;
    for (const snowflake of messages.keyArray()) {
        const message = messages.get(snowflake);
        last = snowflake;
        let shouldDelete = false;
        
        // If message contains media, DONT delete it.
        if (message.attachments.size > 0) {
            continue;
        }
        
        // If message contains specified keyword, DONT delete it.
        // if (message.cleanContent.includes('== Results')) {
            // continue;
        // }

        // If message contains JUST an EMOJI, delete it.
        // if (message.cleanContent.match(/^\<.*?\:.*?\>$/g) != null) {
        //     console.log(log.info + gray('Found Emoji'));
        //     shouldDelete = true;
        // }

        // Otherwise
        // Ask user what to do with message
        console.log(log.msg + "(" + message.author.username + ") > \"" + message.cleanContent + "\"")
        shouldDelete = shouldDelete || ((await askQuestion(log.ask + 'Delete? (Y/n)', (reply) => (reply && reply.length > 0 && (['Y', 'y', 'n', 'N'].includes(reply))))).toLowerCase() == 'y');
        if (shouldDelete) {
            console.log(log.info + gray('Deleting...'));
            await message.delete();
            console.log(log.success + "Deleted");
        } else {
            console.log(log.info + "Skipped");
        }
    }

    console.log('Last', + last);

    handleMessages(channel, last);
}

const log = {
    success: white('[') + green('SUCCESS') + white('] '),
    info: white('[') + gray('INFO') + white('] '),
    ask: white('[') + cyan('ASK') + white('] '),
    warning: white('[') + red('WARNING') + white(']'),
    msg: white('[') + yellow('MSG') + white(']'),
}


async function init() {
    const guild_id = process.env.GUILD || await askQuestion(log.ask + gray('What guild? '), reply => (reply.length > 0 && !isNaN(reply)));

    console.log(log.info + gray('Finding Guild...'));
    const guild = await getGuild(guild_id);

    if (guild == null) {
        console.log(log.warning + gray('No Guild with this ID was found'));
        init();
        return;
    }

    console.log(log.success + gray('Found guild ') + guild.name);

    const channel = await getChannel(guild, process.env.CHANNEL || await askQuestion(log.ask + gray('What Channel? '), async (reply) => (reply.length > 0 && !isNaN(reply))));

    if (channel == null) {
        console.log(log.warning + gray('No Channel with this ID was found'));
        return;
    }

    console.log(log.success + gray('Channel found ') + channel.name);

    if (!channel.isText()) {
        console.log(log.warning + gray('This channel is not a text channel'));
    }

    const ch = channel as TextChannel;
    handleMessages(ch);
}

client.on('ready', async () => {
    console.log(log.success + 'Logged In Successfully');
    init();
});

client.login(process.env.TOKEN);

