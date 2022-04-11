export default {
	name: "guildMemberAdd",
	once: false,
	execute: function(cfg, client, db, member) {

		client.modules.inviteLog.onGuildMemberAdd(cfg, client, db, member);

	}
}
