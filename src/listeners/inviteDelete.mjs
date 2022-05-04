export default {
	name: "inviteDelete",
	once: false,
	execute: function (cfg, client, db, invite) {

		client.modules.miscCaching.onInviteDelete(cfg, client, db, invite);

	}
}
