const fs = require('fs');
const path = require('path');

require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
    const files = {};

    function readDirectory(directory) {
        fs.readdirSync(directory).forEach((file) => {
            const fullPath = path.resolve(directory, file);

            if (fs.statSync(fullPath).isDirectory()) {
                if (scanSubDirectories) readDirectory(fullPath);

                return;
            }

            if (!regularExpression.test(fullPath)) return;

            files[fullPath] = true;
        });
    }

    readDirectory(path.resolve(__dirname, base));

    function Module(file) {
        return require(file);
    }

    Module.keys = () => Object.keys(files);

    return Module;
}

var context = require.context("../", true, /\.js$/);
var obj = {};

context && context.keys().forEach(function (key) {
    obj[key] = context(key);
});

return obj;
