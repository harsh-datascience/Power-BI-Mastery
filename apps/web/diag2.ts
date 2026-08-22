import { getAllDocMeta, getDocContent } from './src/lib/content'

const docs = getAllDocMeta()
console.log('--- slugs containing "toc" or "docfx" ---')
docs
  .filter((d) => d.slug.includes('toc') || d.slug.includes('docfx'))
  .forEach((d) => console.log('  ', d.slug))

console.log('')
const doc = getDocContent('m/table-selectrows')!
console.log('--- headings for m/table-selectrows ---')
console.log('  headings count:', doc.headings.length)
console.log('  content starts with:')
console.log(JSON.stringify(doc.content.slice(0, 200)))
console.log('')
console.log('  lines starting with #:')
doc.content
  .split('\n')
  .filter((l) => l.trim().startsWith('#'))
  .slice(0, 8)
  .forEach((l) => console.log('    ', JSON.stringify(l)))
