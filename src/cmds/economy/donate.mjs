import logger from "@james-bennett-295/logger";

const amountPattern = /^0*[1-9]+[0-9]*$/;

export default {
	name: "donate",
	minArgs: 2,
	usage: "<amount> <user>",
	cooldown: 2000,
	description: "Give money to a user.",
	category: "Economy",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		if (!amountPattern.test(args[0])) {
			return msg.reply("Invalid amount!").catch((e) => { });
		}

		const amount = parseInt(args[0]);

		let userId = args[1];
		if (args[1].startsWith("<@!")) {
			userId = userId.slice(3, -1);
		} else if (args[1].startsWith("<@")) {
			userId = userId.slice(2, -1);
		}

		if (userId.length !== 18 || isNaN(userId)) return msg.reply("Invalid user!").catch((e) => { }); // UREGXP

		db.get(`
			SELECT *
			FROM balance
			WHERE user = ?;
		`, msg.author.id, (err, rowI) => {

			if (err !== null) {
				return logger.error("[donate cmd]: Failed to fetch row from database:", err);
			}

			if (rowI.balance < amount) {
				return msg.reply("You don't have enough money.").catch((e) => { });
			}

			db.get(`
				SELECT *
				FROM balance
				WHERE user = ?;
			`, userId, (err, rowJ) => {

				if (err !== null) {
					return logger.error("[donate cmd]: Failed to fetch row from database:", err);
				}

				if (typeof rowJ === "undefined") {

					msg.guild.members.fetch().then((guildMembers) => {

						let member = guildMembers.get(userId);
						if (typeof (member) === "undefined") {
							return msg.reply("That user could not be found.").catch((e) => { });
						};

						if (member.user.bot) return msg.reply("That user is a bot.").catch((e) => { });

						db.run(`
							UPDATE balance
							SET balance = ?
							WHERE user = ?;
						`, rowI.balance - amount, msg.author.id, () => {
							db.run(`
								INSERT INTO balance (user, balance)
								VALUES(?, 1);
							`, userId, () => {
								msg.react("\u2705").catch((e) => { }); // :white_check_mark:
							});
						});

					});
				} else {

					db.run(`
						UPDATE balance
						SET balance = ?
						WHERE user = ?;
					`, rowI.balance - amount, msg.author.id, () => {
						db.run(`
							UPDATE balance
							SET balance = ?
							WHERE user = ?;
						`, rowJ.balance + amount, userId, () => {
							msg.react("\u2705").catch((e) => { }); // :white_check_mark:
						});
					});
				}

			});

		});
	}
}
