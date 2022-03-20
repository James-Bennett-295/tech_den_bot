"use strict";

module.exports = {
    name: "inviteCreate",
    once: false,
    execute(cfg, client, db, invite) {

        client.modules.inviteLog.onInviteCreate(cfg, client, db, invite);

    },
};
