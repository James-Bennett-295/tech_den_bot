"use strict";

module.exports = {
    name: "avatar",
    minArgs: 0,
    usage: "<user ID/mention>",
    cooldown: 2000,
    description: "Get a user's avatar.",
    category: "Info",
    botOwnerOnly: false,
    staffOnly: false,
    execute(cfg, client, db, msg, args) {

        let member;
        if (args[0]) {
            let userId = args[0];
            if (args[0].startsWith('<@!')) {
                userId = userId.slice(3, -1);
            } else if (args[0].startsWith('<@')) {
                userId = userId.slice(2, -1);
            }
            if (userId.length !== 18 || isNaN(userId)) return msg.reply("Invalid user!");
            msg.guild.members.fetch().then((guildMembers) => {
                let member = guildMembers.get(userId);
                if (typeof (member) === "undefined") return msg.reply("That user could not be found.");
                msg.reply(member.user.displayAvatarURL({ size: 2048 }));
            });
        } else {
            msg.reply(msg.member.user.displayAvatarURL({ size: 2048 }));
        }

    },
}
