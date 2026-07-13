// deno-lint-ignore no-import-prefix
import { parse } from "https://esm.sh/hjson@3.2.2";

/** Run This Script, Before Any Pull Request. It Remove All Dead Code And Sort Color Schema. */
async function main() {
    let justBlack = parse(await Deno.readTextFile("./JustBlack.json"));
    const
        justBlackSemantic = parse(await Deno.readTextFile("./JustBlack.semantic.json")),
        tokenColorsMultiScope = [],
        tokenColorsSingleScope = [],
        tokenColorsByStyles = {},
        tokenColorsByTextmate = {};

    justBlack = { ...justBlack, ...justBlackSemantic };

    function addTokenColorsByTextmate(textmate, { foreground = "", fontStyle = "" }) {
        const styleKey = (foreground + ";" + fontStyle).trim();
        if (foreground || fontStyle) tokenColorsByTextmate[textmate] = styleKey;
    }

    for (const { scope, settings } of justBlack.tokenColors)
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

    justBlack.tokenColors = tokenColorsSingleScope
        .sort((a, b) => a.scope < b.scope && -1)
        .concat(tokenColorsMultiScope.sort((a, b) => a.scope.length - b.scope.length));

    return Deno.writeTextFile("./JustBlack.json", JSON.stringify(justBlack, null, 2));
}

console.time("Done");
main().catch(console.error).finally(() => console.timeEnd("Done"));