const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const binDir = path.join(__dirname, '../node_modules/.bin');
const uglifyJs = require('uglify-js');

start_build();
function start_build() {
    print_warn('[Build Service]: Building .ts files...');
    const tscProcess = childProcess.spawn(path.join(binDir, 'tsc'), ['--outDir', './build' , '-d', 'false', '--sourceMap', 'false'] , {
        cwd: path.join(__dirname, '..')
    });
    tscProcess.stdout.on('data', (chunk) => {
        print_error(chunk.toString());
    });
    tscProcess.stderr.on('data', (chunk) => {
        print_error(chunk.toString());
    });
    tscProcess.on('exit', (code) => {
        if(code === 0) {
            print_warn('[Build Service]: Build files done.');
            print_warn('[Build Service]: Starting Confusion JavaScript code...');
            ConfusionJavaScript(path.join(__dirname, '..' , 'build'));
        }
    });
}

function ConfusionJavaScript(dir) {
    const jsFile = mapJsDirFiles(dir);
    let totalSize = 0;
    jsFile.forEach((jsPath) => {
        try {
            const codeStr = fs.readFileSync(jsPath).toString();
            const js = uglifyJs.minify(codeStr,{
                annotations: false,
                toplevel: true,
                module: true,
                v8: true,
                mangle: {
                    toplevel: true,
                    v8: true
                },
                compress: {
                    module: true,
                    global_defs: {
                        // '@console.log': 'alert'
                    },
                    passes: 2
                }
            });
            fs.writeFileSync(jsPath, js.code);
            totalSize += js.code.length;
            print_warn('[Build Service]: Confusion Output -> ' + jsPath + ' -> Old size:' + codeStr.length + ' - New size:' + js.code.length);
        } catch (e) {
            print_error(e.stack);
        }

    });
    print_warn('[Build Service]: success... total size:' + (totalSize / 1024).toFixed(2) + 'kb');
    print_warn('[Build Service]: Launch command: node '+ dir +'/drink.js');
}

function mapJsDirFiles(path_) {
    const list = [];
    if(fs.existsSync(path_)) {
        const stat = fs.statSync(path_);
        if(stat.isDirectory()) {
            fs.readdirSync(path_).forEach((name) => {
                const filePath = path.join(path_, name);
                const statFile = fs.statSync(filePath);
                if(statFile.isDirectory()) {
                    list.push(...mapJsDirFiles(filePath));
                } else {
                    if(path.extname(filePath).toLowerCase() === '.js')
                        list.push(filePath);
                }
            });
        } else {
            list.push(path_);
        }
    }
    return list;
}

function print_warn(msg) {
    console.log('\x1B[33m' + msg + '\x1B[39m');
}

function print_error(msg) {
    console.log('\x1B[31m' + msg + '\x1B[39m');
}
