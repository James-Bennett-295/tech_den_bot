function onMessageCreate(cfg, client, db, msg) {

	if (msg.content.startsWith(cfg.cmds.prefix)) return;

	if (msg.channel.type === "GUILD_NEWS") {

		if (msg.type !== "DEFAULT") return;

		msg.crosspost();
	}
}

export {
	onMessageCreate
}
