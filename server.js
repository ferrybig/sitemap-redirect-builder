// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const isTest = process.env.VITEST

export async function createServer(
	root = process.cwd(),
	isProd = process.env.NODE_ENV === 'production',
	hmrPort,
) {
	const __dirname = path.dirname(fileURLToPath(import.meta.url))
	const resolve = (p) => path.resolve(__dirname, p)

	const indexProd = isProd
		? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
		: ''

	const app = express()

	/**
   * @type {import('vite').ViteDevServer | null}
   */
	let vite
	if (!isProd) {
		vite = await (
			await import('vite')
		).createServer({
			base: '/',
			root,
			logLevel: isTest ? 'error' : 'info',
			server: {
				middlewareMode: true,
				watch: {
					// During tests we edit the files too fast and sometimes chokidar
					// misses change events, so enforce polling for consistency
					usePolling: false,
					interval: 100,
				},
				hmr: {
					port: hmrPort,
				},
			},
			appType: 'custom',
		})
		// use vite's connect instance as middleware
		app.use(vite.middlewares)
	} else {
		vite = null;
		app.use((await import('compression')).default())
		app.use(
			'/',
			(await import('serve-static')).default(resolve('dist/client'), {
				index: false,
			}),
		)
	}

	app.use('/', async (req, res) => {
		try {
			const url = '/';

			let template, render
			if (!isProd && vite) {
				// always read fresh template in dev
				template = fs.readFileSync(resolve('index.html'), 'utf-8')
				template = await vite.transformIndexHtml(url, template)
				render = (await vite.ssrLoadModule('/src/main-server.ts')).render
			} else {
				template = indexProd
				render = (await import('./dist/server/main-server.js')).render
			}

			const [appHtml] = await render(url)

			const html = template
				.replace('<!--app-html-->', appHtml)

			res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
		} catch (e) {
			vite && vite.ssrFixStacktrace(e)
			console.log(e.stack)
			res.status(500).end(e.stack)
		}
	})

	return { app, vite }
}

if (!isTest) {
	createServer().then(({ app }) =>
		app.listen(6173, () => {
			console.log('http://localhost:6173')
		}),
	)
}