import getJson from "../../util/getJson.mjs"
import discord from "discord.js";
import logger from "@james-bennett-295/logger";

let wordPattern = /^[a-zA-Z]{1,256}$/;

function capitalize(txt) {
	let charArr = txt.split("");
	return charArr.shift().toUpperCase() + charArr.join("");
}

export default {
	name: "word",
	minArgs: 1,
	usage: "<word>",
	cooldown: 2500,
	description: "Get information about a word.",
	category: "Info",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		let word = args[0];

		if (!wordPattern.test(word)) {
			return msg.reply("The word you entered is invalid.");
		}

		getJson("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
			.then((data) => {

				let embed = new discord.MessageEmbed()
					.setColor("AQUA")
					.setTitle("Word Info")
					.setFooter({ text: "Source: dictionaryapi.dev" });
				for (let i = 0; i < data[0].meanings.length; i++) {
					embed.addField(capitalize(data[0].meanings[i].partOfSpeech), data[0].meanings[i].definitions[0].definition);
				}
				msg.reply({ embeds: [embed] }).catch((e) => { });

			})
			.catch((err) => {
				if (err.status === 404) {
					return msg.reply("No definitions found.");
				}
				logger.error("[word cmd]: Failed to fetch word info: " + err);
				msg.reply("Sorry but something went wrong while trying to fetch the word info.");
			});

	}
}
