import { mkdir, readFile, writeFile } from 'node:fs/promises'

const indexHtml = await readFile('dist/index.html', 'utf8')
const workerSource = `const htmlAcceptPattern = /text\\/html|application\\/xhtml\\+xml/
const indexHtml = ${JSON.stringify(indexHtml)}

export default {
  async fetch(request, env) {
    const acceptsHtml = htmlAcceptPattern.test(request.headers.get('accept') || '')
    const url = new URL(request.url)

    if (request.method === 'GET' && (url.pathname === '/' || acceptsHtml)) {
      return new Response(indexHtml, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, max-age=0, must-revalidate',
        },
      })
    }

    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404) {
      return response
    }

    return response
  },
}
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', workerSource)
