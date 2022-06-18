var spawn = require("child-process-promise").spawn;

async function generateDTS() {
	try {
		await spawn(
			"tsc",
			[
				"--project",
				"tsconfig.json",
				"--declaration",
				"true",
				"--declarationMap",
				"false",
				"--emitDeclarationOnly",
				"true",
				"--declarationDir",
				"lib",
			],
			{ capture: ["stdout", "stderr"] }
		);
	} catch (error) {
		console.log(error);
	}
}

module.exports = generateDTS;
