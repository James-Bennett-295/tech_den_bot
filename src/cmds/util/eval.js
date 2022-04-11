"use strict";

module.exports = {
	name: "eval",
	minArgs: 1,
	usage: "<code>",
	cooldown: 0,
	description: "Eval JS code.",
	category: "Utility",
	botOwnerOnly: true,
	staffOnly: false,
	execute(cfg, client, db, msg, args) {

		let code = args.join(' ');

		let evaled = eval(code);

		msg.reply(evaled.toString().slice(0, 2000)).catch((e) => { });

	},
}
