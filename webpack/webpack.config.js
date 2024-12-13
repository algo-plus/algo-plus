import { DefinePlugin } from 'webpack';
import { config } from 'dotenv';
import { resolve } from 'path';

const env = config().parsed;

export const entry = './src/main.js';
export const output = {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
};
export const plugins = [
    new DefinePlugin({
        'process.env': JSON.stringify(env),
    }),
];
