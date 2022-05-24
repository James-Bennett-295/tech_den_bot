const decPattern = /^[0-9]+(\.[0-9]+)?$/;

export default {
	name: "dectofract",
	minArgs: 1,
	usage: "Number",
	cooldown: 1000,
	description: "Convert a number to a fraction.",
	category: "Mathematics",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		if (!decPattern.test(args[0])) {
			return msg.reply("Invalid number!").catch((e) => { });
		}

		let numer = parseFloat(args[0]);
		let denom = 1;
		while (numer % 1 !== 0) {
			numer = (numer * 10).toFixed(15);
			denom *= 10;
		}

		let grtstCmnDenom = (n, d) => {
			return d ? grtstCmnDenom(d, n % d) : n;
		}
		grtstCmnDenom = grtstCmnDenom(numer, denom);

		const fractStr = numer / grtstCmnDenom + "/" + denom / grtstCmnDenom;

		msg.reply(fractStr).catch((e) => { });

	}
}
