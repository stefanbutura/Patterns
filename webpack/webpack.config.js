// Webpack configuration for the Patternslib bundle distribution.
process.traceDeprecation = true;
const CopyPlugin = require("copy-webpack-plugin");
const mf_config = require("@patternslib/dev/webpack/webpack.mf");
const package_json = require("../package.json");
const path = require("path");
const webpack_config = require("@patternslib/dev/webpack/webpack.config").config;

module.exports = () => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "../src/index.js"),
            "bundle-polyfills.min": path.resolve(__dirname, "../src/polyfills.js"),
        },
    };

    config = webpack_config({
        config: config,
        package_json: package_json,
    });

    config.output.path = path.resolve(__dirname, "../dist/");

    // Modernizr
    config.module.rules.push({
        test: /\.modernizrrc\.js$/,
        loader: "webpack-modernizr-loader",
    });
    config.resolve.alias = {
        modernizr$: path.resolve(__dirname, "../.modernizrrc.js"),
    };

    config.plugins.push(
        mf_config({
            name: "patternslib",
            remote_entry: config.entry["bundle.min"],
            dependencies: package_json.dependencies,
            shared: {
                jquery: {
                    singleton: true,
                    requiredVersion: package_json.dependencies["jquery"],
                    eager: true,
                },
            },
        })
    );

    // Polyfills
    config.plugins.push(
        // Copy polyfills loader to the output path.
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, "../src/polyfills-loader.js"), }, // prettier-ignore
            ],
        })
    );

    if (process.env.NODE_ENV === "development") {
        config.devServer.static.directory = path.resolve(__dirname, "../");
    }

    // Add an @patternslib/patternslib alias when building within this repository.
    // That way, add-on packages referring to @patternslib/patternslib do work.
    if (process.env.BUILD_ENV === "patternslib") {
        config.resolve.alias["@patternslib/patternslib"] = path.resolve(
            __dirname,
            "../"
        );
    }

    //console.log(JSON.stringify(config, null, 4));

    return config;
};
