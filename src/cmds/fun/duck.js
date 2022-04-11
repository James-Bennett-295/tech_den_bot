"use strict";

const discord = require("discord.js");
const data = require("../../../cache/randomduk.json");

module.exports = {
	name: "duck",
	minArgs: 0,
	usage: "<\"gif\"/\"image\"/\"\">",
	cooldown: 2000,
	description: "Get an image of a duck!",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	execute(cfg, client, db, msg, args) {

		let embed = new discord.MessageEmbed()
			.setColor("AQUA")
			.setTitle("Here is your duck! \ud83e\udd86")
			.setFooter({ text: "Source: random-d.uk" })

		if (args[0] && args[0].toLowerCase() === "image") {
			let imgChoice = Math.floor(Math.random() * (data.imgCount - 2) + 1);
			embed.setImage("https://random-d.uk/api/" + data.imgs[imgChoice - 1]);
		} else if (args[0] && args[0].toLowerCase() === "gif") {
			let gifChoice = Math.floor(Math.random() * (data.gifCount - 2) + 1);
			embed.setImage("https://random-d.uk/api/" + data.gifs[gifChoice - 1]);
		} else {
			if (Math.random() < 0.5) {
				let imgChoice = Math.floor(Math.random() * (data.imgCount - 2) + 1);
				embed.setImage("https://random-d.uk/api/" + data.imgs[imgChoice - 1]);
			} else {
				let gifChoice = Math.floor(Math.random() * (data.gifCount - 2) + 1);
				embed.setImage("https://random-d.uk/api/" + data.gifs[gifChoice - 1]);
			}
		}

		msg.reply({ embeds: [embed] }).catch((e) => { });

	},
}
