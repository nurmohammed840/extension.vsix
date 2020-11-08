//@ts-check
let fs = require("fs");

module.exports = {
	writeFile(filename, data) {
		return new Promise((res, rej) => {
			fs.writeFile(filename, data, (err) => err ? rej(err) : res())
		})
	},
	/**
	 * ```
	 * if file or directory not found:
	 *   reject(`path`) 
	 * else
	 *   resolve(stats: {...fs.stats, path } )
	 * ```
	 * @param {string} path 
	 */
	checkFileOrDirectory(path) {
		return new Promise((res, rej) => {
			fs.stat(path, (err, stats) => {
				if (err) return rej(path)
				//@ts-ignore
				stats.path = path;
				return res(stats)
			});
		})
	},
	deferred() {
		let methods;
		const promise = new Promise((resolve, reject) => {
			methods = { resolve, reject };
		});
		return Object.assign(promise, methods);
	}
}

