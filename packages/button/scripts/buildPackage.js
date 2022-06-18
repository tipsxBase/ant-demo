const compile = require("./compile");
const generateDTS = require("./generateDTS");
const getRollupConfig = require("./getRollupConfig");
const { getPackageJson } = require("./shared");

async function buildPackage() {
	const options = {
		formats: ["cjs", "es", "umd"],
		sourcemap: false,
	};

	const packageJson = getPackageJson();

	// 生成 .d.ts
	await generateDTS();

	const { name } = packageJson;

	const { sourcemap, formats } = options;

	for (const format of formats) {
		const rollupConfig = getRollupConfig(name, format, sourcemap);
		await compile(rollupConfig);
	}
}

module.exports = buildPackage;
