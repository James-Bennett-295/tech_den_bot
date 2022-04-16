import logger from "@james-bennett-295/logger";

function setStatus(cfg, client, db, statusNum) {

	if (typeof client.memberCount === "undefined") {
		logger.warn("[status module]: Not setting status as client.memberCount is undefined");
		return;
	}

	logger.debug("[status module]: Setting status " + statusNum);

	client.user.setPresence({
		activities: [
			{
				name: cfg.status.statuses[statusNum][1]
					.replace("{userCount}", client.memberCount)
				, type: cfg.status.statuses[statusNum][0]
			}
		],
		status: "online"
	});
}

function onReady(cfg, client, db) {

	setTimeout(() => { // timeout to give time for client.memberCount to be set
		setStatus(cfg, client, db, 0);
	}, 2500);

	let statusNum = 1;
	setInterval(() => {

		if (cfg.status.statuses.length <= statusNum) statusNum = 0;
		setStatus(cfg, client, db, statusNum);
		statusNum++;

	}, cfg.status.cycleTime * 1000);

}

export { onReady }
