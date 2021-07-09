import help from 'commands/help';

describe('commands/help', () => {
  it('displays info with no arguments', () => {
    let output;
    console.info = console.error = args => (output = args);

    help.run();

    expect(output).toMatchSnapshot();
  });

  it('displays command info', () => {
    let output;
    console.info = console.error = args => (output = args);

    help.run(null, 'install');

    expect(output).toMatchSnapshot();
  });
});
