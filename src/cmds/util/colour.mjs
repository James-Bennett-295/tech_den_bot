import sharp from "sharp";
import jimp from "jimp";
import discord from "discord.js";

export default {
	name: "colour",
	minArgs: 1,
	usage: "<hex colour>",
	cooldown: 3500,
	description: "View a hex colour.",
	category: "Utility",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		let hex = args[0];

		if (hex.charAt(0) === '#') hex = hex.slice(1, hex.length);

		if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
			return msg.reply("Invalid hex number!");
		}

		const num = parseInt(hex, 16);

		if (isNaN(num) || num < 0 || 16777215 < num) {
			return msg.reply("Invalid colour!");
		}

		const r = (num >> 16) & 255;
		const g = (num >> 8) & 255;
		const b = num & 255;

		const font = (r * 0.2126) + (g * 0.7152) + (b * 0.0722) < 128 ? jimp.FONT_SANS_32_WHITE : jimp.FONT_SANS_32_BLACK;

		sharp({
			create: {
				width: 200,
				height: 100,
				channels: 3,
				background: { r: r, g: g, b: b }
			}
		})
			.png()
			.toBuffer()
			.then((buf) => {
				jimp.loadFont(font).then(jFont => {
					jimp
						.read(buf)
						.then((img) => {
							img
								.print(jFont, 8, 8, '#' + hex.toUpperCase())
								.getBufferAsync("image/png")
								.then((tBuf) => {
									const file = new discord.MessageAttachment(tBuf, hex.toLowerCase() + ".png");
									msg.reply({ files: [file] }).catch((e) => { });
								})
						});
				});
			});

	}
}
