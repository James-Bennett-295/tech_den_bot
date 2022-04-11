"use strict";

module.exports = {
	name: "donate",
	minArgs: 2,
	usage: "<amount of coins> <user (ID or mention)>",
	cooldown: 5000,
	description: "Share coins with another member!",
	category: "Economy",
	botOwnerOnly: false,
	staffOnly: false,
	execute(cfg, client, db, msg, args) {

		db.add("balance." + msg.author.id, 0); // so balance.<user> will be created if doesn't exist
		if (db.get("balance." + msg.author.id) < 1) return msg.reply("You can't donate money as you don't have any!");
		if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
			return msg.reply("Invalid number! Make sure the number you entered is valid and above 0.");
		}
		if (parseInt(args[0]) > db.get("balance." + msg.author.id)) {
			return msg.reply("You don't have enough money to do that!");
		}

		let userId = args[1];
		if (args[1].startsWith('<')) userId = userId.slice(3, -1);
		if (userId.length !== 18 || isNaN(userId)) return msg.reply("Invalid user!");

		client.mainGuild.members.fetch().then((guildMembers) => {
			let member = guildMembers.get(userId);
			if (typeof (member) === "undefined") return msg.reply("That user could not be found.");
			if (member.user.bot) return msg.reply("That user is a bot.");
			db.set("balance." + msg.author.id, db.get("balance." + msg.author.id) - parseInt(args[0]));
			db.add("balance." + member.user.id, parseInt(args[0]));
			msg.react('\u2705').catch((e) => { });
		});

	},
}
