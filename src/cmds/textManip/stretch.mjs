export default {
	name: "stretch",
	minArgs: 1,
	usage: "<text>",
	cooldown: 1000,
	description: "S t r e t c h  some text.",
	category: "Text Manipulation",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		const txt = args.join(" ").split("").join(" ").substring(0, 1999);

		msg.reply({ content: txt, allowedMentions: { parse: [] } }).catch((e) => { });

	}
}
