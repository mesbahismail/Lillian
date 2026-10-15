# Lillian — Glass Dashboard

A free shadcn/ui dashboard block recreating the supplied mint glass design. Built with React, TypeScript, Tailwind CSS 4, shadcn/ui (Base UI), and Lucide. The entire dashboard fits the viewport without page scrolling; narrow screens use a compact single-column layout.

## Run locally

```sh
npm install
npm run dev
```

## Install the free registry block

In a project initialized with shadcn/ui's **Base UI** components:

```sh
npx shadcn@latest add http://localhost:5173/r/lillian-dashboard.json
```

Import `LillianDashboard` from `@/components/lillian/lillian-dashboard` and render `<LillianDashboard />`. For a full-screen page, set `html`, `body`, and your application root to `height: 100%; margin: 0`. The included stylesheet prevents page scrolling.

The registry is served at `/r/registry.json`; the installable item is `/r/lillian-dashboard.json`. `registry.json` is the source manifest. `npm run registry:build` regenerates payloads from the actual component and stylesheet. `npm run build` regenerates the registry, type-checks, and creates `dist/` with both the demo and registry endpoints.

To publish, host `dist/` on a public static host and replace localhost in the install command with its origin. Set `REGISTRY_ORIGIN` to the public origin when building to populate the registry homepage. Public hosting and listing in the official shadcn directory are separate steps; this repository does not claim an official directory listing. See the [registry specification](https://ui.shadcn.com/docs/registry/registry-item-json) and [directory submission requirements](https://ui.shadcn.com/docs/registry/registry-index).

Search filters orders, arrows paginate, date ranges update the demo total, source chips toggle chart series, and the settings panel resets the demo. Support messages are local demonstration state and are not transmitted. Default values deliberately reproduce the reference, including its fixed `24 Oct` date, repeated orders, blank chart, and seven `MON` labels.
