import discord from "discord.js";
import logger from "@james-bennett-295/logger";

function onMessageCreate(cfg, client, db, msg) {

	if (msg.content.startsWith(cfg.cmds.prefix)) return;

	// return if msg doesn't meet requirements
	if (
		msg.content.replace(' ', '').length < cfg.msgRewards.msgRequirements.minLength ||
		msg.content.split(' ').length < cfg.msgRewards.msgRequirements.minWords
	) return;

	db.get("SELECT * FROM msgCount WHERE user = ?", msg.author.id, (err, rowI) => {

		if (err !== null) {
			return logger.error("[msgRewards cmd]: Failed to select row from database:", err);
		}

		// +1 to user's msgCount count
		if (typeof rowI === "undefined") {
			db.run(`
				INSERT INTO msgCount (user, count)
				VALUES(?, ?);
			`, msg.author.id, 1);
		} else {
			db.run(`
				UPDATE msgCount
				SET count = ?
				WHERE user = ?;
			`, rowI.count + 1, msg.author.id);
		}

		const msgCount = typeof rowI === "undefined" ? 1 : rowI.count + 1;

		// Level up
		if (msgCount % cfg.msgRewards.msgsBetweenLevelUp === 0) {

			const level = msgCount / cfg.msgRewards.msgsBetweenLevelUp;

			const embed = new discord.MessageEmbed()
				.setColor("GREEN")
				.setTitle("You leveled up!")
				.setDescription(
					"Congratulations <@!" + msg.author.id + ">,\n" +
					"\n" +
					"You are now on level **" + level + "**!"
				);
			msg.channel.send({ embeds: [embed] }).catch((e) => { });
		}

		// Reward
		if (msgCount % cfg.msgRewards.msgsBetweenRewards === 0) {

			// +{cfg.msgRewards.rewardAmount} to user's balance
			db.get("SELECT * FROM balance WHERE user = ?", msg.author.id, (err, rowJ) => {

				if (err !== null) {
					return logger.error("[msgRewards cmd]: Failed to select row from database:", err);
				}

				if (typeof rowJ === "undefined") {
					db.run(`
						INSERT INTO balance (user, balance)
						VALUES(?, ?);
					`, msg.author.id, cfg.msgRewards.rewardAmount);
				} else {
					db.run(`
						UPDATE balance
						SET balance = ?
						WHERE user = ?;
					`, rowJ.balance + cfg.msgRewards.rewardAmount, msg.author.id);
				}
			});
		}

	});

}

export {
	onMessageCreate
}
