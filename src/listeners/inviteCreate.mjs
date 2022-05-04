export default {
	name: "inviteCreate",
	once: false,
	execute: function (cfg, client, db, invite) {

		client.modules.miscCaching.onInviteCreate(cfg, client, db, invite);

	}
}
