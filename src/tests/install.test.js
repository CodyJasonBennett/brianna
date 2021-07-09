import install from 'commands/install';

describe('commands/install', () => {
  it('outputs version number', () => {
    let output;
    console.info = console.error = args => (output = args);

    install.run();

    expect(output).toBeDefined();
  });
});
