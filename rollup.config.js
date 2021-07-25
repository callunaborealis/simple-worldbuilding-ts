import json from '@rollup/plugin-json';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss-modules';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/module/simple.ts',
  output: {
    file: 'build/simple.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    postcss({
      extract: true,
      modules: {
        generateScopedName: 'worldbuilding__[name]__[local]--[hash:base64:5]',
      },
      minimize: true,
      plugins: [autoprefixer()],
      writeDefinitions: false, // Writing automatic definitions will freeze up the rollup build
    }),
    json(),
    typescript(),
  ],
};
