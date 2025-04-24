const esbuild = require("esbuild");
const fs = require("node:fs");
const path = require("path");
const server = require("../config/server");
const isProduction = server.isProduction;

// Files to exclude from esbuild processing
const excludeFiles = ["cookieconsent-config.js", "cookieconsent.umd.js"];

module.exports = {
    // All .js files will be recognised as a language. The contents of these files will be processed as per the compile method
    outputFileExtension: "js",
    init: async function () {
        // Create the /assets/js directory on first build (prevents an error from directory not existing)
        fs.mkdir('public/assets/js', { recursive: true }, (err) => {
            if (err) throw err;
        });
    },
    compile: async (content, inputPath) => {
        // If the file isn't from the assets directory, ignore it. It's probably a config file.
        if (!inputPath.includes("./src/assets/")) {
            return;
        }

        // Get the filename from the path
        const filename = path.basename(inputPath);

        // If the file is in the exclude list, just copy it to the public folder without processing
        if (excludeFiles.includes(filename)) {
            return async () => {
                const outputPath = inputPath.replace('./src/assets/js/', 'public/assets/js/');
                // Make sure the directory exists
                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                // Copy the file
                fs.copyFile(inputPath, outputPath, err => {
                    if (err) throw err;
                });
                return undefined;
            };
        }

        // Build JS with ESBuild. If production, minify, use sourcemaps, and target ES6
        const result = await esbuild.build({
            entryPoints: [inputPath],
            outdir: "public/assets/js",
            write: false,
            bundle: true,
            minify: isProduction,
            sourcemap: !isProduction,
            target: isProduction ? "es6" : "esnext",
        });

        return async () => {
            // Iterate over built files from ESBuild process
            result.outputFiles.forEach(file => {
                // Write the ESBuild files to this new directory
                fs.writeFile(file.path, file.text, function (err) {
                    if (err) throw err;
                });
            });

            return undefined;
        };
    }
}; 