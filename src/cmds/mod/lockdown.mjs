import keyValPairs from "key-value-pairs";

export default {
	name: "lockdown",
	minArgs: 0,
	usage: null,
	cooldown: 6000,
	description: "Toggle lockdown mode.",
	category: "Moderation",
	botOwnerOnly: false,
	staffOnly: true,
	execute: function (cfg, client, db, msg, args) {

		let memberRole = msg.guild.roles.cache.get(cfg.roles.member);

		keyValPairs.get("lockdownEnabled")
			.then((lockdownEnabled) => {
				if (typeof lockdownEnabled === "undefined") {
					lockdownEnabled = false;
				}

				msg.reply(lockdownEnabled ? "Disabling lockdown!" : "Enabling lockdown!")

				msg.guild.channels.cache.forEach((channel) => {
					if (!channel.parent || !cfg.lockdownCategories.includes(channel.parent.id)) return;
					if (lockdownEnabled) {
						channel.permissionOverwrites.create(memberRole, { // https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
							ADD_REACTIONS: true,
							SEND_MESSAGES: true,
							CONNECT: true,
							SPEAK: true,
							CREATE_PUBLIC_THREADS: true,
							CREATE_PRIVATE_THREADS: true,
							SEND_MESSAGES_IN_THREADS: true,
						});
						keyValPairs.set("lockdownEnabled", false);
					} else {
						channel.permissionOverwrites.create(memberRole, {
							ADD_REACTIONS: false,
							SEND_MESSAGES: false,
							CONNECT: false,
							SPEAK: false,
							CREATE_PUBLIC_THREADS: false,
							CREATE_PRIVATE_THREADS: false,
							SEND_MESSAGES_IN_THREADS: false,
						});
						keyValPairs.set("lockdownEnabled", true);
					}
				});
			});
	}
}
