"use strict";

function onStart(cfg, client, db) {

    const d = new Date();
    client.processStartTime = d.getTime();

    client.btnId = 0;

    client.modules = {};
    client.modules.cmds = require("./modules/cmds.js");
    client.modules.msgDeleteLog = require("./modules/msgDeleteLog.js");
    client.modules.msgRewards = require("./modules/msgRewards.js");
    client.modules.miscCaching = require("./modules/miscCaching.js");
    client.modules.status = require("./modules/status.js");
    client.modules.reminders = require("./modules/reminders.js");
    client.modules.bumpReminder = require("./modules/bumpReminder.js");
    client.modules.inviteLog = require("./modules/inviteLog.js");

    client.modules.msgDeleteLog.onStart(cfg, client, db);
    client.modules.cmds.onStart(cfg, client, db);
    client.modules.miscCaching.onStart(cfg, client, db);

};

module.exports = onStart;
