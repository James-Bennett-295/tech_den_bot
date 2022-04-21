import logger from "@james-bennett-295/logger";

export default {
	name: "invalidRequestWarning",
	once: false,
	execute: function(cfg, client, db, warningData) {

		logger.error("[invalidRequestWarning listener]: Recieved warning: " + JSON.stringify(warningData, null, 2));

	}
}
