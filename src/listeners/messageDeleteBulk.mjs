export default {
	name: "messageDeleteBulk",
	once: false,
	exe: function (cfg, client, db, msgs) {

		const firstMsg = msgs.entries().next().value[1];

		if (firstMsg.guild === null) return;
		if (firstMsg.author.bot || firstMsg.webhookId) return;

		client.modules.msgDeleteLog.onMessageDeleteBulk(cfg, client, db, msgs);

	}
}
