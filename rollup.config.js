import typescript from 'rollup-plugin-ts';
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
	}
];