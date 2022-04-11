const onStart = async (cfg, client, db) => {

	const d = new Date();
	client.processStartTime = d.getTime();

	client.btnId = 0;

	client.modules = {}
	client.modules.cmds = await import("./modules/cmds.mjs");
	client.modules.msgDeleteLog = await import("./modules/msgDeleteLog.mjs");
	client.modules.msgRewards = await import("./modules/msgRewards.mjs");
	client.modules.miscCaching = await import("./modules/miscCaching.mjs");
	client.modules.status = await import("./modules/status.mjs");
	client.modules.reminders = await import("./modules/reminders.mjs");
	client.modules.bumpReminder = await import("./modules/bumpReminder.mjs");
	client.modules.inviteLog = await import("./modules/inviteLog.mjs");

	client.modules.msgDeleteLog.onStart(cfg, client, db);
	client.modules.cmds.onStart(cfg, client, db);
	client.modules.miscCaching.onStart(cfg, client, db);

}

export default onStart;