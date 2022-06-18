const { CWD, getBabelConfig, getPackageJson } = require("./shared");
const { babel } = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");
/**解析 node_modules 中的第三方包的 */
const { nodeResolve } = require("@rollup/plugin-node-resolve");
// 将 cjs 转 esm
const commonjs = require("@rollup/plugin-commonjs");
const path = require("path");

module.exports = (name, format, sourcemap) => {
	const packageJson = getPackageJson();

	const { dependencies, peerDependencies, umdName } = packageJson;
	let external = [];
	if (format === "umd") {
		external = [
			...new Set(
				[...Object.keys({ ...peerDependencies })].map((dep) => {
					if (dep.startsWith("@study")) {
						return dep;
					} else {
						return new RegExp(dep);
					}
				})
			),
		];
	} else {
		external = [
			...new Set(
				[...Object.keys({ ...dependencies, ...peerDependencies })].map(
					(dep) => {
						if (dep.startsWith("@study")) {
							return dep;
						} else {
							return new RegExp(dep);
						}
					}
				)
			),
			/@babel\/runtime/,
		];
	}

	const plugins = [
		commonjs(),
		nodeResolve({
			extensions: [".ts", ".tsx", ".js", ".jsx"],
		}),
		typescript({
			tsconfig: path.resolve(CWD(), "tsconfig.json"),
		}),
		babel(getBabelConfig()),
	];
	const output = {
		name,
		format,
		sourcemap,
	};
	if (output.format === "es") {
		output.preserveModules = true;
		output.dir = path.resolve(CWD(), "es");
	}
	if (output.format === "cjs") {
		output.preserveModules = true;
		output.dir = path.resolve(CWD(), "cjs");
		output.exports = "named";
	}
	if (output.format === "umd") {
		output.name = umdName;
		output.file = `${CWD()}/dist/index.umd.js`;
		output.globals = {
			react: "React",
			"react-dom": "ReactDOM",
		};
	}

	return {
		input: path.resolve(CWD(), "src/index.ts"),
		plugins,
		external,
		output,
	};
};
