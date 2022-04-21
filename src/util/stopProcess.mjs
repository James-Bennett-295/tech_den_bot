function stopProcess(cfg, client, db) {

	db.save()
		.then(() => {
			process.exit();
		});
}

export default stopProcess;
