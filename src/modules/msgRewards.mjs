import discord from "discord.js";

function onMessageCreate(cfg, client, db, msg) {
/*
	if (msg.content.startsWith(cfg.cmds.prefix)) return;

	if (
		msg.content.replace(' ', '').length < cfg.msgRewards.msgRequirements.minLength ||
		msg.content.split(' ').length < cfg.msgRewards.msgRequirements.minWords
	) return; // return if msg doesn't meet requirements

	// USESQL d.add("msgRewardsMsgCount." + msg.author.id, 1); // add 1 to user's msg count

	// USESQL if (d.get("msgRewardsMsgCount." + msg.author.id) % cfg.msgRewards.msgsBetweenLevelUp === 0) { // level up
		const embed = new discord.MessageEmbed()
			.setColor("GREEN")
			.setTitle("You leveled up!")
			.setDescription(
				"Congratulations <@!" + msg.author.id + ">,\n" +
				"\n"// +
				// USESQL "You are now on level **" + d.get("msgRewardsMsgCount." + msg.author.id) / cfg.msgRewards.msgsBetweenLevelUp + "**!"
			);
		msg.channel.send({ embeds: [embed] }).catch((e) => { });
			*/}

	// USESQL if (d.get("msgRewardsMsgCount." + msg.author.id) % cfg.msgRewards.msgsBetweenRewards === 0) { // if it is reward time
		// USESQL d.add("balance." + msg.author.id, cfg.msgRewards.rewardAmount);
//	}

//}

export {
	onMessageCreate
}
