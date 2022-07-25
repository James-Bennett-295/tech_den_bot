import discord from "discord.js";

const jumpUrlPattern = /^https:\/\/discord\.com\/channels\/[0-9]{18,19}\/[0-9]{18,19}\/[0-9]{18,19}$/;
const guildIdPattern = /(?<=^https:\/\/discord\.com\/channels\/)[0-9]{18,19}(?=\/[0-9]{18,19}\/[0-9]{18,19}$)/;
const channelIdPattern = /(?<=^https:\/\/discord\.com\/channels\/[0-9]{18,19}\/)[0-9]{18,19}(?=\/[0-9]{18,19}$)/;
const msgIdPattern = /(?<=^https:\/\/discord\.com\/channels\/[0-9]{18,19}\/[0-9]{18,19}\/)[0-9]{18,19}$/;

function onMessageCreate(cfg, client, db, msg) {

	if (!jumpUrlPattern.test(msg.content)) return;

	if (msg.content.match(guildIdPattern)[0] !== client.mainGuild.id) return;

	const quoteMsgChannelId = msg.content.match(channelIdPattern)[0];
	const quoteMsgId = msg.content.match(msgIdPattern)[0];

	const quoteMsgChannel = msg.guild.channels.cache.get(quoteMsgChannelId);
	if (typeof quoteMsgChannel === "undefined") return;

	quoteMsgChannel.messages.fetch(quoteMsgId)
		.then((quoteMsg) => {

			const firstAttachment = quoteMsg.attachments.size === 0 ? null : quoteMsg.attachments.entries().next().value[1];

			if (quoteMsg.content === "" && (quoteMsgChannel.nsfw || (!firstAttachment || !firstAttachment.contentType.startsWith("image/")))) return;

			let embed = new discord.MessageEmbed()
				.setColor("AQUA")
				.setAuthor({ name: (quoteMsg.author.discriminator === "0000" ? quoteMsg.author.username + " [WebHook]" : quoteMsg.author.tag) + " in #" + quoteMsg.channel.name, iconURL: quoteMsg.author.displayAvatarURL() })
				.addField("Quoted Message", "[Click here to view](" + msg.content + ")");

			if (quoteMsg.content !== "") {
				embed.setDescription(quoteMsg.content);
			}

			if (!quoteMsgChannel.nsfw) {
				if (firstAttachment && firstAttachment.contentType.startsWith("image/")) {
					embed.setImage(firstAttachment.proxyURL);
				}
			}

			const webhookMsg = {
				username: (msg.member.nickname || msg.author.id),
				avatarURL: msg.member.displayAvatarURL(),
				allowedMentions: { parse: [] },
				embeds: [embed]
			}

			msg.delete().catch((e) => { });

			msg.channel.fetchWebhooks()
				.then((webhooks) => {
					const webhook = webhooks.find(webhook => (webhook.name === "msgQuoter" && webhook.owner.id === client.user.id));
					if (typeof (webhook) === "undefined") {
						msg.channel.createWebhook("msgQuoter")
							.then((webhook) => {
								webhook.send(webhookMsg);
							});
					} else {
						webhook.send(webhookMsg);
					};
				});
		})
		.catch((e) => { });

}

export {
	onMessageCreate
}
