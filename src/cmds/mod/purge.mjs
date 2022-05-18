import logger from "@james-bennett-295/logger";

export default {
	name: "purge",
	minArgs: 1,
	usage: "<message count>",
	cooldown: 6000,
	description: "Quickly clear recent messages in a channel.",
	category: "Moderation",
	botOwnerOnly: false,
	staffOnly: true,
	execute: function (cfg, client, db, msg, args) {

		/* input validation */
		if (isNaN(args[0])) {
			return msg.reply("The message count provided is invalid!").catch((e) => { });
		}
		const msgCount = parseInt(args[0]);
		if (msgCount < 2 || msgCount > 99) {
			return msg.reply("The message count must be between 2 and 99.").catch((e) => { });
		}

		msg.react("\ud83d\udd01"); // :reload:
		msg.channel.messages.fetch({ limit: msgCount + 1 })
			.then((fetchedMessages) => {

				const mentionedUsers = msg.mentions.users.map(u => { return u.id; });
				const messages = fetchedMessages.filter(m => mentionedUsers.length === 0 || mentionedUsers.includes(m.author.id));
				let index = 0;
				let cmdMsg = {};

				messages.forEach((message) => {
					if (index === 0) {
						Object.assign(cmdMsg, message);
						index = 1;
						return;
					}
					message.delete().catch((e) => { });
					index++;
				});

				msg.react("\u2705"); // :white_check_mark:
				setTimeout(() => {
					msg.delete().catch((e) => { });
				}, 2500);

			}).catch((err) => {
				logger.error("[purge cmd]: An error occured while trying to fetch messages: " + err);
				msg.react("\u26a0\ufe0f"); // :warning:
			});

	}
}
