import findImg from "../../util/findImg.mjs";
import jimp from "jimp";

export default {
	name: "rotate",
	minArgs: 0,
	usage: null,
	cooldown: 6000,
	description: "Rotate an image.",
	category: "Image Manipulation",
	botOwnerOnly: false,
	staffOnly: false,
	exe: function(cfg, client, db, msg, args) {

		findImg(msg)
			.then((attachment) => {
				jimp.read(attachment)
					.then((img) => {
						img
							.rotate(270, true) // 270 instead of 90 so rotates clockwise, not anticlockwise
							.getBufferAsync("image/png")
							.then((imgBuffer) => {
								msg.reply({ files: [{ attachment: imgBuffer, name: "rotate.png" }] }).catch((e) => { });
							})
							.catch((err) => { logger.error("[rotate cmd]: Failed to manipulate image: ", err); });
					})
					.catch((err) => { logger.error("[rotate cmd]: Failed to read image: ", err); });
			})
			.catch((e) => {
				switch (e) {
					case "NO_IMAGE":
						msg.reply("No image was found!").catch((e) => { });
						break;
					case "NOT_IMAGE":
						msg.reply("First attached file is not an image!").catch((e) => { });
				}
			});

	}
}
