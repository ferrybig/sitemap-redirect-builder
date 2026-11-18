import { OutputGenerator } from '../../types';
import src from './caddy-svgrepo-com.svg'

export default {
	name: 'Caddy',
	image: {
		src,
		pos: null,
	},
	generateOutput: replacements => {
		return replacements.flatMap(replacement => {
			if (replacement.to === null) return [`respond ${replacement.from} 410`];
			if (replacement.to === undefined) return [];
			return [`redir ${replacement.from} ${replacement.to} 301`];
		}).join('\n');
	}
} satisfies OutputGenerator