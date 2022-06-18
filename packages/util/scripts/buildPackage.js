
const path = require('path')
const getRollupConfig = require('./getRollupConfig')
const { getPackageJson } = require('./shared')
const compile = require('./compile')

async function buildPackage(){
	const options = {
		sourcemap: true,
		formats: ['es', 'cjs']
	}
	const packageJson = await getPackageJson()

	for (const format of options.formats) {
		const rollupConfig = getRollupConfig(packageJson.name, format, options.sourcemap)
		await compile(rollupConfig)
	}
}



module.exports = buildPackage