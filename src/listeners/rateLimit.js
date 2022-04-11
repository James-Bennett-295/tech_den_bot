"use strict";

const logger = require("@james-bennett-295/logger");

module.exports = {
	name: "rateLimit",
	once: false,
	execute(cfg, client, db, info) {

		logger.error("Discord rate-limit hit! INFO: " + JSON.stringify(info, null, 2));

	},
}
