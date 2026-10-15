import { readFile, mkdir, writeFile } from 'node:fs/promises'

const files = [
  { path: 'src/components/lillian/orders-page.tsx', type: 'registry:component', target: 'components/lillian/orders-page.tsx' },
  { path: 'src/components/lillian/orders-page.css', type: 'registry:file', target: 'components/lillian/orders-page.css' },
  { path: 'src/components/lillian/orders-data.ts', type: 'registry:lib', target: 'components/lillian/orders-data.ts' },
  { path: 'src/components/lillian/analytics-charts.tsx', type: 'registry:component', target: 'components/lillian/analytics-charts.tsx' },
  { path: 'src/components/lillian/analytics-charts.css', type: 'registry:file', target: 'components/lillian/analytics-charts.css' },
  { path: 'src/components/lillian/light-surfaces.css', type: 'registry:file', target: 'components/lillian/light-surfaces.css' },
  { path: 'src/components/lillian/profile-tools.tsx', type: 'registry:component', target: 'components/lillian/profile-tools.tsx' },
  { path: 'src/components/lillian/workspace-pages.tsx', type: 'registry:component', target: 'components/lillian/workspace-pages.tsx' },
  { path: 'src/components/lillian/workspace-pages.css', type: 'registry:file', target: 'components/lillian/workspace-pages.css' },
  { path: 'src/components/lillian/sources-chart.tsx', type: 'registry:component', target: 'components/lillian/sources-chart.tsx' },
  { path: 'src/components/lillian/chart-data.ts', type: 'registry:lib', target: 'components/lillian/chart-data.ts' },
  { path: 'src/components/lillian/widget-details.tsx', type: 'registry:component', target: 'components/lillian/widget-details.tsx' },
  { path: 'src/components/lillian/chart-grid.tsx', type: 'registry:component', target: 'components/lillian/chart-grid.tsx' },
  { path: 'src/components/lillian/today-summary.tsx', type: 'registry:component', target: 'components/lillian/today-summary.tsx' },
  { path: 'src/components/lillian/date-range-drawer.tsx', type: 'registry:component', target: 'components/lillian/date-range-drawer.tsx' },
  { path: 'src/components/lillian/date-range-drawer.css', type: 'registry:file', target: 'components/lillian/date-range-drawer.css' },
  { path: 'src/components/lillian/reporting-period.ts', type: 'registry:lib', target: 'components/lillian/reporting-period.ts' },
  { path: 'src/components/lillian/lillian-dashboard.tsx', type: 'registry:component', target: 'components/lillian/lillian-dashboard.tsx' },
  { path: 'src/components/lillian/lillian-dashboard.css', type: 'registry:file', target: 'components/lillian/lillian-dashboard.css' },
]
const item = {
  name: 'lillian-dashboard',
  type: 'registry:block',
  title: 'Lillian — Glass Dashboard',
  description: 'Free dashboard block with mint glass cards, orders, funnel, and acquisition sources. Responsive, viewport-fitting, and built with shadcn/ui Base UI components.',
  dependencies: ['lucide-react', '@fontsource/poppins', '@base-ui/react', 'react-day-picker@^9'],
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
