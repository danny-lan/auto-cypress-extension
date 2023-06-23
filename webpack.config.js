const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        index: "./src/index.tsx",
        devtools: "./src/devtools/index.ts",
        panel: "./src/devtools/panel.tsx",
        content: "./src/content.js",
        inject: "./src/inject.js",
        contextMenu: './src/contextMenu.js'
    },
    devtool: "source-map",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }],
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ],
                exclude: /node_modules/
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "../manifest.json" },
            ],
        }),
        new CopyPlugin({
            patterns: [{ from: 'res', to: "../res" }],
        }),
        ...getHtmlPlugins(["index", "devtools", "panel"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", "*.png"],
        alias: {
            Res: path.resolve(__dirname, 'res/'),
        },
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: `React extension - ${chunk}`,
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}
