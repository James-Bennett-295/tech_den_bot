"use strict";

module.exports = {
	name: "balance",
	minArgs: 0,
	usage: null,
	cooldown: 2000,
	description: "See how many coins you have!",
	category: "Economy",
	botOwnerOnly: false,
    staffOnly: false,
	execute(cfg, client, db, msg, args) {

		db.add("balance." + msg.author.id, 0); // so balance.<user> will be created if doesn't exist
        msg.reply("Your balance: `" + db.get("balance." + msg.author.id) + "`");

	},
};
