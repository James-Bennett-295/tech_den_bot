"use strict";

const findImg = require("../../util/findImg.js");
const jimp = require("jimp");

module.exports = {
    name: "greyscale",
    minArgs: 0,
    usage: null,
    cooldown: 6000,
    description: "Convert an image to greyscale.",
    category: "Image Manipulation",
    botOwnerOnly: false,
    staffOnly: false,
    execute(cfg, client, db, msg, args) {

        findImg(msg)
            .then((attachment) => {
                jimp.read(attachment)
                    .then((img) => {
                        img
                            .greyscale()
                            .getBufferAsync("image/png")
                            .then((imgBuffer) => {
                                msg.reply({ files: [{ attachment: imgBuffer, name: "greyscale.png" }] }).catch((e) => {});
                            })
                            .catch((err) => { logger.error("[greyscale cmd]: Failed to manipulate image: " + err); });
                    })
                    .catch((err) => { logger.error("[greyscale cmd]: Jimp failed to read image: " + err); });
            })
            .catch((e) => {
                switch (e) {
                    case "NO_IMAGE":
                        msg.reply("No image was found!");
                        break;
                    case "NOT_IMAGE":
                        msg.reply("First attached file is not an image!");
                };
            });

    },
};
