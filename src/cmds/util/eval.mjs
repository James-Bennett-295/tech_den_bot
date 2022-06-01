import discord from "discord.js";
import logger from "@james-bennett-295/logger";

/* Imports for use in eval */
import fs from "node:fs";
/* * * * * * * * * * * * * */

let botTokenPattern = /[a-zA-Z0-9+/=\-_]{24}\.[a-zA-Z0-9+/=\-_]{6}\.[a-zA-Z0-9+/=\-_]{27}/;

export default {
	name: "eval",
	minArgs: 1,
	usage: "<code>",
	cooldown: 0,
	description: "Eval JS code.",
	category: "Utility",
	botOwnerOnly: true,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		let code = args.join(' ');

		if (code.startsWith("```js")) {
			code = code.slice(5, -3);
		} else if (code.startsWith("```mjs")) {
			code = code.slice(6, -3);
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
					msg.reply("EVAL OUTPUT WAS UNDEFINED").catch((e) => { });
					return;
				default:
					evalOutStr = evalOut.toString();
					fileType = "js";
			}
			if (botTokenPattern.test(evalOutStr)) {
				return msg.reply("EVAL OUTPUT CONTAINED A VALID BOT TOKEN SO WAS NOT SENT").catch((e) => { });
			}
			let outFile = new discord.MessageAttachment(Buffer.from(evalOutStr), "EVAL-OUT." + fileType);
			msg.reply({ content: "**[SUCCESS]**\nTYPE: `" + typeof evalOut + "`", files: [outFile] }).catch((err) => {
				logger.error("[eval cmd]: ", err);
				msg.channel.send("Failed to send eval output.").catch((e) => { });
			});
		} catch (err) {
			const errStr = err.toString();
			if (botTokenPattern.test(errStr)) {
				return msg.reply("EVAL ERROR CONTAINED VALID BOT TOKEN SO WAS NOT SENT").catch((e) => { });
			}
			const errFile = new discord.MessageAttachment(Buffer.from(errStr), "EVAL-ERR.js");
			msg.reply({ content: "**[ERROR]**", files: [errFile] }).catch((err) => {
				logger.error("[eval cmd]: ", err);
				msg.channel.send("Failed to send eval error.").catch((e) => { });
			});
		}

	}
}
