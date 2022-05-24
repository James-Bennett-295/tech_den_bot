export default {
	name: "inviteDelete",
	once: false,
	exe: function (cfg, client, db, invite) {

		client.modules.miscCaching.onInviteDelete(cfg, client, db, invite);

	}
}
