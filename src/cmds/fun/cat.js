"use strict";

const axios = require("axios");
const discord = require("discord.js");

module.exports = {
    name: "cat",
    minArgs: 0,
    usage: null,
    cooldown: 2500,
    description: "Get a random cat image!",
    category: "Fun",
    botOwnerOnly: false,
    execute(cfg, client, db, msg, args) {

        axios.get("https://api.thecatapi.com/v1/images/search")
            .then((res) => {
                let embed = new discord.MessageEmbed()
                    .setColor("AQUA")
                    .setTitle("Here is your cat! \ud83d\udc31")
                    .setImage(res.data[0].url)
                    .setFooter({ text: "Source: https://thecatapi.com/" });
                if (res.data[0].breeds.length > 0) {
                    embed.setDescription(res.data[0].breeds[0].name);
                };
                msg.reply({ embeds: [embed] }).catch((e) => {});
            });

    },
};
