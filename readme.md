# Small bird of promise

This library collects a number of utility functions that I persistently find myself using across different projects. It is here to reduce copy pasta. I don't guarantee that it will be in anyway useful to you or better than a similar promise library.

Each of the commands in this library is a promise.

Requirements: node with access to fs and child_process. I believe this means node v>4, but I am not 100% sure. It will not work in the browser.

### executeCommandLineCmd(cmd)

Executes a string of command

### getFile(fileName)

Get a target file

### writeFile(fileName, contents)

Write file contents to target file name

### sleep(sleepTime)

Can be used to sleep a promise, useful for lots of things. Example usage

```
Promise.resolve()
  .then(sleep(30))
  .then(() => console.log('i did the sleep!'))
```

### executePromisesInSeries([() => Promise])

Execute an array of promises in series. Similar, but different and worse than, Promise.all().
