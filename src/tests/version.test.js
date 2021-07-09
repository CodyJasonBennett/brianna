import version from 'commands/version';

describe('commands/version', () => {
  it('outputs version number', () => {
    let output;
    console.info = console.error = args => (output = args);

    version.run();

    expect(output).toMatch(/\d+.\d+.\d+/);
  });
});
