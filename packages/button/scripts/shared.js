const fs = require("fs-extra");
const path = require("path");
const { cwd } = require("process");

let innerPackageJson = null;

function CWD() {
	return process.cwd();
}

function getBabelConfig() {
	return {
		babelHelpers: "runtime",
		extensions: [".ts", ".tsx"],
		presets: [
			["@babel/preset-react"],
			[
				"@babel/preset-env",
				{
					targets: {
						browsers: [
							"> 0.5%",
							"last 2 versions",
							"Firefox ESR",
							"IE 11",
							"not dead",
						],
					},
				},
			],
		],
		plugins: [["@babel/plugin-transform-runtime"]],
	};
}

/**
 * { extends: 'xxx', compilerOptions: {} }
 * xxx
 * { extends: 'xxxx', compilerOptions: {} }
 *
 *
 * @param {*} tsconfigPath
 * @param {*} subConfig
 * @returns
 */

function getTsConfig(
	tsconfigPath = path.join(CWD(), "tsconfig.json"),
	subConfig = { compilerOptions: {} }
) {
	if (fs.pathExistsSync(tsconfigPath)) {
		let config = fs.readJSONSync(tsconfigPath);
		const { compilerOptions } = config;
		const { compilerOptions: sunCompilerOptions } = subConfig;
		subConfig.compilerOptions = {
			...compilerOptions,
			...sunCompilerOptions,
		};
		Object.assign(config, subConfig);
		if (config.extends) {
			const extendsPath = path.join(
				path.dirname(tsconfigPath),
				config.extends
			);
			config = getTsConfig(extendsPath, config);
			delete config.extends;
		}
		return config;
	}

	return subConfig;
}

function getPackageJson() {
	if (innerPackageJson) {
		return innerPackageJson;
	}
	const packageJsonPath = path.resolve(cwd(), "package.json");
	if (fs.pathExistsSync(packageJsonPath)) {
		innerPackageJson = fs.readJSONSync(packageJsonPath);
	}
	return innerPackageJson;
}

module.exports = {
	getPackageJson,
	CWD,
	getBabelConfig,
	getTsConfig,
};
