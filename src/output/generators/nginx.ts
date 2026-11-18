import { OutputGenerator } from '../../types';
import image from './nginx-svgrepo-com.svg'

export default {
	name: 'Nginx',
	image: {
		src: image,
		pos: null
	},
	generateOutput: replacements => {
		let goneMap = '';
		let serverConfig = '';
		for (const replacement of replacements) {
			if (replacement.to === null) {
				goneMap += `\t${replacement.from} 1;\n`
			} else if (replacement.to !== undefined) {
				const from = replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				serverConfig += `rewrite ^${from}$ ${replacement.to} permanent;\n`
			}
		}
		if(goneMap.length === 0) {
			return serverConfig;
		} else {
			return `# Goes in the http {} context
map $uri $is_gone {
\tdefault 0;
\t${goneMap.trim()}
}

# Goes inside your existing server {} block
if ($is_gone) {
\treturn 410;
}
${serverConfig.trim()}
`
		}
	}
} satisfies OutputGenerator