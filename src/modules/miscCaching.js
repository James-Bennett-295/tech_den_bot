"use strict";

const axios = require("axios");
const fs = require("node:fs");
const logger = require("@james-bennett-295/logger");

function onStart(cfg, client, db) {

    axios.get("https://random-d.uk/api/v2/list")
        .then(res => {
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
        .catch(err => {
            logger.error("[miscCaching module]: Failed to fetch data from https://random-d.uk/api/v2/list\nERROR: " + err);
        });

};

module.exports = { onStart };
