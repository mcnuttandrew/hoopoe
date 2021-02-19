declare const fs: any;
declare const exec: any;
/**
 * Execute a bash command
 * @param cmd - command to execute
 */
declare function executeCommandLineCmd(cmd: string): Promise<{
    stdout: string;
    stderr: string;
}>;
/**
 * Get a file (as a string)
 * @param fileName - the file name to get
 */
declare const getFile: (fileName: string) => Promise<string>;
declare const getFileNamesFromDir: (dir: string) => Promise<string[]>;
declare const writeFile: (fileName: string, contents: string) => Promise<void>;
declare const sleep: (x: number) => (arg: any[]) => Promise<any>;
declare function executePromisesInSeries(tasks: (() => Promise<any>)[]): Promise<any>;
