export default {
	name: "guildMemberRemove",
	once: false,
	execute: function(cfg, client, db, member) {

		client.modules.miscCaching.onGuildMemberRemove(cfg, client, db, member);

	}
}
