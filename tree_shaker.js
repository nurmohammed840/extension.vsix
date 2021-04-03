// @ts-check
const fs = require("fs").promises;
const { parse } = require("hjson");

/** Run This Script, Before Any Pull Request. It Remove All Dead Code And Sort Color Schema. */
async function main() {
    const
        buffer = await fs.readFile("./JustBlack.json"),
        tokenColorsMultiScope = [],
        tokenColorsSingleScope = [],
        tokenColorsByStyles = {},
        tokenColorsByTextmate = {},
        colorSchema = parse(buffer.toString());

    console.time("Successful");

    function addTokenColorsByTextmate(textmate, { foreground = "", fontStyle = "" }) {
        const styleKey = (foreground + ";" + fontStyle).trim();
        if (foreground || fontStyle)
            tokenColorsByTextmate[textmate] = styleKey;
    }

    for (const { scope, settings } of colorSchema.tokenColors)
        if (Array.isArray(scope))
            for (const textmate of scope)
                addTokenColorsByTextmate(textmate, settings);
        else
            addTokenColorsByTextmate(scope, settings);

    for (const [textmate, styleKey] of Object.entries(tokenColorsByTextmate)) {
        tokenColorsByStyles[styleKey] = tokenColorsByStyles[styleKey] ?? [];
        tokenColorsByStyles[styleKey].push(textmate);
    }

    for (const [styleKey, scope] of Object.entries(tokenColorsByStyles)) {
        const [foreground, fontStyle] = styleKey.split(";");

        if (scope.length == 1)
            tokenColorsSingleScope.push({ scope: scope[0], settings: { foreground, fontStyle } })
        else
            tokenColorsMultiScope.push({ scope: scope.sort(), settings: { foreground, fontStyle } })
    }

    colorSchema.tokenColors =
        tokenColorsSingleScope.sort((a, b) => a.scope < b.scope && -1)
            .concat(tokenColorsMultiScope.sort((a, b) => a.scope.length - b.scope.length));

    console.timeEnd("Successful");
    return fs.writeFile("./JustBlack.json", JSON.stringify(colorSchema, null, 4));
}

console.time("Done");
main().catch(console.error).finally(() => console.timeEnd("Done"));