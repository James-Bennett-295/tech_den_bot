export default {
	name: "getpp",
	minArgs: 0,
	usage: null,
	cooldown: 1000,
	description: "Get your pp size!",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function(cfg, client, db, msg, args) {

		msg.reply("Your PP:\t8" + "=".repeat(Math.floor(Math.random() * 12) + 1) + "D");

	}
}
