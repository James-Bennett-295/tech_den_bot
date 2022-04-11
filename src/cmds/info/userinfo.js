"use strict";

const discord = require("discord.js");

function sendUInfo(msg, member) {

	let uInfo = {
		srvJoinTime: Math.floor(member.joinedTimestamp / 1000),
		nickname: (member.nickname || "None"),
		roles: member._roles,
		id: member.user.id,
		username: member.user.username,
		discrim: member.user.discriminator,
		accCreatedTime: Math.floor(member.user.createdAt / 1000),
		avatarUrl: member.user.displayAvatarURL(),
		avatar: member.user.avatar
	}

	let embed = new discord.MessageEmbed()
		.setColor("AQUA")
		.setTitle("User Info")
		.addFields(
			{ name: "Guild Join Time", value: "<t:" + uInfo.srvJoinTime + ">", inline: true },
			{ name: "Nickname", value: (uInfo.nickname || "None"), inline: true },
			{ name: "Roles", value: uInfo.roles.length > 0 ? "<@&" + uInfo.roles.join(">, <@&") + ">" : "None", inline: true },
			{ name: "User ID", value: uInfo.id, inline: true },
			{ name: "Username", value: uInfo.username, inline: true },
			{ name: "Discriminator", value: uInfo.discrim, inline: true },
			{ name: "Account Created Time", value: "<t:" + uInfo.accCreatedTime + ">", inline: true },
			{ name: "Avatar", value: (uInfo.avatar || "Default avatar") }
		)
		.setImage(uInfo.avatarUrl);

	msg.reply({ embeds: [embed], allowedMentions: { parse: [] } });

}

module.exports = {
	name: "userinfo",
	minArgs: 0,
	usage: "<user (mention or ID)>",
	cooldown: 2500,
	description: "Get info about a user.",
	category: "Information",
	botOwnerOnly: false,
	staffOnly: false,
	execute(cfg, client, db, msg, args) {

		let member;
		if (args[0]) {
			let userId = args[0];
			if (args[0].startsWith('<')) userId = userId.slice(3, -1);
			if (userId.length !== 18 || isNaN(userId)) return msg.reply("Invalid user!");
			msg.guild.members.fetch().then((guildMembers) => {
				let member = guildMembers.get(userId);
				if (typeof (member) === "undefined") return msg.reply("That user could not be found.");
				sendUInfo(msg, member);
			});
		} else {
			sendUInfo(msg, msg.member);
		}

	},
}
