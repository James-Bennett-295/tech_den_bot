export default {
	name: "unixtimestamp",
	minArgs: 1,
	usage: "<unix timestamp>",
	cooldown: 1000,
	description: "Convert a unix timestamp to an ISO date.",
	category: "Conversion",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		if (isNaN(args[0])) {
			return msg.reply("Unix timestamp input is not a valid number.").catch((e) => { });
		}

		const timestamp = parseInt(args[0]);
		const date = new Date(timestamp * 1000);
		let isoDate;
		try {
			isoDate = date.toISOString();
		} catch (e) {
			return msg.reply("Invalid time value entered.").catch((e) => { })
		}

		msg.reply("`" + isoDate + "`").catch((e) => { });

	}
}
