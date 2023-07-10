module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            components: './src/components',
            // '@assets': './assets',
          },
        },
      ],
    ],
  };
};
