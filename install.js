const cp = require("child_process");
const fs = require("fs");

let package = JSON.parse(fs.readFileSync("./package.json").toString())

cp.exec(`vsce package && code --install-extension ${package.name}-${package.version}.vsix`, (error, stdout) => {
    if (error) return console.error(error);
    console.log(stdout);
});