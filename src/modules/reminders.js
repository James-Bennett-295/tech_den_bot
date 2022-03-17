"use strict";

const discord = require("discord.js");

function onReady(cfg, client, db) {

    let embed = new discord.MessageEmbed()
        .setColor("AQUA")
        .setTitle("Reminder! \u23f0");

    setInterval(() => {

        let reminders = db.get("reminders");

        let now = new Date();

        for (let i in reminders) {

            if (reminders[i] === null || reminders[i].time > now.getTime()) continue;

            embed.setDescription(reminders[i].msg);

            client.mainGuild.channels.cache.get(reminders[i].channel).send({
                content: "<@!" + reminders[i].user + ">",
                embeds: [embed],
                allowedMentions: { users: [reminders[i].user] }
            });

            delete reminders[i];

        };

        db.set("reminders", reminders);

    }, 60000);

};

module.exports = { onReady };
