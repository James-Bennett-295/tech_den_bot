import logger from "@james-bennett-295/logger";

const disboardId = "302050872383242240";
const bumpCooldown = 7200000; // 2 hours

function onMessageCreate(cfg, client, db, msg) {

	if (msg.author.id === disboardId && msg.embeds.length > 0 && msg.embeds[0].description.includes("Bump done!")) {
		const now = new Date();
		db.set("bumpReminder", { time: now.getTime() + bumpCooldown, channel: msg.channel.id });
		logger.debug("[bumpReminder module]: Bump reminder timeout set");
		setTimeout(() => {
			msg.channel.send("This server can now be bumped again!").catch((e) => { });
		}, bumpCooldown);
	}

}

function onReady(cfg, client, db) {

	let bumpReminder = {}
	try {
		bumpReminder = db.get("bumpReminder");
	} catch (e) {
		logger.debug("[bumpReminder module]: Timeout recovery will no be done as failed to get bumpReminder object from database");
	}
	if (JSON.stringify(bumpReminder) !== "{}") {
		let now = new Date();
		if (now.getTime() >= bumpReminder.time) {
			logger.debug("[bumpReminder module]: Timeout recovery will not be done as bump reminder time has passed");
			return;
		}
		logger.debug("[bumpReminder module]: Recovering timeout, reminder msg will be sent in " + (bumpReminder.time - now.getTime()) + "ms");
		setTimeout(() => {
			client.mainGuild.channels.cache.get(bumpReminder.channel).send("This server can now be bumped again!").catch((e) => { });
		}, bumpReminder.time - now.getTime());
	}

}

export {
	onMessageCreate,
	onReady
}
