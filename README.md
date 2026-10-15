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

The navbar pairs a placeholder lily flower logo with the active page name. Search filters orders, arrows paginate, the connected pull-down calendar bookmark offers preset periods and a custom range calendar with Apply/Cancel, and selected period lengths update the demo total, source chips toggle chart series, and the settings panel resets the demo. The funnel shows sample user counts, percentages of initial visitors, retention from each previous step, and overall conversion (24 / 1,000 = 2.4%). Lily AI opens a chat panel with local sample insights and suggested questions; it is not connected to a live AI model and messages are not transmitted. The date control uses the current reporting day in Africa/Casablanca. Presets include a rolling last 24 hours, yesterday, last calendar week (Monday–Sunday), last 7 days, this month, last month, and last 30 days. The Today’s summary carousel uses the current Casablanca reporting date and shows illustrative Orders, Visits, and Sign-ins slides. It supports faded neighboring previews, arrow controls, dot selection, keyboard arrows, and horizontal touch swipes. Its daily metrics remain fixed sample values independently of the selected reporting period; the period-based revenue insight uses a sample $340 per day, rather than historical backend data.

## Workspace navigation

The sidebar opens Orders, Campaigns, Analytics, Inbox, and Settings with hash-based routes and browser Back/Forward support. Analytics uses a pie-chart icon; Inbox uses a message icon. Campaign drafts and pause/resume controls, local conversation replies, and settings persist in this browser. No external messages, campaign launches, payment changes, or integration connections are performed.

Settings includes General, Team, Billing, Notifications, Integrations, and Security panels with classic raised tabs, keyboard navigation, and Apply/Cancel actions. Team additions update only the local demo list. The summary area chart has no outline and fades from solid green to transparent.


## Light-mode material

`light-surfaces.css` is the shared material layer: every surface uses `rgb(255 255 255 / 80%)`, a 2px solid white stroke, and one soft shadow. Nested surfaces repeat the same material, becoming naturally brighter through alpha compositing. New surface containers can use `white-layer`; structural wrappers stay transparent, dividers remain 1px, and primary gradient actions retain their accent. Dark mode keeps its separate material.
