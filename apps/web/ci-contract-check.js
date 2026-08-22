/**
 * CI CONTRACT CHECK
 *
 * The GitHub Actions workflow is a public integration boundary: if it
 * references a script that does not exist, every push fails. This parses
 * the workflow and verifies each `pnpm <script>` it runs is actually
 * defined in package.json.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', '..')
let fail = 0

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

const rootPkg = readJson(path.join(ROOT, 'package.json'))
const webPkg = readJson(path.join(ROOT, 'apps', 'web', 'package.json'))
const dbPkg = readJson(path.join(ROOT, 'packages', 'database', 'package.json'))

const rootScripts = new Set(Object.keys(rootPkg.scripts || {}))
const webScripts = new Set(Object.keys(webPkg.scripts || {}))
const dbScripts = new Set(Object.keys(dbPkg.scripts || {}))

console.log('=== CI CONTRACT :: workflow commands vs real scripts ===\n')

const workflowDir = path.join(ROOT, '.github', 'workflows')
const workflows = fs.existsSync(workflowDir)
  ? fs.readdirSync(workflowDir).filter((f) => f.endsWith('.yml'))
  : []

console.log(`Workflows found: ${workflows.join(', ') || 'none'}\n`)

for (const wf of workflows) {
  const text = fs.readFileSync(path.join(workflowDir, wf), 'utf-8')
  console.log(`--- ${wf} ---`)

  // Basic YAML sanity: must have on: and jobs:
  const hasOn = /^on:/m.test(text)
  const hasJobs = /^jobs:/m.test(text)
  if (!hasOn || !hasJobs) {
    console.log(`  FAIL: missing ${!hasOn ? '"on:"' : ''} ${!hasJobs ? '"jobs:"' : ''}`)
    fail++
  } else {
    console.log('  PASS: has on: and jobs:')
  }

  // Every `pnpm <script>` must resolve
  const runs = [...text.matchAll(/run:\s*(.+)/g)].map((m) => m[1].trim())
  const pnpmCalls = runs.filter((r) => /^pnpm\s/.test(r))

  for (const call of pnpmCalls) {
    // pnpm install / dlx / exec are built-ins
    if (/^pnpm (install|dlx|exec|add)\b/.test(call)) {
      console.log(`  PASS: ${call}  (pnpm builtin)`)
      continue
    }
    // pnpm --filter X run Y
    const filtered = call.match(/^pnpm --filter (\S+) run (\S+)/)
    if (filtered) {
      const [, pkg, script] = filtered
      const set = pkg === 'web' ? webScripts : pkg === 'database' ? dbScripts : null
      if (!set) {
        console.log(`  FAIL: unknown workspace "${pkg}" in: ${call}`)
        fail++
      } else if (!set.has(script)) {
        console.log(`  FAIL: script "${script}" not defined in ${pkg}/package.json`)
        fail++
      } else {
        console.log(`  PASS: ${call}`)
      }
      continue
    }
    // pnpm <script>
    const simple = call.match(/^pnpm ([\w:]+)$/)
    if (simple) {
      const script = simple[1]
      if (rootScripts.has(script)) {
        console.log(`  PASS: ${call}`)
      } else {
        console.log(`  FAIL: root script "${script}" is NOT in package.json`)
        fail++
      }
      continue
    }
    console.log(`  SKIP: ${call.slice(0, 60)}`)
  }
  console.log('')
}

// Dockerfile referenced scripts
console.log('--- docker/Dockerfile.web ---')
const dockerfile = path.join(ROOT, 'docker', 'Dockerfile.web')
if (fs.existsSync(dockerfile)) {
  const text = fs.readFileSync(dockerfile, 'utf-8')
  const calls = [...text.matchAll(/pnpm --filter (\S+) run (\S+)/g)]
  for (const [, pkg, script] of calls) {
    const set = pkg === 'web' ? webScripts : pkg === 'database' ? dbScripts : null
    if (!set || !set.has(script)) {
      console.log(`  FAIL: Dockerfile runs "${pkg} ${script}" which is not defined`)
      fail++
    } else {
      console.log(`  PASS: pnpm --filter ${pkg} run ${script}`)
    }
  }
  // CMD path sanity
  const cmd = text.match(/CMD\s+\[([^\]]+)\]/)
  console.log(`  CMD: ${cmd ? cmd[1] : 'none'}`)
} else {
  console.log('  FAIL: Dockerfile.web missing')
  fail++
}

// README documented commands
console.log('\n--- README quickstart commands ---')
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf-8')
const readmeCmds = [...readme.matchAll(/^(pnpm [\w:\- ]+)$/gm)].map((m) => m[1].trim())
const uniq = [...new Set(readmeCmds)]
for (const c of uniq) {
  if (/^pnpm (install|add|dlx|exec)\b/.test(c)) {
    console.log(`  PASS: ${c}  (builtin)`)
    continue
  }
  const m = c.match(/^pnpm ([\w:]+)$/)
  if (m) {
    if (rootScripts.has(m[1])) console.log(`  PASS: ${c}`)
    else {
      console.log(`  FAIL: README documents "${c}" but that script does not exist`)
      fail++
    }
  }
}

console.log('\n' + '='.repeat(60))
console.log(fail === 0 ? 'RESULT: PASS - CI/Docker/README contracts all valid' : `RESULT: FAIL - ${fail} problems`)
console.log('='.repeat(60))
process.exit(fail === 0 ? 0 : 1)
