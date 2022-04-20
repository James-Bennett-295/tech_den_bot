export default {
	name: "inviteCreate",
	once: false,
	execute: function(cfg, client, db, invite) {

		client.modules.joinLog.onInviteCreate(cfg, client, db, invite);

	}
}
