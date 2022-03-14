"use strict";

const discord = require("discord.js");

function onMessageCreate(cfg, client, db, msg) {

    if (
        msg.content.length < cfg.msgXp.msgRequirements.minLength ||
        msg.content.split(' ').length < cfg.msgXp.msgRequirements.minWords
    ) return; // return if msg doesn't meet requirements

    db.add("msgXpMsgCount." + msg.author.id, 1); // add 1 to user's msg count

    if (db.get("msgXpMsgCount." + msg.author.id) % cfg.msgXp.msgsBetweenXpBoost === 0) { // if it is xp boost time
        db.add("xpCount." + msg.author.id, cfg.msgXp.xpBoostAmount);
        const embed = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("You leveled up! \ud83c\udf89")
            .setDescription(
                "Congratulations <@!" + msg.author.id + ">!\n" +
                "\n" +
                "You just gained **" + cfg.msgXp.xpBoostAmount + " XP**!\n" +
                "\n" +
                "Your current XP count: `" + db.get("xpCount." + msg.author.id) + "`\n" +
                "Your current (valid) message count: `" + db.get("msgXpMsgCount." + msg.author.id) + "`"
            );
        msg.channel.send({ embeds: [embed] });
    };

};

module.exports = { onMessageCreate };
