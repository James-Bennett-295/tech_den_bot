"use strict";

function onReady(cfg, client, db) {

    let statusNum = -1;
    setInterval(() => {
        statusNum++;
        if (cfg.status.statuses.length <= statusNum) statusNum = 0;
        client.mainGuild.members.fetch().then((members) => {
            client.user.setPresence({
                activities: [
                    {
                        name: cfg.status.statuses[statusNum][1]
                            .replace("{userCount}", members.filter(m => !m.user.bot).size)
                      , type: cfg.status.statuses[statusNum][0]
                    }
                ],
                status: "online"
            });
        });
    }, cfg.status.cycleTime * 1000);

};

module.exports = { onReady };
