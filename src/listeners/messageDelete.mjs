export default {
	name: "messageDelete",
	once: false,
	exe: function (cfg, client, db, msg) {

		if (msg.guild === null) return;
		if (msg.author.bot || msg.webhookId) return;

		client.modules.msgDeleteLog.onMessageDelete(cfg, client, db, msg);

	}
}
