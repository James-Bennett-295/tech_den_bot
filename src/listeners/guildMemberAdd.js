"use strict";

module.exports = {
	name: "guildMemberAdd",
	once: false,
	execute(cfg, client, db, member) {

		client.modules.inviteLog.onGuildMemberAdd(cfg, client, db, member);

	},
}
