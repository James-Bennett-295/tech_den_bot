import discord from "discord.js";
import stringSimilarity from "string-similarity";

export default {
	name: "help",
	minArgs: 0,
	usage: "<\"category\"/\"command\"> <category name/command name>",
	cooldown: 2000,
	description: "Get help with commands.",
	category: "Utility",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function(cfg, client, db, msg, args) {

		let embed = new discord.MessageEmbed()
			.setColor("AQUA");

		// if no args
		if (args.length == 0) {

			embed
				.setTitle("Help: Category list. \ud83d\udcdc")
				.setDescription("Run `" + cfg.cmds.prefix + "help category <category>` to get a list of commands in a category.\n\n**Categories:**\n`" + client.cmdCategories.join("`\n`") + "`");
			msg.reply({ embeds: [embed] }).catch((e) => { });

			// if category
		} else if (args[0].toLowerCase() == "category") {

			if (args.length < 2) return msg.reply("You must specify a category!").catch((e) => { });
			let categoriesLower = [];
			for (let i = 0; i < client.cmdCategories.length; i++) {
				categoriesLower.push(client.cmdCategories[i].toLowerCase());
			}
			// if category exists
			if (categoriesLower.includes(args.slice(1, args.length).join(" ").toLowerCase())) {
				let categoryName = client.cmdCategories[categoriesLower.indexOf(args.slice(1, args.length).join(" ").toLowerCase())];
				embed
					.setTitle("Help: " + categoryName + " category. \ud83d\udcdc")
					.setDescription("Run `" + cfg.cmds.prefix + "help command <command>` to get help with a command.\n\n**Commands:**\n`" + client.categoryCmds[categoryName].join("`\n`") + "`");
				msg.reply({ embeds: [embed] }).catch((e) => { });
				// if category doesn't exist
			} else {

				let matches = stringSimilarity.findBestMatch(args.slice(1, args.length).join(" ").toLowerCase(), categoriesLower);

				const btnYesId = (client.btnId++).toString();
				let btnYes = new discord.MessageButton()
					.setCustomId(btnYesId)
					.setLabel("Yes")
					.setStyle("SUCCESS")
					.setDisabled(false);
				const btnNoId = (client.btnId++).toString();
				let btnNo = new discord.MessageButton()
					.setCustomId(btnNoId)
					.setLabel("No")
					.setStyle("DANGER")
					.setDisabled(false);
				let row = new discord.MessageActionRow()
					.addComponents(
						btnYes,
						btnNo
					);

				const filter = i => (i.customId === btnYesId || i.customId === btnNoId) && i.user.id === msg.author.id && i.message.createdTimestamp > client.processStartTime;
				const collector = msg.channel.createMessageComponentCollector({ filter, time: 60000 });

				let categoryName = client.cmdCategories[categoriesLower.indexOf(matches.bestMatch.target)];
				collector.on("collect", (i) => {
					if (i.customId === btnYesId) {
						embed
							.setTitle("Help: " + categoryName + " category. \ud83d\udcdc")
							.setDescription("Run `" + cfg.cmds.prefix + "help command <command>` to get help with a command.\n\n**Commands:**\n`" + client.categoryCmds[categoryName].join("`\n`") + "`");
						i.update({ content: null, embeds: [embed], components: [] });
					} else if (i.customId === btnNoId) {
						i.update({ content: "That category does not exist!", components: [] });
					}
				});

				msg.reply({ content: "That category does not exist! Did you mean `" + categoryName + "`?", components: [row] })
					.then((message) => {
						collector.on("end", (collected) => {
							message.edit({ components: [] });
						});
					})
					.catch((e) => { });
			}

			// if command
		} else if (args[0].toLowerCase() == "command") {

			if (args.length < 2) return msg.reply("You must specify a command!").catch((e) => { });

			// if command doesn't exist
			if (!client.cmds.has(args[1].toLowerCase())) {
				let matches = stringSimilarity.findBestMatch(args[1].toLowerCase(), Array.from(client.cmds.keys()));

				const btnYesId = (client.btnId++).toString();
				let btnYes = new discord.MessageButton()
					.setCustomId(btnYesId)
					.setLabel("Yes")
					.setStyle("SUCCESS")
					.setDisabled(false);
				const btnNoId = (client.btnId++).toString();
				let btnNo = new discord.MessageButton()
					.setCustomId(btnNoId)
					.setLabel("No")
					.setStyle("DANGER")
					.setDisabled(false);
				let row = new discord.MessageActionRow()
					.addComponents(
						btnYes,
						btnNo
					);

				const filter = i => (i.customId === btnYesId || i.customId === btnNoId) && i.user.id === msg.author.id && i.message.createdTimestamp > client.processStartTime;
				const collector = msg.channel.createMessageComponentCollector({ filter, time: 60000 });

				collector.on("collect", (i) => {
					if (i.customId === btnYesId) {
						const cmd = client.cmds.get(matches.bestMatch.target);
						embed
							.setTitle("Help: " + matches.bestMatch.target + " command. \ud83d\udcdc")
							.setDescription(cmd.description)
							.addFields(
								{ name: "Minimum arguments", value: cmd.minArgs.toString() },
								{ name: "Usage", value: cfg.cmds.prefix + cmd.name + " " + (cmd.usage || "") },
								{ name: "Cooldown", value: (cmd.cooldown / 1000) + "s" },
								{ name: "Category", value: cmd.category },
								{ name: "Bot owner only", value: cmd.botOwnerOnly ? "Yes" : "No" }
							);
						i.update({ content: null, embeds: [embed], components: [] });
					} else if (i.customId === btnNoId) {
						i.update({ content: "That command does not exist!", components: [] });
					}
				});

				msg.reply({ content: "That command does not exist! Did you mean `" + matches.bestMatch.target + "`?", components: [row] })
					.then((message) => {
						collector.on("end", (collected) => {
							message.edit({ components: [] });
						});
					})
					.catch((e) => { });
				// if command exists
			} else {
				const cmd = client.cmds.get(args[1].toLowerCase());
				embed
					.setTitle("Help: " + args[1].toLowerCase() + " command. \ud83d\udcdc")
					.setDescription(cmd.description)
					.addFields(
						{ name: "Minimum arguments", value: cmd.minArgs.toString() },
						{ name: "Usage", value: cfg.cmds.prefix + cmd.name + " " + (cmd.usage || "") },
						{ name: "Cooldown", value: (cmd.cooldown / 1000) + "s" },
						{ name: "Category", value: cmd.category },
						{ name: "Bot owner only", value: cmd.botOwnerOnly ? "Yes" : "No" }
					);

				msg.reply({ embeds: [embed] }).catch((e) => { });
			}

			// if not command or category
		} else {

			msg.reply("That is not an option!").catch((e) => { });

		}

	}
}
