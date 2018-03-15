const fs = require('fs');
const babel = require('babel-core');

// Read the filename from the command line arguments
const fileName = process.argv[2];

// Read the code from this file
fs.readFile(fileName, function (err, data) {
    if (err) throw err;

    // Convert from a buffer to a string
    const src = data.toString();

    // Use our plugin to transform the source
    const out = babel.transform(src, {
        plugins: [['./index.js', {mappingsFile: './mappingsFile.js'}]]
    });

    // Print the generated code to screen
    console.log(out.code);
});
