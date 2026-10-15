import { readFile, mkdir, writeFile } from 'node:fs/promises'

const files = [
  { path: 'src/components/lillian/lillian-dashboard.tsx', type: 'registry:component', target: 'components/lillian/lillian-dashboard.tsx' },
  { path: 'src/components/lillian/lillian-dashboard.css', type: 'registry:file', target: 'components/lillian/lillian-dashboard.css' },
]
const item = {
  name: 'lillian-dashboard',
  type: 'registry:block',
  title: 'Lillian — Glass Dashboard',
  description: 'Free dashboard block with mint glass cards, orders, funnel, and acquisition sources. Responsive, viewport-fitting, and built with shadcn/ui Base UI components.',
  dependencies: ['lucide-react'],
  registryDependencies: ['button', 'card', 'input', 'dropdown-menu'],
  meta: { categories: ['dashboard', 'freebie'], price: 'free', uiBase: 'base' },
  files,
}
const registry = { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'lillian', homepage: process.env.REGISTRY_ORIGIN || 'http://localhost:5173', items: [item] }
await mkdir('public/r', { recursive: true })
await writeFile('registry.json', JSON.stringify(registry, null, 2) + '\n')
const payload = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item, files: await Promise.all(files.map(async file => ({ ...file, content: await readFile(file.path, 'utf8') }))) }
await writeFile('public/r/lillian-dashboard.json', JSON.stringify(payload, null, 2) + '\n')
await writeFile('public/r/registry.json', JSON.stringify({ ...registry, items: [payload] }, null, 2) + '\n')
console.log('Built registry: public/r/lillian-dashboard.json and public/r/registry.json')
