import logger from "@james-bennett-295/logger";

export default {
	name: "vacuumdb",
	minArgs: 0,
	usage: null,
	cooldown: 0,
	description: "Vacuum the database.",
	category: "Utility",
	botOwnerOnly: true,
	staffOnly: false,
	exe: function (cfg, client, db, msg, args) {

		db.run("VACUUM main INTO './VACUUMED-db.sqlite3';", (err) => {
			if (err !== null) {
				logger.error("[vacuumdb cmd]: Failed to vacuum database into new file:", err);
				msg.react("\u274c").catch((e) => { }); // :x:
				return;
			}
			msg.react("\u2705").catch((e) => { }); // :white_check_mark:
		});

	}
}
