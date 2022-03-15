"use strict";

const discord = require("discord.js");

function onMessageCreate(cfg, client, db, msg) {

    if (msg.author.bot || msg.content.startsWith(cfg.cmds.prefix)) return;

    if (
        msg.content.replace(' ', '').length < cfg.msgRewards.msgRequirements.minLength ||
        msg.content.split(' ').length < cfg.msgRewards.msgRequirements.minWords
    ) return; // return if msg doesn't meet requirements

    db.add("msgRewardsMsgCount." + msg.author.id, 1); // add 1 to user's msg count

    if (db.get("msgRewardsMsgCount." + msg.author.id) % cfg.msgRewards.msgsBetweenLevelUp === 0) { // level up
        const embed = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("You leveled up!")
            .setDescription(
                "Congratulations <@!" + msg.author.id + ">,\n" +
                "\n" +
                "You are now on level **" + db.get("msgRewardsMsgCount." + msg.author.id) / cfg.msgRewards.msgsBetweenLevelUp + "**!"
            );
        msg.channel.send({ embeds: [embed] });
    };

    if (db.get("msgRewardsMsgCount." + msg.author.id) % cfg.msgRewards.msgsBetweenRewards === 0) { // if it is reward time
        db.add("balance." + msg.author.id, cfg.msgRewards.rewardAmount);
    };

};

module.exports = { onMessageCreate };
