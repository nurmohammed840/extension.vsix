const cp = require("child_process");
const fs = require("fs");

const package = JSON.parse(fs.readFileSync("./package.json").toString())
console.log('\033c')
console.log(`Installing... ${package.name}-${package.version}.vsix`);
console.time('Done');
cp.exec(`vsce package && code --install-extension ${package.name}-${package.version}.vsix`, (error, stdout) => {
    if (error) return console.error(error);
    console.log(stdout);
    console.timeEnd('Done');
});