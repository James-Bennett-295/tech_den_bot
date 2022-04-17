export default {
	name: "messageDelete",
	once: false,
	execute: function (cfg, client, db, msg) {

		if (msg.author.bot || msg.webhookId) return;

		client.modules.msgDeleteLog.onMessageDelete(cfg, client, db, msg);

	}
}
