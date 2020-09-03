// Require modules
var fs = require('fs');
var JSObfuscator = require('javascript-obfuscator');
var dateFormat = require('dateformat');
var path = require('path');
var async = require('async');
var now = new Date();
now = dateFormat(now, "dd-mm-yyyy_ss-MM-hh");

var config = {
    input_dir: './input/',
    output_dir: `${__dirname}/output/${now}/`
}

function getFiles (dirPath, callback) {

    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);

        var filePaths = [];
        async.eachSeries(files, function (fileName, eachCallback) {
            var filePath = path.join(dirPath, fileName);

            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                    getFiles(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });

                } else {
                    if (stat.isFile() && /\.js$/.test(filePath)) {
                        filePaths.push(filePath);
                    }

                    eachCallback(null);
                }
            });
        }, function (err) {
            callback(err, filePaths);
        });

    });
}


getFiles(config.input_dir, function (err, jsfile) {
    if (err) return console.log(err);
    if(jsfile.length <= 0) return console.warn("Файлы не найдены!");

    jsfile.forEach((f, i) => {
        fs.readFile(__dirname + '/' + f, "UTF-8", (err, data) => {
            if(err) throw err;

            f_ = f.split('\\').splice(1, 5000);
            delete f_[f_.length-1];
            f_ = f_.join('\\');
            
            fs.mkdir(config.output_dir + '/' + f_, {recursive: true}, (err) => {
                if(err) return console.log(err);

                var Result = JSObfuscator.obfuscate(data,
                            {
                                compact: false,
                                controlFlowFlattening: true,
                                numbersToExpressions: true,
                                simplify: true,
                                shuffleStringArray: true,
                                splitStrings: true
                            });
                f = f.split('\\').splice(1, 5000).join('\\');
                fs.writeFile(config.output_dir + f, Result.getObfuscatedCode(), (err) => {
                    if(err) return console.log(err);
                    console.log(`File was saved! ${config.output_dir + f}`)
                });
            });
        });
    });
});


/*
fs.readdir(config.input_dir, (err, files) => {
    if(err) return console.error(err);
  
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.warn("Файлы не найдены!");
      return;
    }

    jsfile.forEach((f, i) => {
        fs.readFile(config.input_dir + f, "UTF-8", (err, data) => {
            if(err) throw err;
            
            fs.mkdir(config.output_dir, {recursive: true}, (err) => {
                if(err) return console.log(err);

                var Result = JSObfuscator.obfuscate(data,
                    {
                        compact: false,
                        controlFlowFlattening: true,
                        numbersToExpressions: true,
                        simplify: true,
                        shuffleStringArray: true,
                        splitStrings: true
                    });

                fs.writeFile(config.output_dir + f, Result.getObfuscatedCode(), (err) => {
                    if(err) return console.log(err);
                    console.log(`File was saved! ${config.output_dir + f}`)
                });
            });
        });
    });
  
});
*/