// This script is called when the extension is uninstalled.
// see : https://code.visualstudio.com/api/references/extension-manifest#extension-uninstall-hook

import * as fs from "fs";
import * as path from "path";

const filepath = path.join(__dirname, "__Registry__.json");
const stats = fs.statSync(filepath);

if (stats.isFile()) {
    fs.unlinkSync(filepath)
}
