let fs = require("fs");

let writeFile = (filename, data) => new Promise((res, rej) => {
    fs.writeFile(filename, data, (err) => err ? rej(err) : res())
});

module.exports = {
    writeFile
}