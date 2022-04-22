export default {
	name: "fromfahrenheit",
	minArgs: 1,
	usage: "<temperature (fahrenheit)>",
	cooldown: 1000,
	description: "Convert temperature from fahrenheit to celsius",
	category: "Conversion",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		if (isNaN(args[0])) {
			return msg.reply("Temperature inputted is not a valid number.").catch((e) => { });
		}

		let fahrTmp = parseInt(args[0]);
		let celsTmp = (fahrTmp - 32) * 5 / 9;

		celsTmp = Math.ceil(celsTmp * 100000) / 100000; // Round to 5 decimal places

		msg.reply(celsTmp + "\u00b0C");

	}
}
