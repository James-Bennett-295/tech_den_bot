export default {
	name: "guildMemberAdd",
	once: false,
	exe: function(cfg, client, db, member) {

		client.modules.joinLeaveLog.onGuildMemberAdd(cfg, client, db, member);
		client.modules.miscCaching.onGuildMemberAdd(cfg, client, db, member);

	}
}
