"use strict";

const discord = require("discord.js");
const logger = require("@james-bennett-295/logger");

function onReady(cfg, client, db) {
    logger.debug("[inviteLog module]: Caching invites...");
    client.inviteUses = {}
    client.mainGuild.invites.fetch()
        .then((invites) => {
            invites.forEach((invite) => {
                client.inviteUses[invite.code] = invite.uses;
            });
            logger.debug("[inviteLog module]: Invites cached!");
        });
}

function onInviteCreate(cfg, client, db, invite) {
    client.inviteUses[invite.code] = invite.uses;
    logger.debug("[inviteLog module]: Invite '" + invite.code + "' added to cache");
}

function onInviteDelete(cfg, client, db, invite) {
    delete client.inviteUses[invite.code];
    logger.debig("[inviteLog module]: Invite '" + invite.code + "' removed from cache");
}

function onGuildMemberAdd(cfg, client, db, member) {
    client.mainGuild.invites.fetch()
        .then((invites) => {
            let newInviteUses = {}
            invites.forEach((invite) => {
                newInviteUses[invite.code] = invite.uses;
            });
            let inviteUsed = {}
            Object.keys(newInviteUses).forEach((code) => {
                if (newInviteUses[code] !== client.inviteUses[code]) {
                    let invite = invites.find(i => i.uses > client.inviteUses[i.code]);
                    Object.assign(inviteUsed, invite);
                }
            });
            Object.assign(client.inviteUses, newInviteUses);
            let logChannel = client.mainGuild.channels.cache.get(cfg.channels.inviteLog);
            let embed;
            if (inviteUsed) {
                embed = new discord.MessageEmbed()
                    .setColor("AQUA")
                    .addFields(
                        { name: "Member", value: "<@!" + member.user.id + "> (`" + member.user.tag + "`)" },
                        { name: "Invite Code", value: inviteUsed.code },
                        { name: "Inviter", value: "<@!" + inviteUsed.inviterId + "> (`" + inviteUsed.inviter.tag + "`)" },
                        { name: "Invite Uses", value: inviteUsed.uses.toString() },
                        { name: "Invite Max Uses", value: inviteUsed.maxUses === 0 ? "No Limit" : inviteUsed.maxUses.toString() },
                        { name: "Invite Channel", value: inviteUsed.channelId ? "<#" + inviteUsed.channelId + ">" : "N/A" },
                        { name: "Invite Created Time", value: "<t:" + Math.floor(inviteUsed.createdTimestamp / 1000) + ">" },
                        { name: "Invite Expire Time", value: inviteUsed._expiresTimestamp ? "<t:" + Math.floor(inviteUsed._expiresTimestamp / 1000) + ">" : "None" }
                    );
            } else {
                embed = new discord.MessageEmbed()
                    .setColor("ORANGE")
                    .setDescription("Could not find invite used.")
                    .addField("Member", "<@!" + member.user.id + "> (`" + member.user.tag + "`)")
            }
            logChannel.send({ embeds: [embed], allowedMentions: { parse: [] } });
        });
}

module.exports = { onReady, onGuildMemberAdd, onInviteCreate, onInviteDelete }
