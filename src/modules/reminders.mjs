import discord from "discord.js";
import logger from "@james-bennett-295/logger";

function onReady(cfg, client, db) {

	let embed = new discord.MessageEmbed()
		.setColor("AQUA")
		.setTitle("Reminder! \u23f0");

	setInterval(() => {

		logger.debug("[reminders module]: Doing reminders check");

		const now = new Date();

		db.each(`
			SELECT *
			FROM reminders;
		`, (err, reminder) => {

			if (parseInt(reminder.time) > now.getTime()) return;

			embed.setDescription(reminder.msg);

			const channel = client.mainGuild.channels.cache.get(reminder.channel);

			if (typeof channel === "undefined") {
				return logger.debug("[reminders module]: Not sending reminder as typeof channel is \"undefined\"");
			}

			channel.send({
				content: "<@!" + reminder.user + ">",
				embeds: [embed],
				allowedMentions: { users: [reminder.user] }
			});

			channel.messages.fetch(reminder.reply)
				.then((replyMsg) => {
					replyMsg.edit("I reminded you at \<t:" + Math.floor(now.getTime() / 1000) + ">").catch((e) => { });
				})
				.catch((e) => { });

			db.run(`
				DELETE FROM reminders
				WHERE id = ?;
			`, reminder.id);
		});

	}, 60000);

}

export {
	onReady
}
