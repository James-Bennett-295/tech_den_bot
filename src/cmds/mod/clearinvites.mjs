import logger from "@james-bennett-295/logger";

export default {
	name: "clearinvites",
	minArgs: 0,
	usage: null,
	cooldown: 10000,
	description: "Delete all guild invites",
	category: "Moderation",
	botOwnerOnly: false,
	staffOnly: true,
	execute: function (cfg, client, db, msg, args) {

		msg.react("\ud83d\udd01").catch((e) => { }); // :reload:

		client.mainGuild.invites.fetch()
			.then((invitesMap) => {
				const invites = Array.from(invitesMap.values());
				for (let i = 0; i < invites.length; i++) {
					invites[i].delete();
				}
				msg.react("\u2705").catch((e) => { }); // :white_check_mark:
			})
			.catch((err) => {
				logger.error("[clearinvites cmd]: Failed to fetch mainGuild invites: " + err);
				msg.react("\u26a0\ufe0f").catch((e) => { }); // :warning:
			});
	}
}
