"use strict";

const logger = require("@james-bennett-295/logger");

module.exports = {
    name: "ready",
    once: true,
    execute(cfg, client, db) {

        logger.info("Logged in as " + client.user.tag);

    },
};
