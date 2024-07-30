import { OutputGenerator } from '../../types';
import src from './caddy-svgrepo-com.svg'

export default {
	name: 'Caddy',
	image: {
		src,
		pos: null,
	},
	generateOutput: replacements => {
		return replacements.map(replacement => replacement.to !== null ? `rewrite ${replacement.from} ${replacement.to}` : `# 410: ${replacement.from}`).join('\n');
	}
} satisfies OutputGenerator