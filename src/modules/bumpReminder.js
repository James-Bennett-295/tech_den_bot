"use strict";

const disboardId = "302050872383242240";
const bumpCooldown = 7200000; // 2 hours

function onMessageCreate(cfg, client, db, msg) {

    if (msg.author.id === disboardId && msg.embeds[0].description.includes("Bump done!")) {
        const now = new Date();
        db.set("bumpReminder", { time: now.getTime() + bumpCooldown, channel: msg.channel.id });
        setTimeout(() => {
            msg.channel.send("This server can now be bumped again!").catch((e) => {});
        }, bumpCooldown);
    };

};

function onReady(cfg, client, db) {

    try {
        let bumpReminder = db.get("bumpReminder");
    } catch (e) {};
    if (bumpReminder) {
        let now = new Date();
        if (now.getTime() >= bumpReminder.time) return;
        setTimeout(() => {
            client.mainGuild.channels.cache.get(bumpReminder.channel).send("This server can now be bumped again!").catch((e) => {});
        }, bumpReminder.time - now.getTime());
    };

};

module.exports = { onMessageCreate, onReady };
