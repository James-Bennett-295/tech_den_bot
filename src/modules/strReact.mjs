function onMessageCreate(cfg, client, db, msg) {

	if (/(^|\s)n+(i|1)+g+((e|3)*r+|(a|4)+)/i.test(msg.content)) {
		msg.react(cfg.guildEmojis.car).catch((e) => { });
	}

}

export { onMessageCreate }
