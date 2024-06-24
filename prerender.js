import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const toAbsolute = (p) => path.resolve(__dirname, p)

const { render } = await import('./dist/server/entry-server.js')

;(async () => {

	fs.mkdirSync("dist/static", {recursive: true});
	fs.cpSync("dist/client/", "dist/static/", {recursive: true});
	const template = fs.readFileSync(toAbsolute('dist/static/index.html'), 'utf-8')
	let url = '';
	const [appHtml] = await render(url)

	const html = template
		.replace(`<!--app-html-->`, appHtml)

	const filePath = `dist/static/index.html`
	fs.writeFileSync(toAbsolute(filePath), html)
	console.log(`prerendered: ${filePath}`)
})()