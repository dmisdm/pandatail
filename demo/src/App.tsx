import type { ReactNode } from "react";
import { css, cva, cx } from "../styled-system/css";
import {
  tw,
  VStack,
  HStack,
  Center,
  Grid,
  Stack,
} from "../styled-system/jsx";

/* -------------------------------------------------------------------------- */
/*  Side-by-side comparison primitive                                          */
/* -------------------------------------------------------------------------- */

function SideBySide({
  title,
  description,
  tailwindSource,
  pandaSource,
  tailwind,
  panda,
}: {
  title: string;
  description?: string;
  tailwindSource: string;
  pandaSource: string;
  tailwind: ReactNode;
  panda: ReactNode;
}) {
  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Pane label="Tailwind" tagline="className=…" source={tailwindSource}>
            {tailwind}
          </Pane>
          <Pane label="Panda" tagline="<tw.div …/>" source={pandaSource}>
            {panda}
          </Pane>
        </div>
      </div>
    </section>
  );
}

function Pane({
  label,
  tagline,
  source,
  children,
}: {
  label: string;
  tagline: string;
  source: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-[10px] tracking-normal text-zinc-400">
          {tagline}
        </span>
      </div>
      <div className="flex min-h-[200px] items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-900/40">
        {children}
      </div>
      <pre className="overflow-x-auto border-t border-zinc-200 bg-zinc-950 px-4 py-3 text-[12px] leading-5 text-zinc-200 dark:border-zinc-800">
        <code>{source}</code>
      </pre>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      <Nav />
      <Hero />
      <Comparisons />
      <GettingStarted />
      <ShorthandProposal />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-brand-500" />
          <span className="font-semibold tracking-tight">pandatail</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="#docs" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            Docs
          </a>
          <a href="#github" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            GitHub
          </a>
          <a
            href="#install"
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get started
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.62_0.21_260/0.35),transparent)]"
      />
      <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          v0.1 — built on Tailwind v4 + Panda v1
        </span>
        <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-6xl">
          The best DX and type-safety
          <br />
          your Tailwind has ever seen.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-7 text-zinc-600 dark:text-zinc-400">
          A PandaCSS preset that mirrors every token in your Tailwind v4{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
            @theme
          </code>{" "}
          — write JSX that reads like Tailwind, with Panda's typed recipes and
          zero-runtime CSS underneath. One source of truth.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#install"
            className="rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600"
          >
            Install the preset
          </a>
          <a
            href="#compare"
            className="rounded-md border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            See the parity tests ↓
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Comparison sections — Tailwind className=… vs Panda <tw.…/>                */
/* -------------------------------------------------------------------------- */

function Comparisons() {
  return (
    <div id="compare">
      <ProConSummary />

      <SideBySide
        title="Default color palette"
        description="Tailwind's defaults flow through the preset untouched. blue.500 means blue.500."
        tailwindSource={`<div className="rounded-lg bg-blue-500 p-6 text-white">
  blue-500
</div>`}
        pandaSource={`<tw.div rounded="lg" bg="blue.500" p={6} color="white">
  blue.500
</tw.div>`}
        tailwind={
          <div className="rounded-lg bg-blue-500 p-6 font-medium text-white">
            blue-500
          </div>
        }
        panda={
          <tw.div
            rounded="lg"
            bg="blue.500"
            p={6}
            color="white"
            fontWeight="medium"
          >
            blue.500
          </tw.div>
        }
      />

      <SideBySide
        title="Custom @theme tokens — space-y matches Tailwind exactly"
        description="The brand-* palette comes from tailwind.css. spaceY emits the same `& > * + *` selector as Tailwind's space-y-*, not a flexbox+gap approximation."
        tailwindSource={`<div className="space-y-2">
  <div className="h-10 rounded-md bg-brand-300" />
  <div className="h-10 rounded-md bg-brand-500" />
  <div className="h-10 rounded-md bg-brand-700" />
  <div className="h-10 rounded-md bg-brand-900" />
</div>`}
        pandaSource={`<tw.div spaceY={2}>
  <tw.div h={10} rounded="md" bg="brand.300" />
  <tw.div h={10} rounded="md" bg="brand.500" />
  <tw.div h={10} rounded="md" bg="brand.700" />
  <tw.div h={10} rounded="md" bg="brand.900" />
</tw.div>`}
        tailwind={
          <div className="w-full space-y-2">
            <div className="h-10 rounded-md bg-brand-300" />
            <div className="h-10 rounded-md bg-brand-500" />
            <div className="h-10 rounded-md bg-brand-700" />
            <div className="h-10 rounded-md bg-brand-900" />
          </div>
        }
        panda={
          <tw.div w="full" spaceY={2}>
            <tw.div h={10} rounded="md" bg="brand.300" />
            <tw.div h={10} rounded="md" bg="brand.500" />
            <tw.div h={10} rounded="md" bg="brand.700" />
            <tw.div h={10} rounded="md" bg="brand.900" />
          </tw.div>
        }
      />

      <SideBySide
        title="Typography scale — leading / tracking aliases"
        description="Custom Panda utilities give us Tailwind's own keywords: leading=lineHeight, tracking=letterSpacing. `text` is left alone — too easy to misread as font-size for someone coming from Tailwind."
        tailwindSource={`<div className="space-y-1">
  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
    Eyebrow
  </p>
  <h3 className="text-3xl font-semibold leading-tight tracking-tight">
    Headline
  </h3>
  <p className="text-base leading-relaxed text-zinc-600">
    Body copy
  </p>
</div>`}
        pandaSource={`<tw.div spaceY={1}>
  <tw.p fontSize="xs" fontWeight="medium" tracking="wide"
    textTransform="uppercase" color="zinc.500">
    Eyebrow
  </tw.p>
  <tw.h3 fontSize="3xl" fontWeight="semibold"
    tracking="tight" leading="tight">
    Headline
  </tw.h3>
  <tw.p fontSize="base" leading="relaxed" color="zinc.600">
    Body copy
  </tw.p>
</tw.div>`}
        tailwind={
          <div className="space-y-1 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Eyebrow
            </p>
            <h3 className="text-3xl font-semibold leading-tight tracking-tight">
              Headline
            </h3>
            <p className="text-base leading-relaxed text-zinc-600">Body copy</p>
          </div>
        }
        panda={
          <tw.div spaceY={1} textAlign="left">
            <tw.p
              fontSize="xs"
              fontWeight="medium"
              tracking="wide"
              textTransform="uppercase"
              color="zinc.500"
            >
              Eyebrow
            </tw.p>
            <tw.h3
              fontSize="3xl"
              fontWeight="semibold"
              tracking="tight"
              leading="tight"
            >
              Headline
            </tw.h3>
            <tw.p fontSize="base" leading="relaxed" color="zinc.600">
              Body copy
            </tw.p>
          </tw.div>
        }
      />

      <SideBySide
        title="Radii & shadows"
        description="--radius-* and --shadow-* land in Panda's radii / shadows categories. The custom --radius-pill from @theme is typed too."
        tailwindSource={`<div className="flex gap-3">
  <div className="h-16 w-16 rounded-md bg-white shadow-sm" />
  <div className="h-16 w-16 rounded-lg bg-white shadow-md" />
  <div className="h-16 w-16 rounded-xl bg-white shadow-lg" />
  <div className="h-16 w-16 rounded-pill bg-white shadow-xl" />
</div>`}
        pandaSource={`<tw.div display="flex" gap={3}>
  <tw.div h={16} w={16} bg="white" rounded="md" shadow="sm" />
  <tw.div h={16} w={16} bg="white" rounded="lg" shadow="md" />
  <tw.div h={16} w={16} bg="white" rounded="xl" shadow="lg" />
  <tw.div h={16} w={16} bg="white" rounded="pill" shadow="xl" />
</tw.div>`}
        tailwind={
          <div className="flex gap-3">
            <div className="h-16 w-16 rounded-md bg-white shadow-sm" />
            <div className="h-16 w-16 rounded-lg bg-white shadow-md" />
            <div className="h-16 w-16 rounded-xl bg-white shadow-lg" />
            <div className="h-16 w-16 rounded-pill bg-white shadow-xl" />
          </div>
        }
        panda={
          <tw.div display="flex" gap={3}>
            <tw.div h={16} w={16} bg="white" rounded="md" shadow="sm" />
            <tw.div h={16} w={16} bg="white" rounded="lg" shadow="md" />
            <tw.div h={16} w={16} bg="white" rounded="xl" shadow="lg" />
            <tw.div h={16} w={16} bg="white" rounded="pill" shadow="xl" />
          </tw.div>
        }
      />

      <SideBySide
        title="No escape hatch to style={{ }}"
        description="Tailwind's class names can't be built from runtime variables, so a varying size sends you out to inline `style`. Panda accepts the value as a typed prop — `h={16}` is the same kind of expression you'd write for any other JSX number. (Caveat: Panda's static analyser sees literal values, not anything resolved at runtime — see https://panda-css.com/docs/guides/dynamic-styling.)"
        tailwindSource={`<div className="flex items-end gap-2">
  <div className="w-4 rounded-sm bg-brand-500" style={{ height: "16px" }} />
  <div className="w-4 rounded-sm bg-brand-500" style={{ height: "32px" }} />
  <div className="w-4 rounded-sm bg-brand-500" style={{ height: "48px" }} />
  <div className="w-4 rounded-sm bg-brand-500" style={{ height: "64px" }} />
  <div className="w-4 rounded-sm bg-brand-500" style={{ height: "96px" }} />
</div>`}
        pandaSource={`<tw.div display="flex" items="end" gap={2}>
  <tw.div w={4} rounded="sm" bg="brand.500" h={4}  />
  <tw.div w={4} rounded="sm" bg="brand.500" h={8}  />
  <tw.div w={4} rounded="sm" bg="brand.500" h={12} />
  <tw.div w={4} rounded="sm" bg="brand.500" h={16} />
  <tw.div w={4} rounded="sm" bg="brand.500" h={24} />
</tw.div>`}
        tailwind={
          <div className="flex items-end gap-2">
            <div className="w-4 rounded-sm bg-brand-500" style={{ height: "16px" }} />
            <div className="w-4 rounded-sm bg-brand-500" style={{ height: "32px" }} />
            <div className="w-4 rounded-sm bg-brand-500" style={{ height: "48px" }} />
            <div className="w-4 rounded-sm bg-brand-500" style={{ height: "64px" }} />
            <div className="w-4 rounded-sm bg-brand-500" style={{ height: "96px" }} />
          </div>
        }
        panda={
          <tw.div display="flex" items="end" gap={2}>
            <tw.div w={4} rounded="sm" bg="brand.500" h={4} />
            <tw.div w={4} rounded="sm" bg="brand.500" h={8} />
            <tw.div w={4} rounded="sm" bg="brand.500" h={12} />
            <tw.div w={4} rounded="sm" bg="brand.500" h={16} />
            <tw.div w={4} rounded="sm" bg="brand.500" h={24} />
          </tw.div>
        }
      />

      <SideBySide
        title="A real component — pixel-identical CSS"
        description="Same Tailwind classes on the left; same CSS output on the right with style-prop syntax."
        tailwindSource={`<div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-md">
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-brand-500" />
    <div>
      <p className="text-sm font-semibold">Daniel Manning</p>
      <p className="text-xs text-zinc-500">danielmanning213@gmail.com</p>
    </div>
  </div>
  <p className="mt-4 text-sm leading-6 text-zinc-600">
    A PandaCSS preset that bridges Tailwind v4.
  </p>
  <button className="mt-6 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700">
    View profile
  </button>
</div>`}
        pandaSource={`<tw.div w="full" maxW="sm" rounded="xl" border="1px solid"
  borderColor="zinc.200" bg="white" p={6} shadow="md">
  <tw.div display="flex" items="center" gap={3}>
    <tw.div h={10} w={10} rounded="full" bg="brand.500" />
    <tw.div>
      <tw.p fontSize="sm" fontWeight="semibold">Daniel Manning</tw.p>
      <tw.p fontSize="xs" color="zinc.500">
        danielmanning213@gmail.com
      </tw.p>
    </tw.div>
  </tw.div>
  <tw.p mt={4} fontSize="sm" leading={6} color="zinc.600">
    A PandaCSS preset that bridges Tailwind v4.
  </tw.p>
  <tw.button mt={6} w="full" rounded="md" bg="zinc.900"
    px={3} py={2} fontSize="sm" color="white" cursor="pointer">
    View profile
  </tw.button>
</tw.div>`}
        tailwind={
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-500" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Daniel Manning
                </p>
                <p className="text-xs text-zinc-500">
                  danielmanning213@gmail.com
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              A PandaCSS preset that bridges Tailwind v4.
            </p>
            <button className="mt-6 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-700">
              View profile
            </button>
          </div>
        }
        panda={
          <tw.div
            w="full"
            maxW="sm"
            rounded="xl"
            border="1px solid"
            borderColor="zinc.200"
            bg="white"
            p={6}
            shadow="md"
          >
            <tw.div display="flex" items="center" gap={3}>
              <tw.div h={10} w={10} rounded="full" bg="brand.500" />
              <tw.div>
                <tw.p fontSize="sm" fontWeight="semibold" color="zinc.900">
                  Daniel Manning
                </tw.p>
                <tw.p fontSize="xs" color="zinc.500">
                  danielmanning213@gmail.com
                </tw.p>
              </tw.div>
            </tw.div>
            <tw.p mt={4} fontSize="sm" leading={6} color="zinc.600">
              A PandaCSS preset that bridges Tailwind v4.
            </tw.p>
            <tw.button
              mt={6}
              w="full"
              rounded="md"
              bg="zinc.900"
              px={3}
              py={2}
              fontSize="sm"
              color="white"
              cursor="pointer"
            >
              View profile
            </tw.button>
          </tw.div>
        }
      />

      <SideBySide
        title="Pattern components — VStack / HStack / Center / Grid"
        description="Panda ships layout primitives that name the intent instead of spelling it. VStack is a column flex with gap; HStack is a row flex with centered cross-axis; Grid takes a `columns` prop."
        tailwindSource={`<div className="flex flex-col gap-2 w-full max-w-xs">
  <div className="h-8 rounded-md bg-brand-300" />
  <div className="h-8 rounded-md bg-brand-500" />
  <div className="h-8 rounded-md bg-brand-700" />
</div>

<div className="flex items-center gap-3">
  <span className="h-3 w-3 rounded-full bg-brand-500" />
  <span className="text-sm">Online · 12 peers</span>
</div>

<div className="grid grid-cols-3 gap-2 w-full max-w-xs">
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="h-8 rounded-md bg-brand-100" />
  ))}
</div>`}
        pandaSource={`<VStack gap={2} w="full" maxW="xs">
  <tw.div h={8} rounded="md" bg="brand.300" />
  <tw.div h={8} rounded="md" bg="brand.500" />
  <tw.div h={8} rounded="md" bg="brand.700" />
</VStack>

<HStack gap={3}>
  <tw.span h={3} w={3} rounded="full" bg="brand.500" />
  <tw.span fontSize="sm">Online · 12 peers</tw.span>
</HStack>

<Grid columns={3} gap={2} w="full" maxW="xs">
  {Array.from({ length: 6 }).map((_, i) => (
    <tw.div key={i} h={8} rounded="md" bg="brand.100" />
  ))}
</Grid>`}
        tailwind={
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex w-full max-w-xs flex-col gap-2">
              <div className="h-8 rounded-md bg-brand-300" />
              <div className="h-8 rounded-md bg-brand-500" />
              <div className="h-8 rounded-md bg-brand-700" />
            </div>
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-brand-500" />
              <span className="text-sm">Online · 12 peers</span>
            </div>
            <div className="grid w-full max-w-xs grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 rounded-md bg-brand-100" />
              ))}
            </div>
          </div>
        }
        panda={
          <VStack gap={6} w="full">
            <VStack gap={2} w="full" maxW="xs">
              <tw.div h={8} w="full" rounded="md" bg="brand.300" />
              <tw.div h={8} w="full" rounded="md" bg="brand.500" />
              <tw.div h={8} w="full" rounded="md" bg="brand.700" />
            </VStack>
            <HStack gap={3}>
              <tw.span h={3} w={3} rounded="full" bg="brand.500" />
              <tw.span fontSize="sm">Online · 12 peers</tw.span>
            </HStack>
            <Grid columns={3} gap={2} w="full" maxW="xs">
              {Array.from({ length: 6 }).map((_, i) => (
                <tw.div key={i} h={8} rounded="md" bg="brand.100" />
              ))}
            </Grid>
          </VStack>
        }
      />

      <SideBySide
        title="Typography presets — one textStyle prop"
        description="Each preset bundles fontSize + lineHeight + letterSpacing + fontWeight (+ color where it makes sense). One prop replaces a 4-class string."
        tailwindSource={`<p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
  Eyebrow
</p>
<h1 className="text-6xl font-semibold leading-tight tracking-tight">
  Display 2XL
</h1>
<h2 className="text-4xl font-semibold leading-tight tracking-tight">
  Display LG
</h2>
<h3 className="text-2xl font-semibold leading-snug">
  Heading LG
</h3>
<p className="text-base text-zinc-700">
  Body MD — the workhorse paragraph size.
</p>
<p className="text-sm text-zinc-500">
  Caption / supporting copy.
</p>`}
        pandaSource={`<tw.p textStyle="eyebrow">Eyebrow</tw.p>
<tw.h1 textStyle="display-2xl">Display 2XL</tw.h1>
<tw.h2 textStyle="display-lg">Display LG</tw.h2>
<tw.h3 textStyle="heading-lg">Heading LG</tw.h3>
<tw.p textStyle="body-md" color="zinc.700">
  Body MD — the workhorse paragraph size.
</tw.p>
<tw.p textStyle="caption">Caption / supporting copy.</tw.p>`}
        tailwind={
          <div className="flex w-full flex-col items-start gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Eyebrow
            </p>
            <h1 className="text-6xl font-semibold leading-tight tracking-tight">
              Display 2XL
            </h1>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              Display LG
            </h2>
            <h3 className="text-2xl font-semibold leading-snug">Heading LG</h3>
            <p className="text-base text-zinc-700">
              Body MD — the workhorse paragraph size.
            </p>
            <p className="text-sm text-zinc-500">Caption / supporting copy.</p>
          </div>
        }
        panda={
          <Stack gap={2} alignItems="flex-start" w="full">
            <tw.p textStyle="eyebrow">Eyebrow</tw.p>
            <tw.h1 textStyle="display-2xl">Display 2XL</tw.h1>
            <tw.h2 textStyle="display-lg">Display LG</tw.h2>
            <tw.h3 textStyle="heading-lg">Heading LG</tw.h3>
            <tw.p textStyle="body-md" color="zinc.700">
              Body MD — the workhorse paragraph size.
            </tw.p>
            <tw.p textStyle="caption">Caption / supporting copy.</tw.p>
          </Stack>
        }
      />

      <SideBySide
        title="Responsive — object syntax for groups of breakpoints"
        description="Tailwind makes you repeat `class:` per breakpoint. Panda accepts a single object — `{ base, md, lg, xl }` — keeping the property next to its value at every viewport. Resize the window to see padding, font size, and color step through their breakpoints together."
        tailwindSource={`<div className="rounded-lg
  p-3        md:p-5      lg:p-8
  text-sm    md:text-lg  lg:text-2xl
  bg-brand-300 md:bg-brand-500 lg:bg-brand-700
  text-white">
  Responsive box — every property repeats its
  prefix on every breakpoint.
</div>`}
        pandaSource={`<tw.div
  rounded="lg"
  p={{       base: 3,         md: 5,         lg: 8         }}
  fontSize={{base: "sm",      md: "lg",      lg: "2xl"     }}
  bg={{      base: "brand.300", md: "brand.500", lg: "brand.700" }}
  color="white"
>
  Responsive box — one object per property.
</tw.div>`}
        tailwind={
          <div className="rounded-lg bg-brand-300 p-3 text-sm text-white md:bg-brand-500 md:p-5 md:text-lg lg:bg-brand-700 lg:p-8 lg:text-2xl">
            Responsive box — every property repeats its prefix on every
            breakpoint.
          </div>
        }
        panda={
          <tw.div
            rounded="lg"
            p={{ base: 3, md: 5, lg: 8 }}
            fontSize={{ base: "sm", md: "lg", lg: "2xl" }}
            bg={{ base: "brand.300", md: "brand.500", lg: "brand.700" }}
            color="white"
          >
            Responsive box — one object per property.
          </tw.div>
        }
      />

      <ThemeAsTypeSource />

      <TypeSafetyShowcase />

      <SideBySide
        title="Type-safe arbitrary utilities — <tw.div elevation={2}>"
        description="A custom Panda utility declared once in panda.config.ts. Values are an enum (0-4) so a typo or an out-of-range number is a compile-time error — the kind of thing arbitrary box-shadow strings silently swallow."
        tailwindSource={`// shadow-* is built-in, but a custom "elevation" scale means a
// JS const lookup or a Tailwind plugin. Either way nothing type-checks
// the input — \`elevation-7\` silently produces nothing.
<div className="rounded-xl bg-white p-6 shadow-sm" />
<div className="rounded-xl bg-white p-6 shadow-md" />
<div className="rounded-xl bg-white p-6 shadow-lg" />
<div className="rounded-xl bg-white p-6 shadow-xl" />`}
        pandaSource={`// utilities.extend.elevation defined in panda.config.ts —
// values are { 0 | 1 | 2 | 3 | 4 }, anything else is a TS error.
<tw.div rounded="xl" bg="white" p={6} elevation={1} />
<tw.div rounded="xl" bg="white" p={6} elevation={2} />
<tw.div rounded="xl" bg="white" p={6} elevation={3} />
<tw.div rounded="xl" bg="white" p={6} elevation={4} />`}
        tailwind={
          <Stack gap={4} w="full" alignItems="center">
            <div className="h-10 w-32 rounded-xl bg-white shadow-sm" />
            <div className="h-10 w-32 rounded-xl bg-white shadow-md" />
            <div className="h-10 w-32 rounded-xl bg-white shadow-lg" />
            <div className="h-10 w-32 rounded-xl bg-white shadow-xl" />
          </Stack>
        }
        panda={
          <Stack gap={4} w="full" alignItems="center">
            <tw.div h={10} w={32} rounded="xl" bg="white" elevation={1} />
            <tw.div h={10} w={32} rounded="xl" bg="white" elevation={2} />
            <tw.div h={10} w={32} rounded="xl" bg="white" elevation={3} />
            <tw.div h={10} w={32} rounded="xl" bg="white" elevation={4} />
          </Stack>
        }
      />

      <ButtonRecipeShowcase />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TL;DR — pro / con summary card                                             */
/* -------------------------------------------------------------------------- */

const CONS: { title: string; body: string }[] = [
  {
    title: "Typos render nothing, silently",
    body: "`bg-bluee-500` compiles, ships, and quietly produces zero styles. Your type checker never saw it.",
  },
  {
    title: "Class strings drift toward unreadable",
    body: "Any non-trivial component grows into a 200+ char run-on line of space-separated tokens.",
  },
  {
    title: "Order-dependent, brittle merging",
    body: "`cn()`, `tw-merge`, and prop-spread order decide who wins. Hard to predict; harder to refactor.",
  },
  {
    title: "Dynamic values force a `style={{ }}` escape",
    body: "Class names can't be interpolated, so anything runtime-valued exits the design system.",
  },
  {
    title: "Token renames break silently",
    body: "Refactor `brand-500` → `accent-500` and every old class becomes a no-op without a single warning.",
  },
  {
    title: "Breakpoints repeat their prefix per property",
    body: "`md:text-lg lg:text-xl xl:text-2xl` — the property's name lives three places at every viewport.",
  },
];

const PROS: { title: string; body: string }[] = [
  {
    title: "Typos are TypeScript errors",
    body: "`bg=\"bluee.500\"` fails at build, with the exact offending union member quoted in the diagnostic.",
  },
  {
    title: "One prop per concern",
    body: "Style props line up vertically; the JSX of a card stays scannable instead of becoming a string blob.",
  },
  {
    title: "Object styles merge by key — last wins",
    body: "No order tricks, no merge helpers. Two `bg` props can't both apply; the second replaces the first.",
  },
  {
    title: "Dynamic values are typed props",
    body: "`h={n}` where `n` is a number is the same kind of expression as any other JSX value. No inline `style`.",
  },
  {
    title: "Refactors light up every wrong reference",
    body: "Rename a token in `@theme` and your editor underlines every stale use across the codebase.",
  },
  {
    title: "Breakpoints collapse into one object",
    body: "`p={{ base: 3, md: 5, lg: 8 }}` — the property's name is written once, values stay next to viewports.",
  },
];

function XIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
    >
      <path d="M4 10l4 4 8-9" />
    </svg>
  );
}

function ProConItem({
  kind,
  title,
  body,
}: {
  kind: "con" | "pro";
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span
        className={
          kind === "con"
            ? "mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
            : "mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
        }
      >
        {kind === "con" ? <XIcon /> : <CheckIcon />}
      </span>
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {title}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
          {body}
        </p>
      </div>
    </li>
  );
}

function ProConPane({
  label,
  tagline,
  kind,
  items,
}: {
  label: string;
  tagline: string;
  kind: "con" | "pro";
  items: { title: string; body: string }[];
}) {
  return (
    <div
      className={
        kind === "pro"
          ? "overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/50 dark:bg-zinc-950"
          : "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      }
    >
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-[10px] tracking-normal text-zinc-400">
          {tagline}
        </span>
      </div>
      <ul className="divide-y divide-zinc-100 px-5 py-3 dark:divide-zinc-800/50">
        {items.map((item) => (
          <ProConItem key={item.title} kind={kind} {...item} />
        ))}
      </ul>
    </div>
  );
}

function ProConSummary() {
  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            What changes when Panda backs your Tailwind
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Same CSS variables, same visual output, same{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              @theme
            </code>{" "}
            tokens as your single source of truth. What you gain is everything
            the TypeScript compiler couldn't see before.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProConPane
            label="Tailwind"
            tagline="className strings"
            kind="con"
            items={CONS}
          />
          <ProConPane
            label="Panda"
            tagline="<tw.div …/> · TS-typed"
            kind="pro"
            items={PROS}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  @theme as type source — CSS in, typed JSX out                              */
/* -------------------------------------------------------------------------- */

function ThemeAsTypeSource() {
  const cssSrc = `/* demo/src/tailwind.css */
@import "tailwindcss";

@theme {
  --color-brand-50:  oklch(0.97 0.02 260);
  --color-brand-500: oklch(0.62 0.21 260);
  --color-brand-700: oklch(0.46 0.19 260);
  --color-brand-900: oklch(0.30 0.12 260);

  --radius-pill:     999px;
  --font-display:    "Inter Display", sans-serif;
}`;

  const jsxSrc = `import { tw } from "../styled-system/jsx";

// Panda regenerates these unions from the CSS above on every codegen.
// No manual TypeScript work; no second source of truth.
//
//   type ColorToken =
//     | "blue.500" | "red.500" | …       /* Tailwind defaults */
//     | "brand.50" | "brand.500"
//     | "brand.700" | "brand.900"        /* ← from your @theme */
//
//   type RadiusToken = "sm" | "md" | "lg" | "xl" | "pill"
//   type FontToken   = "sans" | "serif" | "mono" | "display"

function NewBadge() {
  return (
    <tw.span
      bg="brand.500"           // ✅ autocomplete from @theme
      color="white"
      rounded="pill"           // ✅ your custom radius
      fontFamily="display"     // ✅ your custom font family
      fontSize="sm"
      fontWeight="medium"
      px={4}
      py={1.5}
    >
      New release
    </tw.span>
  );
}`;

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            @theme is your type source — CSS in, typed JSX out
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            The preset reads Tailwind's <code>@theme</code> block and feeds it
            into Panda's type generator. Add a token in CSS, run
            <code className="ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              panda codegen
            </code>
            , and that token shows up in every typed style prop. No JS module
            of tokens to keep in sync, no manual <code>as const</code> arrays.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CodeOnlyPane
            label="tailwind.css"
            tagline="@theme { … }"
            source={cssSrc}
          />
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <span>badge.tsx</span>
              <span className="font-mono text-[10px] tracking-normal text-zinc-400">
                typed against above
              </span>
            </div>
            <div className="flex min-h-[120px] items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-900/40">
              <tw.span
                bg="brand.500"
                color="white"
                rounded="pill"
                fontFamily="display"
                fontSize="sm"
                fontWeight="medium"
                px={4}
                py={1.5}
              >
                New release
              </tw.span>
            </div>
            <pre className="overflow-x-auto border-t border-zinc-200 bg-zinc-950 px-4 py-3 text-[12px] leading-5 text-zinc-200 dark:border-zinc-800">
              <code>{jsxSrc}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Type-safety showcase (code-only, code with inline ✅/❌ annotations)        */
/* -------------------------------------------------------------------------- */

function TypeSafetyShowcase() {
  const tailwindSrc = `// Tailwind: typos compile fine and silently render nothing.
<div className="bg-bluee-500" />        {/* 😱 no error, no styles */}
<div className="text-zinc-5000" />      {/* 😱 no error, no styles */}
<div className="rouned-xl" />           {/* 😱 typo, ignored */}

// Custom @theme tokens get autocomplete only via the VSCode plugin
// — \`tsc\` never sees them.
<div className="bg-brand-700" />         {/* ✅ works at runtime */}
<div className="bg-brnad-700" />         {/* 😱 typo, silently dead */}`;

  const pandaSrc = `// Panda: every token-valued prop is a typed union.
// Typos and out-of-range values are TS errors.
<tw.div bg="blue.500" />                 {/* ✅ */}
<tw.div bg="brand.700" />                {/* ✅ — generated from your @theme */}

<tw.div bg="bluee.500" />                {/* ❌ Type '"bluee.500"' is not
                                              assignable to type ColorToken */}

<tw.div bg="zinc.5000" />                {/* ❌ — same; "5000" isn't a step */}

<tw.div rouned="xl" />                   {/* ❌ Property 'rouned' does not
                                              exist on type 'HTMLDivProps' */}`;

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Type safety — typos fail the build, not the render
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Tailwind's class strings are inert to the TypeScript compiler. Panda
            tokens are enums. Refactor a token name in your theme and every
            wrong reference lights up in your editor instead of disappearing
            from the rendered page.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CodeOnlyPane
            label="Tailwind"
            tagline="strings · no checks"
            source={tailwindSrc}
          />
          <CodeOnlyPane
            label="Panda"
            tagline="<tw.div …/> · TS enums"
            source={pandaSrc}
            highlight
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Recipe (cva) showcase — port the shadcn-style button                       */
/* -------------------------------------------------------------------------- */

const buttonRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    rounded: "lg",
    borderWidth: "1px",
    borderColor: "transparent",
    fontSize: "sm",
    fontWeight: "medium",
    whiteSpace: "nowrap",
    transitionProperty: "background-color, color, border-color, box-shadow",
    transitionDuration: "150ms",
    userSelect: "none",
    cursor: "pointer",
    _disabled: { pointerEvents: "none", opacity: 0.5 },
    _focusVisible: { outline: "2px solid", outlineColor: "brand.500", outlineOffset: "2px" },
    _active: { transform: "translateY(1px)" },
  },
  variants: {
    variant: {
      default: {
        bg: "zinc.900",
        color: "white",
        _hover: { bg: "zinc.700" },
      },
      outline: {
        borderColor: "zinc.300",
        bg: "white",
        color: "zinc.900",
        _hover: { bg: "zinc.50" },
      },
      secondary: {
        bg: "zinc.100",
        color: "zinc.900",
        _hover: { bg: "zinc.200" },
      },
      ghost: {
        color: "zinc.700",
        _hover: { bg: "zinc.100", color: "zinc.900" },
      },
      destructive: {
        bg: "red.50",
        color: "red.700",
        _hover: { bg: "red.100" },
      },
      link: {
        color: "brand.600",
        textUnderlineOffset: "4px",
        _hover: { textDecoration: "underline" },
      },
    },
    size: {
      sm: { h: 8, px: 3, gap: 1 },
      md: { h: 9, px: 3.5, gap: 1.5 },
      lg: { h: 10, px: 4, gap: 1.5, fontSize: "base" },
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

function ButtonRecipeShowcase() {
  const pandaSrc = `import { cva } from "../styled-system/css";

const button = cva({
  base: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    rounded: "lg", borderWidth: "1px", borderColor: "transparent",
    fontSize: "sm", fontWeight: "medium", whiteSpace: "nowrap",
    cursor: "pointer",
    _disabled: { pointerEvents: "none", opacity: 0.5 },
    _focusVisible: { outline: "2px solid", outlineColor: "brand.500" },
    _active: { transform: "translateY(1px)" },
  },
  variants: {
    variant: {
      default:     { bg: "zinc.900",  color: "white",     _hover: { bg: "zinc.700" } },
      outline:     { borderColor: "zinc.300", bg: "white", _hover: { bg: "zinc.50" } },
      secondary:   { bg: "zinc.100",  color: "zinc.900",  _hover: { bg: "zinc.200" } },
      ghost:       { color: "zinc.700", _hover: { bg: "zinc.100" } },
      destructive: { bg: "red.50",    color: "red.700",   _hover: { bg: "red.100" } },
      link:        { color: "brand.600", _hover: { textDecoration: "underline" } },
    },
    size: {
      sm: { h: 8,  px: 3,   gap: 1 },
      md: { h: 9,  px: 3.5, gap: 1.5 },
      lg: { h: 10, px: 4,   gap: 1.5, fontSize: "base" },
    },
  },
  defaultVariants: { variant: "default", size: "md" },
});

// Both \`variant\` and \`size\` are typed unions.
<button className={button({ variant: "destructive", size: "sm" })}>
  Delete
</button>`;

  const tailwindSrc = `import { cva } from "class-variance-authority";

const button = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border " +
  "border-transparent text-sm font-medium whitespace-nowrap transition-all " +
  "outline-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
  "active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-zinc-900 text-white hover:bg-zinc-700",
        outline: "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
        destructive: "bg-red-50 text-red-700 hover:bg-red-100",
        link: "text-brand-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 gap-1 px-3",
        md: "h-9 gap-1.5 px-3.5",
        lg: "h-10 gap-1.5 px-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);`;

  const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;

  return (
    <SideBySide
      title="Recipes — port the shadcn cva pattern to typed Panda"
      description="The same cva shape, but every value is a typed Panda token (not a class-name fragment string). Refactor `bg: 'zinc.900'` → `bg: 'zinc.800'` and the IDE finds every variant that referenced it."
      tailwindSource={tailwindSrc}
      pandaSource={pandaSrc}
      tailwind={
        <VStack gap={3} alignItems="flex-start">
          <HStack gap={2}>
            <ShadcnButton variant="default">Default</ShadcnButton>
            <ShadcnButton variant="outline">Outline</ShadcnButton>
            <ShadcnButton variant="secondary">Secondary</ShadcnButton>
          </HStack>
          <HStack gap={2}>
            <ShadcnButton variant="ghost">Ghost</ShadcnButton>
            <ShadcnButton variant="destructive">Destructive</ShadcnButton>
            <ShadcnButton variant="link">Link</ShadcnButton>
          </HStack>
          <HStack gap={2}>
            <ShadcnButton size="sm">Small</ShadcnButton>
            <ShadcnButton size="md">Medium</ShadcnButton>
            <ShadcnButton size="lg">Large</ShadcnButton>
          </HStack>
        </VStack>
      }
      panda={
        <VStack gap={3} alignItems="flex-start">
          <HStack gap={2}>
            {(["default", "outline", "secondary"] as const).map((v) => (
              <button key={v} className={buttonRecipe({ variant: v })}>
                {v[0]!.toUpperCase() + v.slice(1)}
              </button>
            ))}
          </HStack>
          <HStack gap={2}>
            {(["ghost", "destructive", "link"] as const).map((v) => (
              <button key={v} className={buttonRecipe({ variant: v })}>
                {v[0]!.toUpperCase() + v.slice(1)}
              </button>
            ))}
          </HStack>
          <HStack gap={2}>
            {(["sm", "md", "lg"] as const).map((s) => (
              <button key={s} className={buttonRecipe({ size: s })}>
                {s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}
              </button>
            ))}
          </HStack>
        </VStack>
      }
    />
  );
}

/* Tailwind-side button — for the visual half of the recipe demo. */
const SHADCN_VARIANTS = {
  default: "bg-zinc-900 text-white hover:bg-zinc-700",
  outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
  destructive: "bg-red-50 text-red-700 hover:bg-red-100",
  link: "text-brand-600 underline-offset-4 hover:underline",
} as const;
const SHADCN_SIZES = {
  sm: "h-8 gap-1 px-3",
  md: "h-9 gap-1.5 px-3.5",
  lg: "h-10 gap-1.5 px-4 text-base",
} as const;

function ShadcnButton({
  variant = "default",
  size = "md",
  children,
}: {
  variant?: keyof typeof SHADCN_VARIANTS;
  size?: keyof typeof SHADCN_SIZES;
  children: ReactNode;
}) {
  const base =
    "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all cursor-pointer active:translate-y-px disabled:pointer-events-none disabled:opacity-50";
  return (
    <button className={`${base} ${SHADCN_VARIANTS[variant]} ${SHADCN_SIZES[size]}`}>
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Proposal: full Tailwind-shorthand JSX (NOT implemented)                    */
/* -------------------------------------------------------------------------- */

function ShorthandProposal() {
  const tailwindSrc = `<div className="flex items-center gap-3 p-4
  bg-white rounded-xl shadow-md
  border border-zinc-200 max-w-sm">
  <div className="w-10 h-10 rounded-full bg-brand-500" />
  <div className="space-y-1">
    <p className="text-sm font-semibold text-zinc-900">
      Daniel Manning
    </p>
    <p className="text-xs text-zinc-500">
      danielmanning213@gmail.com
    </p>
  </div>
</div>`;

  const proposedSrc = `<tw.div
  display="flex" items="center" gap={3} p={4}
  bg="white" rounded="xl" shadow="md"
  border-w={1} border-color="zinc.200" max-w="sm"
>
  <tw.div w={10} h={10} rounded="full" bg="brand.500" />
  <tw.div space-y={1}>
    <tw.p text-size="sm" font-weight="semibold" color="zinc.900">
      Daniel Manning
    </tw.p>
    <tw.p text-size="xs" color="zinc.500">
      danielmanning213@gmail.com
    </tw.p>
  </tw.div>
</tw.div>`;

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Proposal · not implemented
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            What full Tailwind-shorthand JSX would look like
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Mockup only. The right-hand block is{" "}
            <em>not</em> wired up — every prop would need a Panda utility,
            a kebab-aware analyser pass, and a rule layer to police ambiguous
            pairs. Read both sides and tell me whether the right one reads
            cleanly enough to invest in.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CodeOnlyPane label="Tailwind" tagline="className=…" source={tailwindSrc} />
          <CodeOnlyPane
            label="Proposed shorthand JSX"
            tagline="<tw.div …/>"
            source={proposedSrc}
            highlight
          />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-zinc-600 dark:text-zinc-400 md:grid-cols-3">
          <Trade
            title="text-size / font-weight"
            body="Spelt out, not just `text` or `font`, so Tailwind muscle memory (`text-xs` is a size, not a color) doesn't silently misroute the value."
          />
          <Trade
            title="border-w / border-color"
            body="Tailwind's bare `border` class also sets a default color. Splitting into two props keeps each one type-checkable to a single token category."
          />
          <Trade
            title="space-y / max-w"
            body="Kebab JSX prop names work in React but Panda's analyser only sees camel. We'd need a small analyser plugin or build-time rewrite to make it statically extractable."
          />
        </div>
      </div>
    </section>
  );
}

function CodeOnlyPane({
  label,
  tagline,
  source,
  highlight,
}: {
  label: string;
  tagline: string;
  source: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm dark:border-amber-900/50 dark:bg-zinc-950"
          : "overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      }
    >
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <span>{label}</span>
        <span className="font-mono text-[10px] tracking-normal text-zinc-400">
          {tagline}
        </span>
      </div>
      <pre className="overflow-x-auto bg-zinc-950 px-4 py-4 text-[12px] leading-5 text-zinc-200">
        <code>{source}</code>
      </pre>
    </div>
  );
}

function Trade({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="font-mono text-[11px] font-medium text-zinc-900 dark:text-zinc-50">
        {title}
      </p>
      <p className="mt-1 text-xs leading-5">{body}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Getting Started — minimal install on top of an existing Tailwind project  */
/* -------------------------------------------------------------------------- */

function GettingStarted() {
  return (
    <section
      id="install"
      className="border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/30"
    >
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-10">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-700 dark:border-brand-900/50 dark:bg-brand-950/30 dark:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Getting started
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Add Panda to your existing Tailwind v4 project
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Six steps. Tailwind keeps doing what it's already doing. Panda
            reads the same{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              @theme
            </code>{" "}
            tokens and gives you typed style props on top.
          </p>
        </div>

        <Step
          n={1}
          title="Tell npm where @dmisdm/pandatail lives"
          note="One-time .npmrc plumbing — the package is on GitHub Packages, which authenticates every read (even for public packages)."
        >
          <Code language="sh">{`# in your project root
echo "@dmisdm:registry=https://npm.pkg.github.com" >> .npmrc

# in ~/.npmrc (not committed) — create a token with read:packages scope
# at https://github.com/settings/tokens
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT" >> ~/.npmrc`}</Code>
        </Step>

        <Step
          n={2}
          title="Install Panda and the preset"
          note="Tailwind v4 stays as you have it — it's a peer dependency."
        >
          <Code>npm install -D @pandacss/dev @dmisdm/pandatail</Code>
        </Step>

        <Step
          n={3}
          title="Initialise Panda"
          note="Scaffolds panda.config.ts and a postcss.config.js."
        >
          <Code>npx panda init --postcss</Code>
        </Step>

        <Step
          n={4}
          title="Wire the preset into panda.config.ts"
          note="Point cssPath at your Tailwind entry CSS — the file containing @import 'tailwindcss' and your @theme block."
        >
          <Code language="ts">{`import { defineConfig } from "@pandacss/dev";
import { tailwindPresetSync } from "@dmisdm/pandatail";

export default defineConfig({
  preflight: false,           // Tailwind already ships preflight
  jsxFramework: "react",
  jsxFactory: "tw",           // <tw.div /> reads like a Tailwind class
  jsxStyleProps: "all",

  presets: [
    "@pandacss/preset-base",
    tailwindPresetSync({ cssPath: "./src/tailwind.css" }),
  ],

  include: ["./src/**/*.{ts,tsx}"],
  outdir: "styled-system",
});`}</Code>
        </Step>

        <Step
          n={5}
          title="Add a Panda CSS entry and import it"
          note="The Panda PostCSS plugin expands this file into your generated tokens, recipes, and utilities."
        >
          <Code language="css">{`/* src/panda.css */
@layer reset, base, tokens, recipes, utilities;`}</Code>
          <Code language="ts">{`// src/main.tsx
import "./tailwind.css";   // your existing Tailwind entry
import "./panda.css";      // new
`}</Code>
        </Step>

        <Step
          n={6}
          title="Generate the typed runtime"
          note="Re-run on any panda.config.ts or @theme change. Most projects wire this into vite dev / build."
        >
          <Code>npx panda codegen</Code>
        </Step>

        <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            That's it
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            Both syntaxes work in the same file. Migrate one component at a
            time, leave the rest as Tailwind classes.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 px-4 py-3 text-[12px] leading-5 text-zinc-200">
            <code>{`import { tw } from "../styled-system/jsx";

// Tailwind classes still work
<div className="rounded-lg bg-brand-500 p-4 text-white">Old way</div>

// Panda style props with full type-safety against your @theme
<tw.div rounded="lg" bg="brand.500" p={4} color="white">
  New way
</tw.div>`}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function Step({
  n,
  title,
  note,
  children,
}: {
  n: number;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-8 grid grid-cols-[auto_1fr] gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 font-mono text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900">
        {n}
      </div>
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        {note ? (
          <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            {note}
          </p>
        ) : null}
        <div className="mt-3 space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Code({
  children,
  language,
}: {
  children: ReactNode;
  language?: "ts" | "css" | "sh";
}) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-950 px-4 py-3 text-[12px] leading-5 text-zinc-200 dark:border-zinc-800">
      {language ? (
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {language}
        </span>
      ) : null}
      <code>{children}</code>
    </pre>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <p className="text-xs text-zinc-500">
          Built with Tailwind v4 + PandaCSS · One source of truth.
        </p>
        <p className="text-xs text-zinc-500">© pandatail</p>
      </div>
    </footer>
  );
}
