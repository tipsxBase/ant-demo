const { src, dest, parallel } = require('gulp')
const gulpLess = require('gulp-less')
const gulpBabel = require('gulp-babel')
const gulpTs = require('gulp-typescript')
const { getTsConfig, getBabelConfig } = require('./scripts/shared')

async function compileTsToESM(){
	const tsconfig = getTsConfig()
	const { compilerOptions } = tsconfig
	return src('./src/index.ts').pipe(gulpTs(compilerOptions)).js.pipe(gulpBabel(getBabelConfig(true))).pipe(dest('esm'))
}

async function compileTsToCJS(){
	const tsconfig = getTsConfig()
	const { compilerOptions } = tsconfig
	return src('./src/index.ts').pipe(gulpTs(compilerOptions)).js.pipe(gulpBabel(getBabelConfig(false))).pipe(dest('cjs'))

}

async function generateDts(){
	const tsconfig = getTsConfig()
	const { compilerOptions } = tsconfig
	return src('./src/index.ts').pipe(gulpTs({
		...compilerOptions,
		"declaration": true,
		"emitDeclarationOnly": true
	})).dts.pipe(dest('lib'))
}


async function copyLess(){
	return src('./src/**/*.less').pipe(dest('esm')).pipe(dest('cjs'))
}

async function compileLessToCss(){
	return src('./src/index.less').pipe(gulpLess({
			javascriptEnabled: true
	})).pipe(dest('esm')).pipe(dest('cjs'))
}

async function compileTs(){
	await compileTsToESM()
	await compileTsToCJS()
}

exports.default = parallel(compileLessToCss, copyLess, compileTs, generateDts)