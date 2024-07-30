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
		for(const replacement of replacements) {
			if(replacement.to === null) {
				goneMap += `\t${replacement.from} 1;\n`
			} else if (replacement.to !== undefined) {
				serverConfig += `from ^${replacement.from}$ ${replacement.to} permanent;\n`
			}
		}
		if(goneMap.length === 0) {
			return serverConfig;
		} else {
			return `
map $uri $is_gone {
\tdefault 0;
\t${goneMap.trim()}
}
...
server {
\tif ($is_gone) {
\t\treturn 410;
\t}
\t${serverConfig.trim().replace('\n', '\n\t')}
}
`
		}
	}
} satisfies OutputGenerator