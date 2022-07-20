import getJson from "../../util/getJson.mjs";
import discord from "discord.js";
import readJson from "../../util/readJson.mjs";

export default {
	name: "cat",
	minArgs: 0,
	usage: "<breed/\"getBreeds\">",
	cooldown: 6000,
	description: "Get a random cat image!",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	exe: async (cfg, client, db, msg, args) => {

		let breeds = await readJson("./cache/thecatapiBreeds.json");

		if (args[0] && args[0].toLowerCase() === "getbreeds") {
			return msg.reply("**__CAT BREEDS__**\n`" + breeds.names.join("`, `") + "`.").catch((e) => { });
		}

		let url = "https://api.thecatapi.com/v1/images/search?limit=10&order=Desc";

		if (args[0]) {
			let breedName = args.join(' ').toLowerCase();

			if (breeds.names.includes(breedName)) {
				url += "&breed_ids=" + breeds.index[breedName];
			} else {
				return msg.reply("Breed not found!").catch((e) => { });
			}
		}

		const btnPrevId = (client.btnId++).toString();
		let btnPrev = new discord.MessageButton()
			.setCustomId(btnPrevId)
			.setStyle("PRIMARY")
			.setEmoji(cfg.guildEmojis.arrowPrev)
			.setDisabled(true);
		const btnNextId = (client.btnId++).toString();
		let btnNext = new discord.MessageButton()
			.setCustomId(btnNextId)
			.setStyle("PRIMARY")
			.setEmoji(cfg.guildEmojis.arrowNext)
			.setDisabled(false);
		let row = new discord.MessageActionRow()
			.addComponents(
				btnPrev,
				btnNext
			);

		const filter = i => (i.customId === btnPrevId || i.customId === btnNextId) && i.user.id === msg.author.id && i.message.createdTimestamp > client.processStartTime;
		const collector = msg.channel.createMessageComponentCollector({ filter, time: 600000 }); // 10 mins

		let imgNum = 0;
		let data = await getJson(url + "&page=0");
		let imgs = [];
		for (let i = 0; i < data.length; i++) {
			imgs.push(data[i].url);
		}

		let embed = new discord.MessageEmbed()
			.setColor("AQUA")
			.setTitle("Here is your cat! \ud83d\udc31")
			.setURL(imgs[0])
			.setImage(imgs[0])
			.setFooter({ text: "Source: thecatapi.com" });

		const onCollect = async (i) => {

			if (i.customId === btnPrevId) {
				if (imgNum > 0) imgNum--;
				if (imgNum === 0) btnPrev.setDisabled(true);
			} else if (i.customId === btnNextId) {
				if (imgNum >= 0) btnPrev.setDisabled(false);
				if (imgs.length % 10 !== 0) {
					btnNext.setDisabled(true);
				} else {
					imgNum++;
				}
			}

			if (imgNum >= imgs.length) {
				data = await getJson(url + "&page=" + Math.ceil(imgNum / 10));
				for (let i = 0; i < data.length; i++) {
					imgs.push(data[i].url);
				}
			}

			row = new discord.MessageActionRow()
				.addComponents(
					btnPrev,
					btnNext
				);

			if (embed["description"]) delete embed["description"];

			embed
				.setURL(imgs[imgNum])
				.setImage(imgs[imgNum]);

			i.update({ components: [row], embeds: [embed] });
		}
		collector.on("collect", (i) => {
			onCollect(i);
		});

		msg.reply({ components: [row], embeds: [embed] })
			.then((message) => {
				collector.on("end", (collected) => {
					message.edit({ components: [] }).catch((e) => { });
				});
			})
			.catch((e) => { });
	}
}
