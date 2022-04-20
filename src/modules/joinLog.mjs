import discord from "discord.js";
import logger from "@james-bennett-295/logger";

function onReady(cfg, client, db) {
	logger.debug("[joinLog module]: Caching invites...");
	client.inviteUses = {}
	client.mainGuild.invites.fetch()
		.then((invites) => {
			invites.forEach((invite) => {
				client.inviteUses[invite.code] = invite.uses;
			});
			logger.debug("[joinLog module]: Invites cached");
		});
}

function onInviteCreate(cfg, client, db, invite) {
	client.inviteUses[invite.code] = invite.uses;
	logger.debug("[joinLog module]: Invite \"" + invite.code + "\" added to cache");
}

function onInviteDelete(cfg, client, db, invite) {
	delete client.inviteUses[invite.code];
	logger.debug("[joinLog module]: Invite \"" + invite.code + "\" removed from cache");
}

function onGuildMemberAdd(cfg, client, db, member) {
	client.mainGuild.invites.fetch()
		.then((invites) => {
			let newInviteUses = {}
			invites.forEach((invite) => {
				newInviteUses[invite.code] = invite.uses;
			});
			let inviteUsed = {}
			Object.keys(newInviteUses).forEach((code) => {
				if (newInviteUses[code] !== client.inviteUses[code]) {
					let invite = invites.find(i => i.uses > client.inviteUses[i.code]);
					Object.assign(inviteUsed, invite);
				}
			});
			Object.assign(client.inviteUses, newInviteUses);
			let logChannel = client.mainGuild.channels.cache.get(cfg.channels.joinLog);
			let embed;
			if (inviteUsed) {
				embed = new discord.MessageEmbed()
					.setColor("AQUA")
					.addFields(
						{ name: "Member", value: "<@!" + member.user.id + "> (`" + member.user.tag + "`)" },
						{ name: "Account Created Time", value: "<t:" + Math.floor(member.user.createdAt.getTime() / 1000) + ">" },
						{ name: "Invite Code", value: inviteUsed.code },
						{ name: "Inviter", value: "<@!" + inviteUsed.inviterId + "> (`" + inviteUsed.inviter.tag + "`)" },
						{ name: "Invite Uses", value: inviteUsed.uses.toString() },
						{ name: "Invite Max Uses", value: inviteUsed.maxUses === 0 ? "No Limit" : inviteUsed.maxUses.toString() },
						{ name: "Invite Channel", value: inviteUsed.channelId ? "<#" + inviteUsed.channelId + ">" : "N/A" },
						{ name: "Invite Created Time", value: "<t:" + Math.floor(inviteUsed.createdTimestamp / 1000) + ">" },
						{ name: "Invite Expire Time", value: inviteUsed._expiresTimestamp ? "<t:" + Math.floor(inviteUsed._expiresTimestamp / 1000) + ">" : "None" }
					);
			} else {
				embed = new discord.MessageEmbed()
					.setColor("ORANGE")
					.setDescription("Could not find invite used.")
					.addFields(
						{ name: "Member", value: "<@!" + member.user.id + "> (`" + member.user.tag + "`)" },
						{ name: "Account Created Time", value: "<t:" + Math.floor(msg.author.createdAt.getTime() / 1000) + ">" }
					)
			}
			logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
		});
}

export { onReady, onGuildMemberAdd, onInviteCreate, onInviteDelete }
