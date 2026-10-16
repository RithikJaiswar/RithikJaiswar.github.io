// Runs automatically before `npm run build` (npm "prebuild" hook).
// Some build environments run the build command without installing
// dependencies first; install them from the lockfile when they're missing.
import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const required = ['typescript', 'vite']
const missing = required.filter((pkg) => !existsSync(`node_modules/${pkg}/package.json`))

if (missing.length > 0) {
  console.log(`Missing dependencies (${missing.join(', ')}); running npm ci…`)
  execSync('npm ci --no-audit --no-fund --include=dev', { stdio: 'inherit' })
}
