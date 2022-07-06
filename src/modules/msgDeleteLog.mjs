import discord from "discord.js";

function logMsgDelete(cfg, client, db, msg) {
	if (msg.content === "" && msg.attachments.size === 0) return;

	let message = {
		content: "<@!" + msg.author.id + "> in <#" + msg.channel.id + ">:",
		username: msg.author.tag.slice(0, 80),
		avatarURL: msg.author.displayAvatarURL({ size: 256 }),
		allowedMentions: { parse: [] },
		files: []
	}
	if (msg.content !== "") message.content += "\n>>> " + msg.content;
	msg.attachments.forEach(element => {
		message.files.push({
			attachment: element.attachment
		});
	});
	message.content = message.content.slice(0, 2000);

	client.msgDeleteLogWebhookClient.send(message).catch((e) => { });
}

function onStart(cfg, client, db) {
	client.msgDeleteLogWebhookClient = new discord.WebhookClient({ url: cfg.msgDeleteLog.webhookUrl });
}

function onMessageDelete(cfg, client, db, msg) {
	logMsgDelete(cfg, client, db, msg);
}

function onMessageDeleteBulk(cfg, client, db, msgs) {

	msgs.reverse().forEach((msg) => {

		if (msg.author.bot || msg.webhookId) return;

		logMsgDelete(cfg, client, db, msg);
	});
}

export {
	onStart,
	onMessageDelete,
	onMessageDeleteBulk
}
