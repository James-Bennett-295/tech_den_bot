import getJson from "../../util/getJson.mjs";
import discord from "discord.js";
import readJson from "../../util/readJson.mjs";

export default {
	name: "cat",
	minArgs: 0,
	usage: "<breed/\"getBreeds\">",
	cooldown: 2500,
	description: "Get a random cat image!",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	execute: async (cfg, client, db, msg, args) => {

		let breeds = await readJson("./cache/thecatapiBreeds.json");

		if (args[0] && args[0].toLowerCase() === "getbreeds") {
			return msg.reply("**__CAT BREEDS__**\n" + breeds.names.join(", ") + ".").catch((e) => { });
		}

		let url = "https://api.thecatapi.com/v1/images/search";

		if (args[0]) {
			let breedName = args.join(' ').toLowerCase();

			if (breeds.index[breedName]) {
				url += "?breed_ids=" + breeds.index[breedName];
			} else {
				return msg.reply("Breed not found!");
			}
		}

		getJson(url)
			.then((data) => {
				let embed = new discord.MessageEmbed()
					.setColor("AQUA")
					.setTitle("Here is your cat! \ud83d\udc31")
					.setImage(data[0].url)
					.setFooter({ text: "Source: thecatapi.com" });
				if (data[0].breeds.length > 0) {
					embed.setDescription("Breed: " + data[0].breeds[0].name);
				}
				msg.reply({ embeds: [embed] }).catch((e) => { });
			});

	}
}
