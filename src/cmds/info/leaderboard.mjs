import logger from "@james-bennett-295/logger";
import discord from "discord.js";

export default {
	name: "leaderboard",
	minArgs: 0,
	usage: null,
	cooldown: 5000,
	description: "Get the leaderboard of people with the most money.",
	category: "Information",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		db.all(`
			SELECT * FROM balance ORDER BY balance DESC;
		`, (err, rows) => {

			if (err !== null) {
				logger.error("[leaderboard cmd]: Failed to fetch data from database:", err);
				msg.reply("Failed to fetch balance info.");
				return;
			}

			const leaderboardUsers = rows.slice(0, 5);

			const embed = new discord.MessageEmbed()
				.setColor("AQUA")
				.setTitle("Leaderboard")
				.setDescription("See who has the most money!");

			msg.guild.members.fetch().then((guildMembers) => {
				for (let i = 0; i < leaderboardUsers.length; i++) {
					let member = guildMembers.get(leaderboardUsers[i].user);

					if (typeof member === "undefined") {
						embed.addField(
							leaderboardUsers[i].user,
							leaderboardUsers[i].balance + " coins"
						);
					} else {
						embed.addField(
							member.user.tag,
							leaderboardUsers[i].balance + " coins"
						);
					}
				}

				msg.reply({ embeds: [embed] }).catch((e) => { });
			});

		});

	}
}
