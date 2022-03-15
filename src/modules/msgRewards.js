"use strict";

const discord = require("discord.js");

function onMessageCreate(cfg, client, db, msg) {

    if (msg.author.bot || msg.content.startsWith(cfg.cmds.prefix)) return;

    if (
        msg.content.length < cfg.msgRewards.msgRequirements.minLength ||
        msg.content.split(' ').length < cfg.msgRewards.msgRequirements.minWords
    ) return; // return if msg doesn't meet requirements

    db.add("msgRewardsMsgCount." + msg.author.id, 1); // add 1 to user's msg count

    if (db.get("msgRewardsMsgCount." + msg.author.id) % cfg.msgRewards.msgsBetweenRewards === 0) { // if it is reward time
        db.add("balance." + msg.author.id, cfg.msgRewards.rewardAmount);
        const embed = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("You gained coins! \ud83c\udf89")
            .setDescription(
                "Congratulations <@!" + msg.author.id + ">!\n" +
                "\n" +
                "You just gained **" + cfg.msgRewards.rewardAmount + " Coins**!\n" +
                "\n" +
                "Your current balance: `" + db.get("balance." + msg.author.id) + "`\n" +
                "Your current (valid) message count: `" + db.get("msgRewardsMsgCount." + msg.author.id) + "`"
            );
        msg.channel.send({ embeds: [embed] });
    };

};

module.exports = { onMessageCreate };
