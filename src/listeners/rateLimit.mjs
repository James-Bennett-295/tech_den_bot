import logger from "@james-bennett-295/logger";

export default {
	name: "rateLimit",
	once: false,
	execute: function(cfg, client, db, info) {

		logger.error("Discord rate-limit hit! INFO: " + JSON.stringify(info, null, 2));

	}
}
