"use strict";

module.exports = {
    name: "messageDelete",
    once: false,
    execute(cfg, client, db, msg) {

        client.modules.msgDeleteLog.onMessageDelete(cfg, client, db, msg);

    },
};
