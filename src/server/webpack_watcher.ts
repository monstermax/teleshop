
import webpack from "webpack";


const webpackConfig = require("../../webpack.config.js");
const compiler = webpack(webpackConfig);


compiler.watch({}, (err, stats) => {
    if (err) {
        console.error("Webpack error:", err);
        return;
    }

    console.log(stats?.toString({ colors: true }));
});


process.on("SIGINT", () => {
    console.log("Stopping Webpack...");

    compiler.close(() => {
        console.log("Webpack stopped.");
        process.exit();
    });
});
