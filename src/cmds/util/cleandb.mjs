import discord from "discord.js";

export default {
	name: "cleandb",
	minArgs: 0,
	usage: null,
	cooldown: 0,
	description: "Clean up the database.",
	category: "Utility",
	botOwnerOnly: true,
	staffOnly: false,
	execute: function(cfg, client, db, msg, args) {

		let dbChangesLog = "";

		msg.guild.members.fetch().then((members) => {

			let memberIds = members.map(m => {
				return m.user.id;
			});

			let dbBalance = db.get("balance");
			let dbBalanceKeys = Object.keys(dbBalance);
			for (let i in dbBalanceKeys) {
				if (!memberIds.includes(dbBalanceKeys[i])) {
					delete dbBalance[dbBalanceKeys[i]];
					dbChangesLog += "[balance] Removed not-found user: " + dbBalanceKeys[i] + "\n";
				}
			}
			db.set("balance", dbBalance);

			let dbMsgRewardsMsgCount = db.get("msgRewardsMsgCount");
			let dbMsgRewardsMsgCountKeys = Object.keys(dbMsgRewardsMsgCount);
			for (let i in dbMsgRewardsMsgCountKeys) {
				if (!memberIds.includes(dbMsgRewardsMsgCountKeys[i])) {
					delete dbMsgRewardsMsgCount[dbMsgRewardsMsgCountKeys[i]];
					dbChangesLog += "[msgRewardsMsgCount] Removed not-found user: " + dbMsgRewardsMsgCountKeys[i] + "\n";
				}
			}
			db.set("msgRewardsMsgCount", dbMsgRewardsMsgCount);

			let dbReminders = db.get("reminders");
			let dbRemindersOldArrLen = dbReminders.length;
			dbReminders = dbReminders.filter((reminder) => { return reminder !== null; });
			if (dbRemindersOldArrLen !== dbReminders.length) dbChangesLog += "[reminders] Removed " + (dbRemindersOldArrLen - dbReminders.length) + " null items\n";
			db.set("reminders", dbReminders);

			let logFile = new discord.MessageAttachment(Buffer.from(dbChangesLog), "dbChanges.log");
			msg.reply({ content: "Done!", files: [logFile] });

		});

	}
}
