import discord from "discord.js";

const jumpUrlPattern = /^https:\/\/discord\.com\/channels\/[0-9]{18}\/[0-9]{18}\/[0-9]{18}$/;
const guildIdPattern = /(?<=^https:\/\/discord\.com\/channels\/)[0-9]{18}(?=\/[0-9]{18}\/[0-9]{18}$)/;
const channelIdPattern = /(?<=^https:\/\/discord\.com\/channels\/[0-9]{18}\/)[0-9]{18}(?=\/[0-9]{18}$)/;
const msgIdPattern = /(?<=^https:\/\/discord\.com\/channels\/[0-9]{18}\/[0-9]{18}\/)[0-9]{18}$/;

function onMessageCreate(cfg, client, db, msg) {

	if (!jumpUrlPattern.test(msg.content)) return;

	if (msg.content.match(guildIdPattern)[0] !== client.mainGuild.id) return;

	const quoteMsgChannelId = msg.content.match(channelIdPattern)[0];
	const quoteMsgId = msg.content.match(msgIdPattern)[0];

	const quoteMsgChannel = msg.guild.channels.cache.get(quoteMsgChannelId);
	if (typeof quoteMsgChannel === "undefined") return;

	quoteMsgChannel.messages.fetch(quoteMsgId)
		.then((quoteMsg) => {

			if (quoteMsg.content === "") return;

			msg.delete().catch((e) => { });

			const webhookMsg = {
				username: (msg.member.nickname || msg.author.id),
				avatarURL: msg.member.displayAvatarURL(),
				allowedMentions: { parse: [] },
				embeds: [
					new discord.MessageEmbed()
						.setColor("AQUA")
						.setAuthor({ name: (quoteMsg.author.discriminator === "0000" ? quoteMsg.author.username + " [WebHook]" : quoteMsg.author.tag) + " in #" + quoteMsg.channel.name, iconURL: quoteMsg.member.displayAvatarURL() })
						.setDescription(quoteMsg.content)
						.addField("Quoted Message", "[Click here to view](" + msg.content + ")")

				]
			}

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
