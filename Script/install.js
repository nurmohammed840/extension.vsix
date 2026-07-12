const fs = require("fs");
const cp = require("child_process");
const package = JSON.parse(fs.readFileSync("./package.json").toString());
const extensionPath = `${package.name}-${package.version}.vsix`;

console.log('\033c');
console.time('Done');
console.log(`Installing... ${extensionPath}`);

cp.exec(`vsce package && code --install-extension ${extensionPath}`, (err, stdout) => {
    if (err) console.error(err);
    else console.log(stdout);
    console.timeEnd('Done');
});