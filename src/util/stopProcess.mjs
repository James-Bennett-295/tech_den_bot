import logger from "@james-bennett-295/logger";

function stopProcess(cfg, client, db) {

	db.close((err) => {
		if (err !== null) logger.error("[stopProcess util]: An error occured while trying to close database: ", err);
		process.exit();
	});

}

export default stopProcess;
