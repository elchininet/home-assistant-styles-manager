import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import tsConfigPaths from 'rollup-plugin-tsconfig-paths';
import terser from '@rollup/plugin-terser';

export default [
	{
		plugins: [
			typescript(),
			terser({
				output: {
					comments: false
				}
			})
		],
		input: 'src/index.ts',
		output: [
            {
                file: `dist/index.js`,
                format: 'cjs'
            },
            {
                file: `dist/esm/index.js`,
                format: 'es'
            }
        ]
	},
	{
		plugins: [
			tsConfigPaths(),
			dts()
		],
		input: 'src/index.ts',
		output: [
            {
                file: `dist/index.d.ts`,
                format: 'cjs'
            },
            {
                file: `dist/esm/index.d.ts`,
                format: 'es'
            }
        ]
	}
];