import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import contactLikes from './api/contact/likes.js'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), {
    name: 'local-contact-api',
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), '')
      for (const key of ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'CONTACT_RATE_LIMIT_SECRET']) {
        if (env[key]) process.env[key] = env[key]
      }
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/contact/likes') return next()
        // Locally there is no trusted Vercel proxy; use the socket address.
        delete req.headers['x-vercel-forwarded-for']
        res.status = code => { res.statusCode = code; return res }
        res.json = body => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
          return res
        }
        contactLikes(req, res).catch(next)
      })
    },
  }],
}))
