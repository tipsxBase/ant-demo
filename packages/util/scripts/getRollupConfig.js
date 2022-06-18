
const { CWD, getBabelConfig } = require('./shared')
const { babel }  = require('@rollup/plugin-babel')
const typescript = require('rollup-plugin-typescript2');
/**解析 node_modules 中的第三方包的 */
const { nodeResolve } = require('@rollup/plugin-node-resolve')
// 将 cjs 转 esm
const commonjs = require('@rollup/plugin-commonjs');
const path = require('path');

module.exports = (name, format, sourcemap) => {
	const external = [
		'@babel/runtime',
		/^rc-util/,
		'react'
	]
	const plugins = [
		nodeResolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }),
		commonjs(),
		typescript(
			{
				tsconfig: path.resolve(CWD(), 'tsconfig.json')
			}
		),
		babel(getBabelConfig())
	]
	const output = {
		name,
		format,
		sourcemap
	}
	if(output.format === 'es') {
		output.preserveModules = true
		output.dir = path.resolve(CWD(), 'es')
	}
	if(output.format === 'cjs') {
		output.preserveModules = true
		output.dir = path.resolve(CWD(), 'cjs')
		output.exports = 'named'
	}

	return {
		input: path.resolve(CWD(), 'src/index.ts'),
		plugins,
		external,
		output
	}

}