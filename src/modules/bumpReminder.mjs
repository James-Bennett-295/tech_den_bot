import logger from "@james-bennett-295/logger";
import keyValpairs from "key-value-pairs";

const disboardId = "302050872383242240";
const bumpCooldown = 7200000; // 2 hours

function onMessageCreate(cfg, client, db, msg) {

	if (msg.author.id === disboardId && msg.embeds.length > 0 && msg.embeds[0].description.includes("Bump done!")) {
		const now = new Date();
		keyValpairs.set("bumpReminderTime", now.getTime() + bumpCooldown);
		logger.debug("[bumpReminder module]: Bump reminder timeout set");
		setTimeout(() => {
			client.mainGuild.channels.cache.get(cfg.channels.bots).send("This server can now be bumped again!").catch((e) => { });
		}, bumpCooldown);
	}

}

function onReady(cfg, client, db) {

	keyValpairs.get("bumpReminderTime")
		.then((bumpReminderTime) => {
				if (typeof bumpReminderTime === "undefined") {
					return logger.debug("[bumpReminder module]: Timeout recovery will not be done as typeof bumpReminderTime is \"undefined\"");
				}
				let now = new Date();
				if (now.getTime() >= bumpReminderTime) {
					logger.debug("[bumpReminder module]: Timeout recovery will not be done as bump reminder time has passed");
					return;
				}
				logger.debug("[bumpReminder module]: Recovering timeout, reminder msg will be sent in " + (bumpReminderTime - now.getTime()) + "ms");
				setTimeout(() => {
					client.mainGuild.channels.cache.get(cfg.channels.bots).send("This server can now be bumped again!").catch((e) => { });
				}, bumpReminderTime - now.getTime());
		});
}

export {
	onMessageCreate,
	onReady
}
