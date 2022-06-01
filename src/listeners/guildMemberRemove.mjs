export default {
	name: "guildMemberRemove",
	once: false,
	exe: function (cfg, client, db, member) {

		client.modules.miscCaching.onGuildMemberRemove(cfg, client, db, member);
		client.modules.joinLeaveLog.onGuildMemberRemove(cfg, client, db, member);

	}
}
