//@ts-ignore
// Feel free to modify, If you break something.
// Just Reinstall this extention. :)

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
	 *   reject({path,workspaceName})
	 * else
	 *   resolve(stats: {...fs.stats, path, workspaceName } )
	 * ```
	 */
	checkFileOrDirectory(path, workspaceName) {
		return new Promise((res, rej) => {
			fs.stat(path, (err, stats) => {
				if (err) return rej({ path, workspaceName })
				stats.path = path;
				stats.workspaceName = workspaceName;
				return res(stats)
			});
		})
	},
	/**
	 * It return a Promise.
	 * Its has ability of self resolve or reject
	 */
	deferred() {
		let methods;
		const promise = new Promise((resolve, reject) => {
			methods = { resolve, reject };
		});
		return Object.assign(promise, methods);
	}
}

