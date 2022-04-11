import discord from "discord.js";

function onStart(cfg, client, db) {
	client.msgDeleteLogWebhookClient = new discord.WebhookClient({ url: cfg.msgDeleteLog.webhookUrl });
}

function onMessageDelete(cfg, client, db, msg) {

	if (msg.author.bot || msg.webhookId) return;
	if (msg.channel.type === "dm") return;

	let message = {
		content: "<@!" + msg.author.id + "> in <#" + msg.channel.id + ">:",
		username: msg.author.tag.slice(0, 80),
		avatarURL: msg.author.avatarURL(),
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

	client.msgDeleteLogWebhookClient.send(message);

}

export { onStart, onMessageDelete }
