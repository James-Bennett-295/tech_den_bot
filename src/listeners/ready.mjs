import logger from "@james-bennett-295/logger";

export default {
	name: "ready",
	once: true,
	execute: function(cfg, client, db) {

		logger.info("Logged in as " + client.user.tag);

		client.mainGuild = client.guilds.cache.get("935192357811404800");

		client.modules.status.onReady(cfg, client, db);
		client.modules.reminders.onReady(cfg, client, db);
		client.modules.bumpReminder.onReady(cfg, client, db);
		client.modules.inviteLog.onReady(cfg, client, db);

	}
}