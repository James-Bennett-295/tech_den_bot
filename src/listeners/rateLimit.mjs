import logger from "@james-bennett-295/logger";

export default {
	name: "rateLimit",
	once: false,
	execute: function(cfg, client, db, rateLimitData) {

		logger.warn("Discord rate-limit hit! INFO: " + JSON.stringify(rateLimitData, null, 2));

	}
}
