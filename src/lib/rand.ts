// generateur pseudo-aleatoire seede (mulberry32)
// remplace @faker-js/faker pour economiser ~800 kB de bundle

// etat interne du prng
let _state = 42;

// initialise la seed
export function seed(s: number): void {
  _state = s | 0;
}

// retourne un float entre 0 et 1 (deterministe)
export function random(): number {
  _state = (_state + 0x6d2b79f5) | 0;
  let t = Math.imul(_state ^ (_state >>> 15), 1 | _state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// float entre min et max avec precision decimale
export function randomFloat(min: number, max: number, decimals = 2): number {
  const val = min + random() * (max - min);
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
}

// entier entre min et max inclus
export function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

// choisit un element aleatoire dans un tableau
export function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(random() * arr.length)]!;
}

// date aleatoire entre deux bornes
export function randomDate(from: Date, to: Date): Date {
  const fromMs = from.getTime();
  const toMs = to.getTime();
  return new Date(fromMs + random() * (toMs - fromMs));
}

// uuid v4 deterministe
export function uuid(): string {
  const hex = "0123456789abcdef";
  const tpl = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  return tpl.replace(/[xy]/g, (c) => {
    const r = (random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return hex[v]!;
  });
}
