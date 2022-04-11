import getJson from "../util/getJson.mjs";
import fs from "node:fs";
import logger from "@james-bennett-295/logger";

function doCaching() {
	logger.debug("[miscCaching module]: Caching randomduk...");
	getJson("https://random-d.uk/api/v2/list")
		.then((data) => {
			const randomdukData = {
				gifCount: data.gif_count,
				gifs: data.gifs,
				imgCount: data.image_count,
				imgs: data.images
			}
			fs.writeFile("./cache/randomduk.json", JSON.stringify(randomdukData), (err) => {
				if (err) logger.error("[miscCaching module]: Failed to write './cache/randomduk.json' file: " + err);
			});
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
			fs.writeFile("./cache/thecatapiBreeds.json", JSON.stringify(thecatapiBreedsData), (err) => {
				if (err) logger.error("[miscCaching module]: Failed to write './cache/thecatapiBreeds.json' file: " + err);
			});
			logger.debug("[miscCaching module]: Cached thecatapiBreeds");
		})
		.catch((err) => {
			logger.error("[miscCaching module]: Failed to fetch data from https://api.thecatapi.com/v1/breeds\nERROR: " + err);
		});
}

function onStart(cfg, client, db) {

	if (fs.existsSync("./cache/")) {
		logger.debug("[miscCaching module]: dir ./cache/ already exists");
		doCaching();
	} else {
		logger.debug("[miscCaching module]: dir ./cache/ does not exist, creating...");
		fs.mkdir("./cache/", (err) => {
			if (err) return logger.error("[miscCaching module]: Failed to create ./cache/ dir: " + err);
			logger.debug("[miscCaching module]: dir ./cache/ created");
			doCaching();
		});
	}

}

export { onStart }
