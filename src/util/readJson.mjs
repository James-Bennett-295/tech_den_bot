import fs from "node:fs";

function readJson(file) {
	let promise = new Promise((resolve, reject) => {

		fs.readFile(file, "utf8", (err, json) => {
			if (err) reject(err);
			resolve(JSON.parse(json));
		});

	});
	return promise;
}

export default readJson;
