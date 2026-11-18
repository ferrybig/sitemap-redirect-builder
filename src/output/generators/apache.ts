import { OutputGenerator } from '../../types';
import src from './apache-svgrepo-com.svg'

function escapeInput(input: string) {
	// Regex-escape, and strip the leading slash: in .htaccess the pattern
	// is matched against the path without it
	return input.replace(/^\//, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function escapeOutput(input: string) {
	// $N and %{VAR} are expanded in the substitution
	return input.replace(/[$%\\]/g, '\\$&');
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
				config += `RewriteRule ^${escapeInput(replacement.from)}$ ${escapeOutput(replacement.to)} [R=301,L]\n`;
			}
		}
		return config.length === 0 ? '' : `RewriteEngine On\n${config}`;
	}
} satisfies OutputGenerator