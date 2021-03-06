export default {
	name: "remindme",
	minArgs: 2,
	usage: "<time until reminder. Example: \"2d,7m\" (2 days + 7 minutes)> <reminder text>",
	cooldown: 30000,
	description: "Set a reminder.",
	category: "Utility",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		let splitTime = args[0].split(',');
		let now = new Date();
		let remindTime = now.getTime();
		let n;
		for (let i = 0; i < splitTime.length; i++) {
			if (splitTime[i].length < 2) return msg.reply("Invalid time format!").catch((e) => { });
			switch (splitTime[i].charAt(splitTime[i].length - 1)) {
				case 'm':
					n = parseInt(splitTime[i].slice(0, -1));
					if (isNaN(n)) return msg.reply("Invalid time format!").catch((e) => { });
					remindTime += n * 60000;
					break;
				case 'h':
					n = parseInt(splitTime[i].slice(0, -1));
					if (isNaN(n)) return msg.reply("Invalid time format!").catch((e) => { });
					remindTime += n * 3600000;
					break;
				case 'd':
					n = parseInt(splitTime[i].slice(0, -1));
					if (isNaN(n)) return msg.reply("Invalid time format!").catch((e) => { });
					remindTime += n * 86400000;
					break;
				case 'w':
					n = parseInt(splitTime[i].slice(0, -1));
					if (isNaN(n)) return msg.reply("Invalid time format!").catch((e) => { });
					remindTime += n * 604800000;
					break;
				default:
					return msg.reply("Invalid time format!");
			}
		}

		if (remindTime > 31557600000 + now.getTime()) return msg.reply("The time you enter must be no longer than a year!").catch((e) => { });

		args.shift();

		let remindMsg = args.join(' ');

		msg.reply("Reminder set for <t:" + Math.floor(remindTime / 1000) + ":R>")
			.then((replyMsg) => {
				db.run(`
					INSERT INTO reminders (time, channel, msg, user, reply)
					VALUES (?, ?, ?, ?, ?);
				`, remindTime.toString(), msg.channel.id, remindMsg, msg.author.id, replyMsg.id);
			})
			.catch((e) => { });

	}
}
