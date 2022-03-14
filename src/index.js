"use strict";

const logger = require("@james-bennett-295/logger");
const fs = require("node:fs");
const discord = require("discord.js");
const db = require("quick.db");
const cfg = require("../config.json");
const onStart = require("./onStart.js");

logger.config({
    debugEnabled: true,
    logsDir: "./logs/"
});

const client = new discord.Client({
    //restTimeOffset: 0,
    intents: [ // https://discord.com/developers/docs/topics/gateway#list-of-intents
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_MESSAGES,
        discord.Intents.FLAGS.GUILD_MEMBERS
    ]
});

onStart(cfg, client, db);

const eventFiles = fs.readdirSync("./src/listeners/").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const listener = require("./listeners/" + file);
    if (listener.once) {
        client.once(listener.name, (...args) => listener.execute(cfg, client, db, ...args));
    } else {
        client.on(listener.name, (...args) => listener.execute(cfg, client, db, ...args));
    };
};

client.login(cfg.app.token);
