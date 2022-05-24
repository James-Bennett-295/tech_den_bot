import logger from "@james-bennett-295/logger";

export default {
	name: "invalidRequestWarning",
	once: false,
	exe: function(cfg, client, db, warningData) {

		logger.warn("[invalidRequestWarning listener]: Recieved warning: " + JSON.stringify(warningData, null, 2));

	}
}
