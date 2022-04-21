import logger from "@james-bennett-295/logger";

export default {
	name: "error",
	once: false,
	execute: function(cfg, client, db, err) {

		logger.error("[error listener]: The discord client encountered an error: " + err);

	}
}
