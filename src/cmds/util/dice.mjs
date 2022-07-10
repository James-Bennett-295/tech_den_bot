export default {
	name: "dice",
	minArgs: 0,
	usage: null,
	cooldown: 1000,
	description: "Get a random number between 1 and 9.",
	category: "Utility",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		const roll = Math.floor(Math.random() * 9) + 1;

		let emoji;
		switch (roll) {
			case 1:
				emoji = "\u0031\ufe0f\u20e3";
				break;
			case 2:
				emoji = "\u0032\ufe0f\u20e3";
				break;
			case 3:
				emoji = "\u0033\ufe0f\u20e3";
				break;
			case 4:
				emoji = "\u0034\ufe0f\u20e3";
				break;
			case 5:
				emoji = "\u0035\ufe0f\u20e3";
				break;
			case 6:
				emoji = "\u0036\ufe0f\u20e3";
				break;
			case 7:
				emoji = "\u0037\ufe0f\u20e3";
				break;
			case 8:
				emoji = "\u0038\ufe0f\u20e3";
				break;
			case 9:
				emoji = "\u0039\ufe0f\u20e3";
				break;
		}

		msg.reply(emoji).catch((e) => { });

	}
}
