"use strict";

const axios = require("axios");
const fs = require("node:fs");
const logger = require("@james-bennett-295/logger");

function onStart(cfg, client, db) {

    axios.get("https://random-d.uk/api/v2/list")
        .then((res) => {
            const data = {
                gifCount: res.data.gif_count,
                gifs: res.data.gifs,
                imgCount: res.data.image_count,
                imgs: res.data.images
            };
            fs.writeFile("./cache/randomduk.json", JSON.stringify(data), (err) => {
                if (err) logger.error("[miscCaching module]: Failed to write './cache/randomduk.json' file: " + err);
            });
        })
        .catch((err) => {
            logger.error("[miscCaching module]: Failed to fetch data from https://random-d.uk/api/v2/list\nERROR: " + err);
        });

    axios.get("https://api.thecatapi.com/v1/breeds")
        .then((res) => {
            let breedIds = res.data.map(i => {
                return i.id;
            });
            let breedNames = res.data.map(i => {
                return i.name.toLowerCase();
            });
            let data = {
                "index": {},
                "names": []
            };
            for (let i in breedIds) {
                data.index[breedNames[i]] = breedIds[i];
                data.names.push(breedNames[i]);
            };
            fs.writeFile("./cache/thecatapiBreeds.json", JSON.stringify(data), (err) => {
                if (err) logger.error("[miscCaching module]: Failed to write './cache/thecatapiBreeds.json' file: " + err);
            });
        })
        .catch((err) => {
            logger.error("[miscCaching module]: Failed to fetch data from https://api.thecatapi.com/v1/breeds\nERROR: " + err);
        });

};

module.exports = { onStart };
