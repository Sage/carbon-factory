module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'IE 11'
        },
        corejs: 3,
        useBuiltIns: 'usage'
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-regenerator'
  ]
};
