# Part 2 — Mobile App Planning

How **Pattern Railway** would move from a responsive web app to a native
mobile app on iOS and Android.

## 1. Technology choice

**Recommendation: React Native, bootstrapped and shipped with Expo (EAS Build).**

| Option | Verdict |
|---|---|
| **React Native + Expo** ✅ | Reuses ~70–80% of existing logic (`data/`, `utils/`, game state, level generation, quiz logic). Expo gives OTA updates, easy audio/haptics/storage APIs, and a managed build pipeline (EAS) so we don't touch Xcode/Android Studio for most work. |
| Capacitor (wrap the existing web build) | Fastest port (days, not weeks) — literally embeds the current site in a WebView. Good for an MVP or a quick app-store presence, but touch responsiveness, animation smoothness (SVG/CSS train, drag-and-drop), and audio latency are all noticeably worse than native, and it feels like "a website in an app," which matters a lot for a game aimed at a polished, Candy-Crush-like feel. |
| Fully native (Swift/Kotlin) | Best possible performance and platform polish, but means maintaining two separate codebases for a puzzle-logic-heavy game — not justified at this stage. |

**Why RN/Expo wins for this project specifically:**
- The game's actual "hard part" — level generation, pattern logic, scoring,
  and the quiz bank in `src/data/` and `src/utils/` — is plain JavaScript
  with zero DOM dependencies, so it ports over almost unchanged.
- The UI layer (React components + CSS) does need to be rebuilt using RN
  primitives (`View`, `Pressable`, `Animated`/`Reanimated`,
  `react-native-svg`), but the *component boundaries* stay the same
  (`TrackTile`, `WorldMap`, `LevelScreen`, `QuizModal`...), so the porting
  work is mechanical rather than a redesign.
- Expo modules give us `expo-av`/`expo-audio` (sound), `expo-haptics`
  (vibration feedback), `AsyncStorage` (progress persistence), and
  `expo-notifications` (streaks/reminders) essentially for free.
- One codebase covers iOS + Android; EAS Build/Submit handles App
  Store/Play Store packaging without local native toolchains.

## 2. Mobile UI adaptations

- **Single-column, thumb-first layout.** The rail currently scrolls
  horizontally on desktop; on mobile it becomes the primary focal band
  across the middle third of the screen (the "one-handed reach zone"),
  with the options tray anchored to the bottom safe area and the
  hint/restart controls collapsed into a compact icon row up top.
- **World map becomes a vertical, snap-scrolling path** (already designed
  that way in the web version) rendered with `FlatList`/`Animated.ScrollView`
  and `snapToInterval` so each world section settles cleanly on screen —
  matching the feel of Candy Crush's map.
- **Safe-area and notch handling** via `react-native-safe-area-context` so
  the top bar, tray, and modals never sit under a status bar, notch, or
  home indicator.
- **Dynamic type scaling capped** — big, rounded, readable text (per the
  brief) but clamped so long strings (quiz answers, world names) don't
  overflow on small devices; test at both the smallest supported phone
  width and largest tablet width.
- **Portrait-first, with an optional landscape "tablet" layout** that shows
  the rail and tray side-by-side instead of stacked, since tablets have the
  width to spare.
- **Modals become native bottom sheets** (`@gorhom/bottom-sheet`) instead of
  centered web dialogs — feels more natural for quiz/result screens and is
  swipe-dismissible.

## 3. Touch interactions and gestures

- **Drag-and-drop** moves from Pointer Events to `react-native-gesture-handler`
  `Pan` gestures combined with `react-native-reanimated`, giving a
  native-thread-driven 60fps drag with proper "snap to nearest slot" and
  spring-back-if-missed physics (nicer than the current web ghost-drag).
- **Tap-to-select, tap-to-place** stays as the accessible fallback,
  identical in spirit to the web version, important for players who find
  drag gestures fiddly.
- **Rotate control** becomes a tap *or* a twist: support a two-finger
  rotate gesture on the selected piece as a delightful power-user shortcut,
  in addition to the ⟳ button (which remains for accessibility).
- **Haptic feedback** (`expo-haptics`) replaces/augments audio cues: a light
  tap on pickup, a success "notification" haptic on correct placement, a
  sharper buzz on a wrong one, and a heavier impact when the train departs.
- **Swipe gestures** on the world map (swipe between world sections) and on
  modals (swipe down to dismiss non-blocking ones).
- **Pull-to-refresh / long-press** are avoided deliberately — they're not
  meaningful actions here and would just create accidental triggers.

## 4. Performance optimizations

- **Level data generated once and memoized**, not regenerated per render;
  since it's already pure/deterministic (`mulberry32` seeded RNG), it can
  be generated at build time into a static JSON asset instead of at runtime,
  removing all startup computation.
- **`react-native-svg` for signal icons**, pre-warmed/rasterized where
  possible; for very low-end devices, fall back to a small sprite-sheet
  (PNG @1x/2x/3x) instead of live SVG rendering to cut GPU cost.
- **`Reanimated` + native driver** for the train run, drag gestures, and
  star pop-ins, so animations run on the UI thread and stay smooth even if
  JS thread is busy (e.g., mid-quiz-answer scoring).
- **Windowed rendering of the world map** (`FlatList` with
  `windowSize`/`initialNumToRender` tuned) so only nearby level nodes and
  world sections are mounted, instead of all 100 nodes at once.
- **Preload/pool audio players** (short synthesized or pre-rendered click
  /correct/wrong/whistle/bell clips) rather than constructing a new
  `AudioContext` graph per event, avoiding the small GC churn the current
  Web Audio implementation has.
- **Image/asset budget**: keep the scenic background as vector (SVG) rather
  than large raster art, and lazy-load anything above the fold-equivalent
  (e.g., later worlds' art) only as the player scrolls near them.

## 5. Offline support

- **Fully offline-playable by design** — level generation is a pure
  function with no network dependency, so all 100 levels work with zero
  connectivity from first launch (bundle the seeded level data at build
  time).
- **Local persistence via `AsyncStorage`** (or `MMKV` for faster,
  synchronous reads/writes) for stars, unlocked levels, tutorial-seen flag,
  and settings (sound/haptics on/off) — mirrors today's `localStorage` use
  1:1.
- **Optional cloud sync** (Supabase/Firebase or a simple REST backend) that
  is additive, not required: if the player signs in, local progress is
  merged/backed up so it survives a device change; if they never sign in,
  the game is 100% offline-capable forever.
- **Graceful network-dependent features** (e.g., a "Daily Challenge" pulled
  from a server, or a leaderboard) are designed to fail silently and hide
  themselves when offline, never blocking core play.

## 6. Additional mobile-first features

- **Daily Challenge / streaks** — one curated level per day with a bonus
  star, plus a streak counter and a gentle local notification reminder
  ("Your train is waiting! 🚂") — using `expo-notifications`, opt-in only.
- **Widgets / App Shortcuts** — a home-screen widget (iOS 17+/Android)
  showing today's star count or next unplayed level, and a long-press app
  icon shortcut straight to "Continue" or "Daily Challenge."
- **Haptics-rich feedback loop** as described above — this is one of the
  biggest "feels native" upgrades over the web version.
- **Portrait one-handed mode / thumb-zone tray placement**, and a
  **left/right-handed tray mirroring option** in Settings.
- **Accessibility**: VoiceOver/TalkBack labels on every tile and slot
  (already semantically named in the web version's `aria-label`s, which
  carry over conceptually), a colour-blind-safe palette toggle (shapes
  already double-encode colour, which helps), and a "reduce motion" setting
  that shortens/removes the train run and shake animations.
- **Share/screenshot card** — after finishing a world, generate a shareable
  image card ("I repaired all of Windmill Valley! ⭐⭐⭐×10") for social
  sharing, a natural mobile-native growth loop that doesn't fit as well on
  web.
- **In-app store readiness**: app icon, splash screen, and store screenshots
  generated from the same SVG design tokens used on web, so the visual
  identity stays consistent across platforms.
