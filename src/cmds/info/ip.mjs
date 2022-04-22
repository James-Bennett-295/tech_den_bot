import getJson from "../../util/getJson.mjs";
import logger from "@james-bennett-295/logger";
import discord from "discord.js";

export default {
	name: "ip",
	minArgs: 1,
	usage: "<ipv4 address>",
	cooldown: 2500,
	description: "Get information about an IP address.",
	category: "Information",
	botOwnerOnly: false,
	staffOnly: false,
	execute: function (cfg, client, db, msg, args) {

		const ip = args[0];

		if (!/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(ip)) {
			return msg.reply("Invalid IPv4 address entered").catch((e) => { });
		}

		getJson("https://ipinfo.io/" + ip + "/json")
			.then((data) => {
				const embed = new discord.MessageEmbed()
					.setColor("AQUA")
					.setTitle("IP info for " + ip)
					.addFields(
						{ name: "IP", value: (data.ip || "None") },
						{ name: "Hostname", value: (data.hostname || "None") },
						{ name: "City", value: (data.city || "None") },
						{ name: "Region", value: (data.region || "None") },
						{ name: "Country", value: (data.country || "None") },
						{ name: "Location", value: (data.loc || "None") },
						{ name: "Organisation", value: (data.org || "None") },
						{ name: "Postal", value: (data.postal || "None") },
						{ name: "Timezone", value: (data.timezone || "None") },
					);
				msg.reply({ embeds: [embed] }).catch((e) => { });
			})
			.catch((err) => {
				if (typeof err.status !== null && err.status === 404) {
					return msg.reply("That IP does not exist.").catch((e) => { });
				}
				logger.error("[ip cmd]: Failed to get IP info: " + err);
			});

	}
}
