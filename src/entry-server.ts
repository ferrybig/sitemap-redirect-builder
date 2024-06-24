import { renderToString } from 'react-dom/server'
import { createApp } from './main'

export async function render() {
  const { jsx } = createApp()

  const html = renderToString(jsx);

  return [html]
}
