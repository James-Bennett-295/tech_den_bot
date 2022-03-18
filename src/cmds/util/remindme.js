"use strict";

module.exports = {
    name: "remindme",
    minArgs: 2,
    usage: "<time until reminder. Example: \"2d,7m\" (2 days + 7 minutes)> <reminder text>",
    cooldown: 30000,
    description: "See if the bot is responding.",
    category: "Utility",
    botOwnerOnly: false,
    execute(cfg, client, db, msg, args) {

        let splitTime = args[0].split(',');
        let now = new Date();
        let remindTime = now.getTime();
        let n;
        for (let i in splitTime) {
            if (splitTime[i].length < 2) return msg.reply("Invalid time format!");
            switch (splitTime[i].charAt(splitTime[i].length - 1)) {
                case "m":
                    n = parseInt(splitTime[i].slice(0, -1));
                    if (isNaN(n)) return msg.reply("Invalid time format!");
                    remindTime += n * 60000;
                    break;
                case "h":
                    n = parseInt(splitTime[i].slice(0, -1));
                    if (isNaN(n)) return msg.reply("Invalid time format!");
                    remindTime += n * 3600000;
                    break;
                case "d":
                    n = parseInt(splitTime[i].slice(0, -1));
                    if (isNaN(n)) return msg.reply("Invalid time format!");
                    remindTime += n * 86400000;
                    break;
                default:
                    return msg.reply("Invalid time format!");
            };
        };

        if (remindTime > 604800000 + now.getTime()) return msg.reply("The time you enter must be no longer than a week!");

        args.shift();

        let remindMsg = args.join(' ');

        msg.reply("Reminder set for <t:" + Math.floor(remindTime / 1000) + ":R>")
            .then((replyMsg) => {
                db.push("reminders", {
                    time: remindTime,
                    channel: msg.channel.id,
                    msg: remindMsg,
                    user: msg.author.id,
                    reply: replyMsg.id
                });
            });

    },
};
