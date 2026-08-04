import { mkdir, writeFile } from 'node:fs/promises'

const workerSource = `const htmlAcceptPattern = /text\\/html|application\\/xhtml\\+xml/

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404) {
      return response
    }

    const acceptsHtml = htmlAcceptPattern.test(request.headers.get('accept') || '')
    if (request.method === 'GET' && acceptsHtml) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', request.url)))
    }

    return response
  },
}
`

await mkdir('dist/server', { recursive: true })
await writeFile('dist/server/index.js', workerSource)
