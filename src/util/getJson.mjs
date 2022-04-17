import https from "node:https";

function getJson(url) {
	const promise = new Promise((resolve, reject) => {

		const urlObj = new URL(url);

		const req = https.request({
			hostname: urlObj.hostname,
			port: 443,
			path: urlObj.pathname + urlObj.search,
			method: "GET"
		}, (res) => {

			if (res.statusCode !== 200) {
				let error = new Error("Status code " + res.statusCode);
				error.status = res.statusCode;
				reject(error);
			}

			let json = "";

			res.on("data", (chunk) => {
				json += chunk;
			});

			res.on("end", () => {
				try {
					resolve(JSON.parse(json));
				} catch (err) {
					reject(err);
				}
			});

		});

		req.on("error", (err) => {
			reject(err);
		});

		req.end();

	});
	return promise;
}

export default getJson;
