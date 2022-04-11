export default {
	name: "inviteDelete",
	once: false,
	execute: function(cfg, client, db, invite) {

		client.modules.inviteLog.onInviteCreate(cfg, client, db, invite);

	}
}
