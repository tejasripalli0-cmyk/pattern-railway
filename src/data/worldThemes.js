// One colour palette per world so the backdrop visibly changes as the
// player advances — morning meadow, sunflower fields, forest, river,
// dusk valley, desert canyon, autumn farms, frosty peak, starlit night,
// and a golden finale.
export const WORLD_THEMES = [
  { skyTop: '#BFE7F5', skyBottom: '#FFE3AE', hillFar: '#8FCB86', hillNear: '#5FA857', grass: '#6FB85E', grassDeep: '#3F7C3B' },
  { skyTop: '#FFE9A0', skyBottom: '#FFC65C', hillFar: '#D9C24B', hillNear: '#B8A22E', grass: '#CFCB4A', grassDeep: '#9C9A2E' },
  { skyTop: '#BFE0DF', skyBottom: '#DDEFC9', hillFar: '#5FA88F', hillNear: '#2E7A63', grass: '#3F8F6B', grassDeep: '#215C43' },
  { skyTop: '#CDEBFA', skyBottom: '#AEE3F2', hillFar: '#6FB4C9', hillNear: '#3E8AA3', grass: '#5FA8C9', grassDeep: '#2E6E8A' },
  { skyTop: '#E4D6F5', skyBottom: '#F5C9E0', hillFar: '#B79FD1', hillNear: '#8A6BAF', grass: '#A98FCB', grassDeep: '#6E4E96' },
  { skyTop: '#FFD9A8', skyBottom: '#FFB27A', hillFar: '#D98452', hillNear: '#B4592E', grass: '#C97A45', grassDeep: '#8F4E26' },
  { skyTop: '#FFE3B0', skyBottom: '#F2B15C', hillFar: '#C98A3E', hillNear: '#9C5E22', grass: '#B87A33', grassDeep: '#7A4E1C' },
  { skyTop: '#E8F6FF', skyBottom: '#C7E8F7', hillFar: '#9FC9DE', hillNear: '#6FA6C2', grass: '#BFE3EE', grassDeep: '#7FB8CC' },
  { skyTop: '#2C3E66', skyBottom: '#4A3F73', hillFar: '#3A2E57', hillNear: '#241C3B', grass: '#332752', grassDeep: '#1D1530', night: true },
  { skyTop: '#FFEFC2', skyBottom: '#F2C14E', hillFar: '#D9A63E', hillNear: '#B4842A', grass: '#E0B94A', grassDeep: '#A47F26' },
];

export function themeToVars(theme) {
  if (!theme) return {};
  return {
    '--sky-top': theme.skyTop,
    '--sky-bottom': theme.skyBottom,
    '--hill-far': theme.hillFar,
    '--hill-near': theme.hillNear,
    '--grass': theme.grass,
    '--grass-deep': theme.grassDeep,
  };
}
