import logger from "@james-bennett-295/logger";

const msgIdPattern = /^[0-9]{18}$/;

export default {
	name: "purgeuntil",
	minArgs: 1,
	usage: "<id of message to stop before>",
	cooldown: 6000,
	description: "Clear up to before a certain message.",
	category: "Moderation",
	botOwnerOnly: false,
	staffOnly: true,
	exe: function (cfg, client, db, msg, args) {

		if (!msgIdPattern.test(args[0])) {
			return msg.reply("Invalid message ID provided").catch((e) => { });
		}

		msg.channel.messages.fetch({ limit: 100 })
			.then((messages) => {

				const messagesKeys = Array.from(messages.keys());

				for (let i = messagesKeys.length - 1; i > 0; i--) {
					if (messages.get(messagesKeys[i]).id === args[0]) break;
					messages.delete(messagesKeys[i]);
				}

				msg.channel.bulkDelete(messages);

			}).catch((err) => {
				logger.error("[purgeuntil cmd]: An error occured while trying to fetch messages: ", err);
			});

	}
}
