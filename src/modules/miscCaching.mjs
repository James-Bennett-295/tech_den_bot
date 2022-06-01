import getJson from "../util/getJson.mjs";
import writeFile from "@james-bennett-295/writefile";
import logger from "@james-bennett-295/logger";

function onStart(cfg, client, db) {

	logger.debug("[miscCaching module]: Caching randomduk...");
	getJson("https://random-d.uk/api/v2/list")
		.then((data) => {
			const randomdukData = {
				gifCount: data.gif_count,
				gifs: data.gifs,
				imgCount: data.image_count,
				imgs: data.images
			}
			writeFile("./cache/randomduk.json", JSON.stringify(randomdukData))
				.catch(() => {
					logger.error("[miscCaching module]: Failed to write './cache/randomduk.json' file: ", err);
				})
			logger.debug("[miscCaching module]: Cached randomduk");
		})
		.catch((err) => {
			logger.error("[miscCaching module]: Failed to fetch data from https://random-d.uk/api/v2/list\n", err);
		});

	logger.debug("[miscCaching module]: Caching thecatapiBreeds...");
	getJson("https://api.thecatapi.com/v1/breeds")
		.then((data) => {
			let breedIds = data.map(i => {
				return i.id;
			});
			let breedNames = data.map(i => {
				return i.name.toLowerCase();
			});
			let thecatapiBreedsData = {
				"index": {},
				"names": []
			}
			for (let i = 0; i < breedIds.length; i++) {
				thecatapiBreedsData.index[breedNames[i]] = breedIds[i];
				thecatapiBreedsData.names.push(breedNames[i]);
			}
			writeFile("./cache/thecatapiBreeds.json", JSON.stringify(thecatapiBreedsData))
				.catch((err) => {
					logger.error("[miscCaching module]: Failed to write './cache/thecatapiBreeds.json' file: ", err);
				});
			logger.debug("[miscCaching module]: Cached thecatapiBreeds");
		})
		.catch((err) => {
			logger.error("[miscCaching module]: Failed to fetch data from https://api.thecatapi.com/v1/breeds\n", err);
		});

}

function onReady(cfg, client, db) {
	logger.debug("[miscCaching module]: Caching memberCount...");
	client.mainGuild.members.fetch().then((members) => {
		try {
			client.memberCount = members.filter(m => !m.user.bot).size;
			logger.debug("[miscCaching module]: memberCount cached");
		} catch (err) {
			logger.error("[miscCaching module]: Failed to cache memberCount: ", err);
		}
	});

	logger.debug("[miscCaching module]: Caching invites...");
	client.inviteUses = {}
	client.mainGuild.invites.fetch()
		.then((invites) => {
			invites.forEach((invite) => {
				client.inviteUses[invite.code] = invite.uses;
			});
			logger.debug("[miscCaching module]: Invites cached");
		});
}

function onGuildMemberAdd(cfg, client, db, member) {
	if (typeof client.memberCount === "undefined") {
		return logger.debug("[miscCaching module]: Not adding new member to memberCount cache as client.memberCount is undefined");
	}
	client.memberCount++;
	logger.debug("[miscCaching module]: Added new member to memberCount cache");
}

function onGuildMemberRemove(cfg, client, db, member) {
	if (typeof client.memberCount === "undefined") {
		return logger.debug("[miscCaching module]: Not removing old member from memberCount cache as client.memberCount is undefined");
	}
	client.memberCount--;
	logger.debug("[miscCaching module]: Removed old member from memberCount cache");
}

function onInviteCreate(cfg, client, db, invite) {
	client.inviteUses[invite.code] = invite.uses;
	logger.debug("[miscCaching module]: Invite \"" + invite.code + "\" added to cache");
}

function onInviteDelete(cfg, client, db, invite) {
	delete client.inviteUses[invite.code];
	logger.debug("[miscCaching module]: Invite \"" + invite.code + "\" removed from cache");
}

export {
	onStart,
	onReady,
	onGuildMemberAdd,
	onGuildMemberRemove,
	onInviteCreate,
	onInviteDelete
}

