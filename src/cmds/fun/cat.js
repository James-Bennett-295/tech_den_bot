"use strict";

const axios = require("axios");
const discord = require("discord.js");
const breeds = require("../../../cache/thecatapiBreeds.json");

module.exports = {
    name: "cat",
    minArgs: 0,
    usage: "<breed/\"getBreeds\">",
    cooldown: 2500,
    description: "Get a random cat image!",
    category: "Fun",
    botOwnerOnly: false,
    execute(cfg, client, db, msg, args) {

        if (args[0] && args[0].toLowerCase() === "getbreeds") {
            return msg.reply("**__CAT BREEDS__**\n" + breeds.names.join(", ") + ".").catch((e) => {});
        };

        let url = "https://api.thecatapi.com/v1/images/search";

        if (args[0]) {
            let breedName = args.join(' ').toLowerCase();

            if (breeds.index[breedName]) {
                url += "?breed_ids=" + breeds.index[breedName];
            } else {
                return msg.reply("Breed not found!");
            };
        };

        axios.get(url)
            .then((res) => {
                let embed = new discord.MessageEmbed()
                    .setColor("AQUA")
                    .setTitle("Here is your cat! \ud83d\udc31")
                    .setImage(res.data[0].url)
                    .setFooter({ text: "Source: thecatapi.com" });
                if (res.data[0].breeds.length > 0) {
                    embed.setDescription("Breed: " + res.data[0].breeds[0].name);
                };
                msg.reply({ embeds: [embed] }).catch((e) => {});
            });

    },
};
