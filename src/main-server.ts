import { renderToString } from 'react-dom/server'
import jsx from './main'

export async function render() {
	const html = renderToString(jsx);

	return [html]
}
