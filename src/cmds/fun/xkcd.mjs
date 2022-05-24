import xkcd from "xkcd-wrapper";
import logger from "@james-bennett-295/logger";
import discord from "discord.js";

export default {
	name: "xkcd",
	minArgs: 0,
	usage: null,
	cooldown: 5000,
	description: "Get a random post from xkcd.com!",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function(cfg, client, db, msg, args) {

		xkcd.getRandom()
			.then((obj) => {
				let embed = new discord.MessageEmbed()
					.setColor("AQUA")
					.setTitle(obj.title)
					.setURL(obj.link)
					.setDescription(obj.alt)
					.setImage(obj.imgUrl)
					.setFooter({ text: "Source: xkcd.com" });
					msg.reply({ embeds: [embed] }).catch((e) => { });
			})
			.catch((err) => {
				logger.error("[xkcd cmd]: xkcd.getRandom() errored: ", err);
				msg.reply("Sorry but something went wrong while trying to fetch an XKCD post.").catch((e) => { });
			});

	}
}
