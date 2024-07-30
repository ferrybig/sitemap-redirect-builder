import { OutputGenerator } from '../../types';
import src from './apache-svgrepo-com.svg'

function escapeInput(input: string) {
	return input;
}
function escapeOutput(input: string) {
	return input;
}

export default {
	name: 'Apache',
	image: {
		pos: null,
		src
	},
	generateOutput: replacements => {
		let config = '';
		for (const replacement of replacements) {
			if (replacement.to === null) {
				config += `RewriteRule ^${escapeInput(replacement.from)}$ - [G,L]\n`;
			} else if (replacement.to !== undefined) {
				config += `RewriteRule ^${escapeInput(replacement.from)}$ ${escapeOutput(replacement.from)} [R,L]`;
			}
		}
		return config;
	}
} satisfies OutputGenerator