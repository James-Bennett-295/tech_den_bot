import logger from "@james-bennett-295/logger";
import fs from "node:fs";
import discord from "discord.js";
import db from "quick.db";
import readJson from "./util/readJson.mjs";
import onStart from "./onStart.mjs";

const cfg = await readJson("./config.json");

logger.config({
	debugEnabled: true,
	logsDir: "./logs/"
});

const client = new discord.Client({
	//restTimeOffset: 0,
	intents: [ // https://discord.com/developers/docs/topics/gateway#list-of-intents
		discord.Intents.FLAGS.GUILDS,
		discord.Intents.FLAGS.GUILD_MESSAGES,
		discord.Intents.FLAGS.GUILD_MEMBERS,
		discord.Intents.FLAGS.GUILD_INVITES
	]
});

onStart(cfg, client, db);

const eventFiles = fs.readdirSync("./src/listeners/").filter(file => file.endsWith(".mjs"));
for (const file of eventFiles) {
	const listenerMjs = await import("./listeners/" + file);
	const listener = listenerMjs.default;
	if (listener.once) {
		client.once(listener.name, (...args) => listener.execute(cfg, client, db, ...args));
	} else {
		client.on(listener.name, (...args) => listener.execute(cfg, client, db, ...args));
	}
}

client.login(cfg.app.token);
