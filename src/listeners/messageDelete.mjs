export default {
	name: "messageDelete",
	once: false,
	execute: function(cfg, client, db, msg) {

		client.modules.msgDeleteLog.onMessageDelete(cfg, client, db, msg);

	}
}
