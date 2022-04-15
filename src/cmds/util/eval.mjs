import discord from "discord.js";
import logger from "@james-bennett-295/logger";

export default {
	name: "eval",
	minArgs: 1,
	usage: "<code>",
	cooldown: 0,
	description: "Eval JS code.",
	category: "Utility",
	botOwnerOnly: true,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		let code = args.join(' ');

		if (code.startsWith("```js")) {
			code = code.slice(5, -3);
		}

		try {
			let evalOut = eval(code);
			let evalOutStr, fileType;
			switch (typeof evalOut) {
				case "object":
					evalOutStr = JSON.stringify(evalOut, null, "\t");
					fileType = "json";
					break;
				case "undefined":
					msg.reply("EVAL HAD NO OUTPUT");
					return;
				default:
					evalOutStr = evalOut.toString();
					fileType = "js";
			}
			let outFile = new discord.MessageAttachment(Buffer.from(evalOutStr), "EVAL-OUT." + fileType);
			msg.reply({ content: "**[SUCCESS]**\nTYPE: " + typeof evalOut, files: [outFile] }).catch((err) => {
				logger.error("[eval cmd]: " + err);
				msg.reply("Failed to send eval output.");
			});
		} catch (err) {
			let errFile = new discord.MessageAttachment(Buffer.from(err.toString()), "EVAL-ERR.js");
			msg.reply({ content: "**[ERROR]**", files: [errFile] }).catch((err) => {
				logger.error("[eval cmd]: " + err);
				msg.reply("Failed to send eval error.");
			});
		}

	}
}
