var fs = require("fs");
var exec = require("child_process").exec;
/**
 * Execute a bash command
 * @param cmd - command to execute
 */
function executeCommandLineCmd(cmd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }
            else {
                resolve({ stdout: stdout, stderr: stderr });
            }
        });
    });
}
/**
 * Get a file (as a string)
 * @param fileName - the file name to get
 */
var getFile = function (fileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileName, "utf8", function (err, data) {
            if (err) {
                console.log("READ FILE ERROR", fileName);
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};
var getFileNamesFromDir = function (dir) {
    return executeCommandLineCmd("ls " + dir).then(function (_a) {
        var stdout = _a.stdout, stderr = _a.stderr;
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout.split("\n").filter(function (d) { return d.length; });
    });
};
var writeFile = function (fileName, contents) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(fileName, contents, function (err) {
            if (err) {
                console.log("WRITE FILE ERROR", fileName);
                reject(err);
                return;
            }
            resolve();
        });
    });
};
var sleep = function (sleepTime) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Promise(function (resolve) { return setTimeout(function () { return resolve.apply(void 0, args); }, sleepTime); });
}; };
function executePromisesInSeries(tasks) {
    return tasks.reduce(function (promiseChain, task) { return promiseChain.then(task); }, Promise.resolve([]));
}
module.exports = {
    executeCommandLineCmd: executeCommandLineCmd,
    executePromisesInSeries: executePromisesInSeries,
    getFile: getFile,
    getFileNamesFromDir: getFileNamesFromDir,
    sleep: sleep,
    writeFile: writeFile
};
