
const { rollup } = require('rollup')

module.exports = async (config) => {
	let bundle;
  let buildFailed = false;
  try {
    bundle = await rollup(config);

		let { output } = config
		let outputs = Array.isArray(output) ? output : [output]
    await Promise.all(outputs.map(output => bundle.write(output)));;
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }finally {
    if (bundle) {
      await bundle.close();
    }
  }
}