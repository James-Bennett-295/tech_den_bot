import logger from "@james-bennett-295/logger";

function onReady(cfg, client, db) {

	let statusNum = 0;
	setInterval(() => {
		if (typeof client.memberCount === "undefined") {
			logger.warn("[status module]: Not setting status as client.memberCount is undefined");
			return;
		}
		if (cfg.status.statuses.length <= statusNum) statusNum = 0;
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
		statusNum++;
	}, cfg.status.cycleTime * 1000);

}

export { onReady }
