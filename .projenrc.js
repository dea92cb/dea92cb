const { typescript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'liblab',
  minNodeVersion: '16.14.0',
  github: false,
  deps: ['cross-fetch'],
  packageName: '1885e1f' /* SHA256("liblab 11 June 2022") : nobody likes to pollute npm */,
});
project.synth();