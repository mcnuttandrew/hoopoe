const fs = require("fs");
const { exec } = require("child_process");

function executeCommandLineCmd(
  cmd: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(cmd, (err: string, stdout: string, stderr: string) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const getFile = (fileName: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err: string, data: string) => {
      if (err) {
        console.log("READ FILE ERROR", fileName);
        reject(err);
        return;
      }
      resolve(data);
    });
  });

const getFileNamesFromDir = (dir: string): Promise<string[]> =>
  executeCommandLineCmd(`ls ${dir}`).then(({ stdout, stderr }) => {
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout.split("\n").filter((d) => d.length);
  });

const writeFile = (fileName: string, contents: string): Promise<void> =>
  new Promise((resolve, reject) => {
    fs.writeFile(fileName, contents, (err: string) => {
      if (err) {
        console.log("WRITE FILE ERROR", fileName);
        reject(err);
        return;
      }
      resolve();
    });
  });

const sleep: (x: number) => (arg: any[]) => Promise<any> = (sleepTime) => (
  ...args
) => new Promise((resolve) => setTimeout(() => resolve(...args), sleepTime));

function executePromisesInSeries(tasks: (() => Promise<any>)[]) {
  return tasks.reduce(
    (promiseChain, task) => promiseChain.then(task),
    Promise.resolve([])
  );
}

module.exports = {
  executeCommandLineCmd,
  executePromisesInSeries,
  getFile,
  getFileNamesFromDir,
  sleep,
  writeFile,
};
