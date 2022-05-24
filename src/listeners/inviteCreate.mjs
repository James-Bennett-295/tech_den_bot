export default {
	name: "inviteCreate",
	once: false,
	exe: function (cfg, client, db, invite) {

		client.modules.miscCaching.onInviteCreate(cfg, client, db, invite);

	}
}
