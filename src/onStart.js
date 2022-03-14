"use strict";

function onStart(cfg, client, db) {

    client.btnId = 0;

    client.modules = {};
    client.modules.cmds = require("./modules/cmds.js");
    client.modules.msgDeleteLog = require("./modules/msgDeleteLog.js");
    client.modules.msgXp = require("./modules/msgXp.js");

    client.modules.msgDeleteLog.onStart(cfg, client, db);
    client.modules.cmds.onStart(cfg, client, db);

};

module.exports = onStart;
