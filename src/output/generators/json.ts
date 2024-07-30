import { OutputGenerator } from '../../types';
import src from './json-svgrepo-com.svg'

export default {
	name: 'Json (debug)',
	image: {
		src,
		pos: null
	},
	generateOutput: replacements => {
		return JSON.stringify(Object.fromEntries(replacements.map(e => [e.from, e.to])), null, 2);
	}
} satisfies OutputGenerator