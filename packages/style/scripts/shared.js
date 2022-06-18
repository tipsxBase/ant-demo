
const path = require('path')
const fs = require('fs-extra')

function CWD(){
	return process.cwd()
}

function getBabelConfig(isESM){
	return {
		presets: [
      [
        '@babel/preset-env',
        {
          modules: isESM ? false : 'commonjs',
          targets: {
            browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'IE 11', 'not dead'],
          },
        },
      ],
    ],
    plugins: [['@babel/plugin-transform-runtime', { corejs: 3 }]],
	}
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
	tsconfigPath = path.join(CWD(), 'tsconfig.json'), 
	subConfig = { compilerOptions: {} }
) {
	if(fs.pathExistsSync(tsconfigPath)) {
		let config = fs.readJSONSync(tsconfigPath)
		const { compilerOptions } = config
		const { compilerOptions: sunCompilerOptions } = subConfig
		subConfig.compilerOptions = { ...compilerOptions, ...sunCompilerOptions }
		Object.assign(config, subConfig)
		if(config.extends) {
			const extendsPath = path.join(path.dirname(tsconfigPath), config.extends)
			config = getTsConfig(extendsPath, config)
			delete config.extends
		}
		return config
	}

	return subConfig
}

module.exports = {
	getBabelConfig,
	getTsConfig
}
