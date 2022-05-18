const fractPattern = /^[0-9]+\/0*[1-9][0-9]*$/;

export default {
	name: "simplifrac",
	minArgs: 1,
	usage: "<numerator>/<denominator>",
	cooldown: 1000,
	description: "Simplify a fraction.",
	category: "Mathematics",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		if (!fractPattern.test(args[0])) {
			return msg.reply("Invalid fraction!");
		}

		const [numer, denom] = args[0].split("/");

		let grtstCmnDenom = (n, d) => {
			return d ? grtstCmnDenom(d, n % d) : n;
		}
		grtstCmnDenom = grtstCmnDenom(numer, denom);

		const fractStr = numer / grtstCmnDenom + "/" + denom / grtstCmnDenom;

		msg.reply(fractStr);

	}
}
