import logger from "@james-bennett-295/logger";
import discord from "discord.js";

export default {
	name: "clearinvites",
	minArgs: 0,
	usage: null,
	cooldown: 10000,
	description: "Delete all guild invites",
	category: "Moderation",
	botOwnerOnly: false,
	staffOnly: true,
	exe: function (cfg, client, db, msg, args) {

		msg.react("\ud83d\udd01").catch((e) => { }); // :reload:

		client.mainGuild.invites.fetch()
			.then((invitesMap) => {
				const invites = Array.from(invitesMap.values());
				let inviteDataStr = `####################
# OLD INVITES DATA #
####################
				`;
				for (let i = 0; i < invites.length; i++) {
					inviteDataStr += `
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Code:            ${invites[i].code}
Channel:         ${(invites[i].channelId || "None")}
Created At:      ${Math.floor(invites[i].createdTimestamp / 1000)}
Would Expire At: ${Math.floor(invites[i].expiresTimestamp / 1000) || "Never"}
Creator:         ${invites[i].inviterId}
Max Uses:        ${invites[i].maxUses === 0 ? "No limit" : invites[i].maxUses}
Times Used:      ${invites[i].uses}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					`;
					invites[i].delete();
				}
				msg.react("\u2705").catch((e) => { }); // :white_check_mark:

				const logFile = new discord.MessageAttachment(Buffer.from(inviteDataStr), "oldInvitesData.txt");
				msg.reply({ files: [logFile] }).catch((e) => {});
			})
			.catch((err) => {
				logger.error("[clearinvites cmd]: Failed to fetch mainGuild invites: ", err);
				msg.react("\u26a0\ufe0f").catch((e) => { }); // :warning:
			});
	}
}
