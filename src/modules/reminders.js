"use strict";

const discord = require("discord.js");
const logger = require("@james-bennett-295/logger");

function onReady(cfg, client, db) {

    let embed = new discord.MessageEmbed()
        .setColor("AQUA")
        .setTitle("Reminder! \u23f0");

    setInterval(() => {

        logger.debug("[reminders module]: Doing reminders check");

        let reminders = db.get("reminders");

        let now = new Date();

        for (let i in reminders) {

            if (reminders[i] === null || reminders[i].time > now.getTime()) continue;

            embed.setDescription(reminders[i].msg);

            let channel = client.mainGuild.channels.cache.get(reminders[i].channel);

            channel.send({
                content: "<@!" + reminders[i].user + ">",
                embeds: [embed],
                allowedMentions: { users: [reminders[i].user] }
            });

            channel.messages.fetch(reminders[i].reply)
                .then((replyMsg) => {
                    replyMsg.edit("I reminded you at \<t:" + Math.floor(now.getTime() / 1000) + ">").catch((e) => {});
                    delete reminders[i];
                    db.set("reminders", reminders);
                })
                .catch((e) => {
                    delete reminders[i];
                    db.set("reminders", reminders);
                });

        }

    }, 60000);

}

module.exports = { onReady }
