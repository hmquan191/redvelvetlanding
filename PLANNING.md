## Animation plan for Ending Section

### Ending section (scroll-in “memory” finale)

- **Tracking target**: `EndingSection` root `<section>` via `useInView(ref, { amount: 0.55 })`
- **Replay rule**: play once per viewport entry; reset when it leaves view.

#### Timeline (relative to viewport entry)

- **T+0ms**: text fades in (soft blur → crisp)
- **T+450ms**: shooting star enters from left and crosses the title + wish line
- **T+~900ms**: “impact” moment (mid-cross): text color brightens, warm afterglow appears behind text

#### Tunable constants (in `src/components/EndingSection.tsx`)

- `ENDING_TIMING.textInMs`
- `ENDING_TIMING.starDelayMs`
- `ENDING_TIMING.starTravelMs`
- `ENDING_TIMING.impactAt` (0..1, fraction of star travel where the “hit” occurs)
- `ENDING_TIMING.brightenMs`
