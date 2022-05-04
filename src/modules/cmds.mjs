import logger from "@james-bennett-295/logger";
import discord from "discord.js";
import fs from "node:fs";
import stringSimilarity from "string-similarity";

function handleCmd(cfg, client, db, msg, args, cmdName) {

	if (cfg.cmds.blockedUsers.includes(msg.author.id)) return;

	const cmd = client.cmds.get(cmdName);

	if (!client.cmdCooldowns.has(cmdName)) {
		client.cmdCooldowns.set(cmdName, new discord.Collection());
	}

	const now = Date.now();
	const timestamps = client.cmdCooldowns.get(cmdName);

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cmd.cooldown;
		if (now < expirationTime) {
			return msg.react('\u231b');
		}
	}

	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cmd.cooldown);

	if (cmd.botOwnerOnly && cfg.botOwnerId !== msg.author.id) return msg.reply("Only the bot owner is allowed to use that command!");

	if (cmd.staffOnly && !msg.member.roles.cache.has(cfg.roles.staff)) return msg.reply("Only staff are allowed to use that command!");

	if (cmd.minArgs > args.length) {
		if (cmd.minArgs === 1) {
			msg.reply("This command requires **1** argument but you didn't provide any. Run `!help command " + cmdName + "` if you need help with this command.");
		} else if (args.length === 0) {
			msg.reply("This command requires **" + cmd.minArgs + "** arguments but you didn't provide any. Run `!help command " + cmdName + "` if you need help with this command.");
		} else {
			msg.reply("This command requires **" + cmd.minArgs + "** arguments but you only provided **" + args.length + "**. Run `!help command " + cmdName + "` if you need help with this command.");
		}
		return;
	}

	try {
		cmd.execute(cfg, client, db, msg, args);
	} catch (err) {
		logger.error(err);
		msg.reply("Sorry, something went wrong.");
	}

}

const onStart = async (cfg, client, db) => {

	client.cmds = new discord.Collection();
	client.cmdCooldowns = new discord.Collection();
	client.cmdCategories = [];
	client.categoryCmds = {}
	const cmdFolders = fs.readdirSync("./src/cmds/");

	for (const folder of cmdFolders) {
		const cmdFiles = fs.readdirSync("./src/cmds/" + folder).filter(file => file.endsWith(".mjs"));
		for (const file of cmdFiles) {
			try {
				const cmdMjs = await import("../cmds/" + folder + "/" + file);
				const cmd = cmdMjs.default;
				client.cmds.set(cmd.name, cmd);
				if (!client.categoryCmds[cmd.category]) client.categoryCmds[cmd.category] = [];
				client.categoryCmds[cmd.category].push(cmd.name);
				if (!client.cmdCategories.includes(cmd.category)) client.cmdCategories.push(cmd.category);
			} catch (err) {
				logger.error("[cmds module]: failed to load command file: " + folder + "/" + file + "\nERROR: " + err);
			}
		}
	}

}

function onMessageCreate(cfg, client, db, msg) {

	if (!msg.content.startsWith(cfg.cmds.prefix)) return;
	if (msg.content.length === cfg.cmds.prefix.length) return;
	if (msg.channel.type === "dm") return;

	const args = msg.content.slice(cfg.cmds.prefix.length).trim().split(/ +/);
	const cmdName = args.shift().toLowerCase();

	if (client.cmds.has(cmdName)) {

		handleCmd(cfg, client, db, msg, args, cmdName);

	} else {

		let matches = stringSimilarity.findBestMatch(cmdName, Array.from(client.cmds.keys()));

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

		let noCmdMsg = {}

		collector.on("collect", (i) => {
			if (i.customId === btnYesId) {
				handleCmd(cfg, client, db, msg, args, matches.bestMatch.target);
			}
			i.message.delete();
		});

		msg.reply({ content: "There is no command with that name! Did you want to run the `" + matches.bestMatch.target + "` command?", components: [row] })
			.then((message) => {
				Object.assign(noCmdMsg, message);
				collector.on("end", (collected) => {
					message.delete()
						.catch(e => { });
				});
			});

	}

}

export {
	onMessageCreate,
	onStart
}
