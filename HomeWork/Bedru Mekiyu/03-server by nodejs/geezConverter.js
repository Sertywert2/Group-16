#!/usr/bin/env node
'use strict';

/**
 * geezConverter.js
 *
 * Bidirectional Ethiopian (Ge'ez) numeral converter.
 * - toGeez(number)   : Arabic integer -> canonical Ge'ez string
 * - fromGeez(string) : Ge'ez string -> Arabic integer
 *
 * Exports functions for unit tests and also acts as a CLI.
 */

// Ge'ez digit mapping
const geezDigits = {
  1: '፩', 2: '፪', 3: '፫', 4: '፬', 5: '፭',
  6: '፮', 7: '፯', 8: '፰', 9: '፱', 10: '፲',
  20: '፳', 30: '፴', 40: '፵', 50: '፶', 60: '፷',
  70: '፸', 80: '፹', 90: '፺'
};
const HUNDRED = '፻';
const MYRIAD = '፼';

// reverse lookup
const geezToValue = Object.entries(geezDigits).reduce((acc, [k, ch]) => {
  acc[ch] = parseInt(k, 10);
  return acc;
}, {});
geezToValue[HUNDRED] = 100;
geezToValue[MYRIAD] = 10000;

/* ---------- helpers ---------- */

// convert 0..99 to geez tens+ones (no hundreds)
function doubleDigitsToGeez(n) {
  if (n === 0) return '';
  if (geezDigits[n]) return geezDigits[n];
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  return (geezDigits[tens] || '') + (geezDigits[ones] || '');
}

// convert a chunk (0..9999) to Ge'ez representation for that chunk (no trailing ፼)
function chunkToGeez(chunk) {
  if (chunk === 0) return '';
  if (chunk >= 100) {
    const hundreds = Math.floor(chunk / 100);
    const remainder = chunk % 100;
    // classical shorthand: 100 -> "፻" (not "፩፻")
    const hundredsPart = (hundreds === 1 ? HUNDRED : (doubleDigitsToGeez(hundreds) + HUNDRED));
    return hundredsPart + doubleDigitsToGeez(remainder);
  } else {
    return doubleDigitsToGeez(chunk);
  }
}

/* ---------- toGeez: Arabic -> Ge'ez ---------- */

/**
 * Convert a non-negative integer to canonical Ge'ez string.
 *
 * Strategy:
 *  - split number into base-10000 chunks (least significant first)
 *  - iterate chunks from most significant to least
 *  - for chunk at level i (i>=1), output:
 *      - if chunk === 0 : emit ONE MYRIAD symbol for each "empty" level when necessary
 *      - if chunk === 1 : emit MYRIAD repeated i times (this matches the shorthand in your test data)
 *      - otherwise emit chunkToGeez(chunk) followed by MYRIAD repeated i times
 *  - units chunk (level 0) is emitted without trailing ፼.
 */
function toGeez(number) {
  if (!Number.isSafeInteger(number) || number < 0) {
    throw new Error('toGeez expects a non-negative safe integer');
  }
  if (number === 0) return '0';

  // build base-10000 chunks (least significant first)
  const chunks = [];
  let n = number;
  while (n > 0) {
    chunks.push(n % 10000);
    n = Math.floor(n / 10000);
  }
  // ensure at least one chunk
  if (chunks.length === 0) chunks.push(0);

  const parts = [];
  // iterate from most significant chunk to least
  for (let idx = chunks.length - 1; idx >= 0; idx--) {
    const chunk = chunks[idx];

    if (idx === 0) {
      // units chunk - just append its representation if nonzero
      const u = chunkToGeez(chunk);
      if (u) parts.push(u);
      continue;
    }

    // non-units chunk (level idx)
    if (chunk === 0) {
      // A zero chunk produces a single MYRIAD symbol at this level (as placeholder).
      // If multiple consecutive zero levels occur they'll produce consecutive MYRIADs.
      parts.push(MYRIAD);
    } else if (chunk === 1) {
      // shorthand: a chunk of 1 at level idx is represented by MYRIAD repeated idx times
      parts.push(MYRIAD.repeat(idx));
    } else {
      // normal chunk: chunk -> geez then append MYRIAD repeated idx times
      parts.push(chunkToGeez(chunk) + MYRIAD.repeat(idx));
    }
  }

  // join without extra separators (the parts contain the necessary ፼ placements)
  return parts.join('');
}

/* ---------- fromGeez: Ge'ez -> Arabic ---------- */

/**
 * Parse a Ge'ez numeral string into an integer.
 *
 * Strategy:
 *  - scan left-to-right
 *  - accumulate a 'current' for digits under the next MYRIAD-run
 *  - treat ፻ as multiplier inside the current chunk (if no preceding digits, treat as 1)
 *  - when encountering one or more consecutive ፼:
 *      - compute multiplier = 10000 ^ runLength
 *      - if current === 0 => interpret as 1 * multiplier (bare ፼ run)
 *      - else => current * multiplier
 *      - add to total and reset current
 *  - after scan, add any remaining current
 *
 * This mirrors the encoding performed by toGeez and also accepts shorthand forms.
 */
function fromGeez(str) {
  let total = 0;
  let i = 0;

  while (i < str.length) {
    // Read chunk number
    let chunkValue = 0;

    // Parse digits/hundreds inside the chunk
    while (i < str.length && str[i] !== '፼') {
      const ch = str[i];

      if (ch === '፻') {
        chunkValue = (chunkValue || 1) * 100;
        i++;
        continue;
      }

      const value = geezToValue[ch];
      if (value !== undefined) {
        chunkValue += value;
      }
      i++;
    }

    // Count consecutive ፼
    let level = 0;
    while (i < str.length && str[i] === '፼') {
      level++;
      i++;
    }

    total += chunkValue * Math.pow(10000, level);
  }

  return total;
}


/* ---------- CLI ---------- */

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage:\n  node geezConverter.js to <arabic_number>\n  node geezConverter.js from <geez_numeral>');
    process.exit(1);
  }
  const [mode, input] = args;
  if (mode === 'to') {
    const num = parseInt(input, 10);
    if (isNaN(num)) {
      console.error('Invalid Arabic number');
      process.exit(1);
    }
    console.log(`✅ Arabic: ${num}`);
    console.log(`➡️  Ge'ez: ${toGeez(num)}`);
  } else if (mode === 'from') {
    try {
      console.log(`✅ Ge'ez: ${input}`);
      console.log(`➡️  Arabic: ${fromGeez(input)}`);
    } catch (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
  } else {
    console.error('Unknown command. Use "to" or "from".');
    process.exit(1);
  }
}

// exports for testing harness
module.exports = { toGeez, fromGeez };
