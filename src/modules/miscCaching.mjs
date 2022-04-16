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
					logger.error("[miscCaching module]: Failed to write './cache/randomduk.json' file: " + err);
				})
			logger.debug("[miscCaching module]: Cached randomduk");
		})
		.catch((err) => {
			logger.error("[miscCaching module]: Failed to fetch data from https://random-d.uk/api/v2/list\nERROR: " + err);
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
			for (let i in breedIds) {
				thecatapiBreedsData.index[breedNames[i]] = breedIds[i];
				thecatapiBreedsData.names.push(breedNames[i]);
			}
			writeFile("./cache/thecatapiBreeds.json", JSON.stringify(thecatapiBreedsData))
				.catch((err) => {
					logger.error("[miscCaching module]: Failed to write './cache/thecatapiBreeds.json' file: " + err);
				});
			logger.debug("[miscCaching module]: Cached thecatapiBreeds");
		})
		.catch((err) => {
			logger.error("[miscCaching module]: Failed to fetch data from https://api.thecatapi.com/v1/breeds\nERROR: " + err);
		});

}

function onReady(cfg, client, db) {
	function cacheMemberCount() {
		logger.debug("[miscCaching module]: Updating memberCount cache...");
		client.mainGuild.members.fetch().then((members) => {
			try {
				client.memberCount = members.filter(m => !m.user.bot).size;
				logger.debug("[miscCaching module]: memberCount cache updated");
			} catch (err) {
				logger.error("[miscCaching module]: Failed to update memberCount cache: " + err);
			}
		});
	}
	cacheMemberCount();
	setInterval(() => {
		cacheMemberCount();
	}, 900000); // 15 mins
}

export { onStart, onReady }
