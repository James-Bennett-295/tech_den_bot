import logger from "@james-bennett-295/logger";
import fs from "node:fs";
import discord from "discord.js";
import sqlite3 from "sqlite3";
import keyValPairs from "key-value-pairs";
import readJson from "./util/readJson.mjs";
import onStart from "./onStart.mjs";

const cfg = await readJson("./config.json");

logger.config({
	debugEnabled: true,
	logsDir: "./logs/"
});

let db = new sqlite3.Database("./db.sqlite3");
keyValPairs.setDb(db);
db
	.run(`
		CREATE TABLE IF NOT EXISTS reminders (
			id				INTEGER		PRIMARY KEY		AUTOINCREMENT,
			time			TEXT			NOT NULL,
			channel		TEXT			NOT NULL,
			msg				TEXT			NOT NULL,
			user			TEXT			NOT NULL,
			reply			TEXT			NOT NULL
		);
	`)
	.run(`
		CREATE TABLE IF NOT EXISTS balance (
			user			TEXT	PRIMARY KEY,
			balance		INT		NOT NULL
		);
	`)
	.run(`
		CREATE TABLE IF NOT EXISTS msgCount (
			user		TEXT	PRIMARY KEY,
			count		INT		NOT NULL
		);
	`);

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
for (let i = 0; i < eventFiles.length; i++) {
	const listenerMjs = await import("./listeners/" + eventFiles[i]);
	const listener = listenerMjs.default;
	if (listener.once) {
		client.once(listener.name, (...args) => listener.execute(cfg, client, db, ...args));
	} else {
		client.on(listener.name, (...args) => listener.execute(cfg, client, db, ...args));
	}
}

client.login(cfg.app.token);
