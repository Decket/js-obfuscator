// Require modules
var fs = require('fs');
var JSObfuscator = require('javascript-obfuscator');
var dateFormat = require('dateformat');
var now = new Date();
now = dateFormat(now, "dd-mm-yyyy_ss-MM-hh");

var config = {
    input_dir: './input/',
    output_dir: `${__dirname}/output/${now}/`
}

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
