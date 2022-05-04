export default {
	name: "say",
	minArgs: 1,
	usage: "<msg>",
	cooldown: 0,
	description: "Make the bot say something.",
	category: "Utility",
	botOwnerOnly: true,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		msg.delete().catch((e) => { });
		msg.channel.send(args.join(" ")).catch((e) => { });

	}
}
