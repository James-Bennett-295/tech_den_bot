export default {
	name: "inviteDelete",
	once: false,
	execute: function(cfg, client, db, invite) {

		client.modules.inviteLog.onInviteDelete(cfg, client, db, invite);

	}
}
