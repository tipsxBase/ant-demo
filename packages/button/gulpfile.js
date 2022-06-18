const { parallel, src, dest } = require("gulp");
const buildPackage = require("./scripts/buildPackage");
const less = require("gulp-less");
const replace = require("gulp-replace");
const gulpTs = require("gulp-typescript");
const { getTsConfig } = require("./scripts/shared");
const babel = require("gulp-babel");
const tsConfig = getTsConfig();

async function compileLess(isEsm) {
	const targetDir = isEsm ? "es/style" : "cjs/style";

	return src(["src/style/index.less"])
		.pipe(
			replace(
				/(@import\s['"])~@study\/style\/([^'"]+['"])/g,
				"$1../../packages/style/$2"
			)
		)
		.pipe(
			less({
				javascriptEnabled: true,
			})
		)
		.pipe(dest(targetDir));
}

async function compileStyle(isEsm) {
	const targetDir = isEsm ? "es/style" : "cjs/style";
	const targetPath = isEsm ? "es" : "cjs";
	// import '@study/style/src/index.less';
	return src(["src/style/*.tsx", "src/style/*.ts"])
		.pipe(
			replace(
				/(import\s['"])@study\/style\/src\/([^'"]+['"])/g,
				`$1@study/style/${targetPath}/$2`
			)
		)
		.pipe(
			gulpTs({
				...tsConfig.compilerOptions,
				// module: "commonjs",
			})
		)
		.js.pipe(
			babel({
				presets: [
					["@babel/preset-react"],
					[
						"@babel/preset-env",
						{
							modules: isEsm ? false : "cjs",
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
				plugins: [["@babel/plugin-transform-runtime", { corejs: 3 }]],
			})
		)
		.pipe(dest(targetDir));
}

async function copyLess(isEsm) {
	const targetDir = isEsm ? "es/style" : "cjs/style";
	src(["src/style/*.less"]).pipe(dest(targetDir));
}

async function compileToESM() {
	await compileLess(true);
	await compileStyle(true);
	await copyLess(true);
}

async function compileToCJS() {
	await compileLess(false);
	await compileStyle(false);
	await copyLess(false);
}

exports.default = parallel(buildPackage, compileToESM, compileToCJS);

console.log(
	"@import '~@study/style/src/themes/index.less'".replace(
		/(@import\s['"])~@study\/style\/([^'"]+['"])/,
		"$1../../packages/style/$2"
	)
);

const targetDir = "es/style";

console.log(
	"import '@study/style/src/index.less'".replace(
		/(import\s['"])@study\/style\/src\/([^'"]+['"])/,
		`$1@study/style/${targetDir}/$2`
	)
);
