import logger from "@james-bennett-295/logger";

export default {
	name: "balance",
	minArgs: 0,
	usage: null,
	cooldown: 2000,
	description: "See how many coins you have!",
	category: "Economy",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		db.get(`
			SELECT *
			FROM balance
			WHERE user = ?;
		`, msg.author.id, (err, row) => {
			if (err !== null) {
				logger.error("[balance cmd]: Failed to fetch user's balance from database: " + err);
				msg.reply("Sorry but I failed to get your balance.").catch((e) => { });
				return;
			}
			if (typeof row === "undefined") {
				return msg.reply("Your balance: `0`").catch((e) => { });
			}
			msg.reply("Your balance: `" + row.balance + "`").catch((e) => { })
		});

	}
}
