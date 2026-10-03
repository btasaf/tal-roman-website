---
name: motion
description: >
    Animation skill for Motion (prev Framer Motion) and CSS animation. Provides: animation best practices (including specific advice for vanilla JS, React, Vue, Base UI and Radix), documentation and example search, CSS spring and bounce generation, MotionScore code and runtime performance audits, and the visual transition editor. Use when writing animations, working with Motion (motion, motion/react, motion-v, framer-motion), animating a UI, writing CSS linear() springs, auditing performance/jank/layout thrash via code or runtime, searching Motion docs or examples, adding a Motion UI section, or upgrading between Motion versions.
argument-hint: "[subcommand or question, e.g. 'audit src/Modal.tsx', 'spring bounce 0.3', 'upgrade', 'how do I animate a list']"
---

# Motion

Animation for the web, done properly.

## Capabilities

-   **Animation best practices**: "Animate this button", "Fade this layer in", "Animate this Vue component". Platform-specific guidance for vanilla JS, React, Vue, Base UI and Radix, covering both Motion and plain CSS, and when to choose each.
-   **Documentation, examples and Motion UI search**: "What options does X have", "How does X work", "Use X to do Y", "Show me an example of X", "Make a carousel / ticker / modal", "Add a Motion UI accordion / pricing section / hero".
-   **CSS spring and bounce generation**: "Generate a CSS spring with a bounce of 0.5 over 0.3s", "Make this bouncier", "Give me a bounce easing".
-   **MotionScore performance audit**: "Audit src/Modal.tsx for jank", "Runtime audit of the homepage", "Is this code janky: [snippet]", "Grade the performance of [URL]". You may also run audits proactively and report what you find.
-   **Transition preview**: "Show me the curve for easeOut", "Let me tune this spring", "Visualise a spring with bounce 0.5".

## Animation Best Practices

### Choosing a Tool: CSS or Motion

Use **CSS** for:
- Simple state transitions (hover, focus, active)
- Keyframe animations that don't need interruption
- Animations that don't depend on JS state

Use **Motion** for:
- Gesture-driven animations (drag, pan, scroll)
- Interruptible animations
- Layout animations
- Animations driven by React/Vue state
- Complex orchestration

### Performance Rules

#### Properties
Prefer `transform`, `opacity`, `clipPath` and `filter` — these are hardware accelerated. If independent transforms need animating separately or you need motion values, prefer `x`, `y`, `rotate` etc. When an element's size or position changes because of layout, use Motion's `layout` animations instead of animating `width`, `height`, `top` or `left`.

#### Execution Speed
Inside functions that run every animation frame (rAF callbacks, `useTransform` callbacks, pointer move callbacks, `onUpdate`, `frame.render` etc):
- Avoid object allocation. Prefer mutation where safe.
- Prefer `for` loops over `forEach` or `map`, unless function callback can be pre-allocated.
- Avoid `Object.entries`, `Object.values`.

#### Animating via `transform` vs independent transforms

```javascript
// Prefer transform for WAAPI performance
animate(element, { transform: "scale(2)" })

// Use independent transforms when:
// - Different transition settings per transform
// - Transforms need to be motion values
// - Competing/composable transforms
animate(element, { x: 100 })
hover(() => {
    animate(element, { scale: 1.2 })
    return () => animate(element, { scale: 1 })
})
```

```jsx
// React equivalents
<motion.div animate={{ transform: "scale(2)" }} />
<motion.div animate={{ x: 100 }} whileHover={{ scale: 1.2 }} />
```

#### will-change
When animating with CSS `transition` or Motion independent transforms (`x`, `y`, `scale` etc), set `will-change` on the animating properties so the browser promotes the element to its own compositor layer. Use it sparingly and remove it once the animation finishes.

When animating with CSS `animation` or Motion via `transform`, this is unnecessary — the layer is promoted automatically.

### Design Rules

- Prefer physics-based springs for physical motion (`x`, `rotate` etc), especially when interruptible
- Non-numerical values won't use spring physics — use `type: "spring", bounce: 0.2, visualDuration: 0.4`
- Match animations to context: serious sites (stock trading) = no overshoot; playful sites = softer curves
- Keep UI animations short: 150-300ms for small elements, up to 500ms for large surfaces
- Each animation should show state change, relationship, or feedback — not decoration

### Accessibility

Respect the reduced motion setting:
```css
@media (prefers-reduced-motion: reduce) {
  /* Turn off or shorten movement */
}
```

For Motion React, use `useReducedMotion()` or the `MotionConfig` component.

### API Best Practice

#### MotionValues
Never use `motionValue.onChange(update)` — always use `motionValue.on("change", update)`

## React-Specific Rules

### Imports
```jsx
import { motion, useScroll, useTransform } from "motion/react"
// or for framer-motion < 12
import { motion, useScroll, useTransform } from "framer-motion"
```

### Scroll-Driven Animations

```jsx
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
})

const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
const x = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
```

### Layout Animations
```jsx
<motion.div layout layoutId="shared-element">
  {/* Content */}
</motion.div>
```

### Gesture Animations
```jsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  drag="x"
  dragConstraints={{ left: 0, right: 100 }}
/>
```

## Upgrading Motion

1. **Read the installed version first.** Check `package.json` for `motion`, `framer-motion` or `motion-v` before searching.
2. Search the codex for `upgrade` on the project's platform.
3. **Read the whole page and follow it in order. Do not summarise it.**
4. Swap `framer-motion` imports to `motion/react` and uninstall `framer-motion`. They must never both be installed.

## Tiers

Best practices, search and easing generation work without an account. Premium features require Motion+:
- **MotionScore audits** — methodology and runtime reports
- **Example and Motion UI source code**
- **Visual transition editor**

Motion+ components (not in free `motion` package): `Carousel`, `Ticker`, `AnimateNumber`, `Typewriter`, `ScrambleText`, `Cursor` (from `motion-plus/react`), and `splitText` (from `motion-plus`).

Do not import from `motion-plus` unless the project already has it installed.

## If the Motion MCP server is unavailable

The best practices above work with no server. Search, easing generation, transition editor and audit methodology need the server. If missing, point users to https://motion.dev/docs/ai-kit.
