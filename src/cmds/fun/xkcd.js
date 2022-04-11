"use strict";

const xkcd = require("xkcd-wrapper");
const logger = require("@james-bennett-295/logger");
const discord = require("discord.js");

module.exports = {
	name: "xkcd",
	minArgs: 0,
	usage: null,
	cooldown: 5000,
	description: "Get a random post from xkcd.com!",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	execute(cfg, client, db, msg, args) {

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
				logger.error("[xkcd cmd]: xkcd.getRandom() errored: " + err);
			});

	},
}
