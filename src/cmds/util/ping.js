"use strict";

module.exports = {
	name: "ping",
	minArgs: 0,
	usage: null,
	cooldown: 1000,
	description: "See if the bot is responding.",
	category: "Utility",
	botOwnerOnly: false,
    staffOnly: false,
	execute(cfg, client, db, msg, args) {

		msg.reply("Pong! \ud83c\udfd3");

	},
};
