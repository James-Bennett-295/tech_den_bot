import logger from "@james-bennett-295/logger";
import stopProcess from "../../util/stopProcess.mjs";

export default {
	name: "stop",
	minArgs: 0,
	usage: null,
	cooldown: 0,
	description: "Stop the bot process gracefully.",
	category: "Utility",
	botOwnerOnly: true,
	staffOnly: false,
	exe: function(cfg, client, db, msg, args) {

		logger.info("[stop cmd]: Stopping process gracefully");

		stopProcess(cfg, client, db);

	}
}
