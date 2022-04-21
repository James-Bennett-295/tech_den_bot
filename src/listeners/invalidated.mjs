import logger from "@james-bennett-295/logger";
import stopProcess from "../util/stopProcess.mjs"

export default {
	name: "invalidated",
	once: true,
	execute: function(cfg, client, db) {

		logger.fatal("[invalidated listener]: The client session was invalidated! The bot process will be stopped gracefully");

		stopProcess(cfg, client, db);

	}
}
