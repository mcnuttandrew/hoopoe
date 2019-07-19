const tape = require('tape');
const {
  getFile,
  writeFile,
  sleep,
  executeCommandLineCmd,
  executePromisesInSeries
} = require('../');
const testFile = require('./test-file.json');


tape('#getFile knownFile', t => {
  getFile('./tests/test-file.json')
    .then(JSON.parse)
    .then(d => {
      t.deepEqual(d, testFile, 'should correctly find known file');
      t.end();
    });
});

tape('#getFile non-extant file and then #writeFile to make it exists', t => {
  let msg = '';
  const expectedError = '{"errno":-2,"code":"ENOENT","syscall":"open","path":"./tests/fake-file.json"}';
  const shouldNotFindFakeFile = () => {
    msg = '';
    return getFile('./tests/fake-file.json')
    .catch(e => {
      msg = JSON.stringify(e);
    })
    .then(() => t.deepEqual(msg, expectedError, 'should find that an error was thrown as expected'));
  };
  Promise.resolve()
    .then(() => shouldNotFindFakeFile())
    .then(() => writeFile('./tests/fake-file.json', 'Hi mom'))
    .then(() => getFile('./tests/fake-file.json'))
    .then(foundFile => t.deepEqual(foundFile, 'Hi mom', 'should find the fake file correctly formed'))
    .then(() => executeCommandLineCmd('rm ./tests/fake-file.json'))
    .then(shouldNotFindFakeFile())
    .then(() => writeFile('./test/fake-file.json', 'Hi mom'))
    .catch(e => {
      msg = e.toString();
    })
    .then(() => t.equal(msg,
      'Error: ENOENT: no such file or directory, open \'./test/fake-file.json\'',
      'caught error should be correct'))
    .then(() => t.end());
});


tape('#executeCommandLineCmd & #executePromisesInSeries', t => {
  Promise.all([
    () => executeCommandLineCmd('ls tests')
      .then(({stdout, stderr}) => {
        t.deepEqual(stdout, 'test-file.json\ntests.js\n', 'should find a out');
        t.deepEqual(stderr, '', 'should find no std error');
      }),
    () => executePromisesInSeries([
      () => executeCommandLineCmd('mkdir test-folder'),
      () => executeCommandLineCmd('touch test-folder/test-file.json'),
      () => executeCommandLineCmd('ls test-folder')
        .then(({stdout}) => {
          t.deepEqual(stdout, 'test-file.json\n', ' should find the newly created folder and file correctly');
        }),
      () => executeCommandLineCmd('rm -rf test-folder')
        .then(({stdout}) => {
          t.deepEqual(stdout, '', ' should find the folder now deleted');
        })
    ]),
    () => {
      let msg = "";
      return executeCommandLineCmd('smooshsmashsmash')
      .catch(e => {
        msg = e.toString();
      })
      .then(() => t.equal(
        'Error: Command failed: smooshsmashsmash\n/bin/sh: smooshsmashsmash: command not found\n',
        msg, 'should find correct error message'));
    }

  ].map(test => Promise.resolve().then(test)))
  .then(() => t.end());
});

tape('#sleep pass through', t => {
  Promise.resolve()
  .then(() => [1, 2, 3])
  .then(sleep(30))
  .then(x => t.deepEqual(x, [1, 2, 3], 'should find the pass through worked correctly'))
  .then(() => t.end());
});

tape('#sleep async', t => {
  let order = [];
  Promise.all([
    Promise.resolve().then(sleep(100)).then(() => order.push('A')),
    Promise.resolve().then(sleep(50)).then(() => order.push('B')),
    Promise.resolve().then(sleep(120)).then(() => order.push('C')),
  ]).then(() => {
    t.deepEqual(order, ['B', 'A', 'C'], 'should find the order of sleeps is correct');
  })
  .then(() => t.end());
});
