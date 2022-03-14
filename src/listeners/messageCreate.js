"use strict";

module.exports = {
    name: "messageCreate",
    once: false,
    execute(cfg, client, db, msg) {

        client.modules.cmds.onMessageCreate(cfg, client, db, msg);
        client.modules.msgXp.onMessageCreate(cfg, client, db, msg);

    },
};
