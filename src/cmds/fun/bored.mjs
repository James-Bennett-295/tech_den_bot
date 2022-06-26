import logger from "@james-bennett-295/logger";
import getJson from "../../util/getJson.mjs";

export default {
	name: "bored",
	minArgs: 0,
	usage: null,
	cooldown: 2500,
	description: "Get an activity for when bored.",
	category: "Fun",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		getJson("https://www.boredapi.com/api/activity/")
			.then((obj) => {
				msg.reply("```json\n" + JSON.stringify(obj) + "```")
			})
			.catch((err) => {
				logger.error("[bored cmd]: HTTPS req failed:", err);
				msg.reply("Failed to get an activity.").catch((e) => { });
			});

	}
}
