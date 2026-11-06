'use strict';
/* =========================================================
   Louie's buddies – original characters inspired by the
   things he loves (no real characters, names or logos).
   ========================================================= */

const HERO_SVG = `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="hero-head"><circle cx="100" cy="68" r="50"/></clipPath></defs>
  <ellipse cx="100" cy="213" rx="52" ry="6" fill="rgba(0,0,0,.12)"/>
  <line x1="86" y1="172" x2="84" y2="200" stroke="#4C7FE0" stroke-width="20" stroke-linecap="round"/>
  <line x1="114" y1="172" x2="116" y2="200" stroke="#4C7FE0" stroke-width="20" stroke-linecap="round"/>
  <ellipse cx="82" cy="206" rx="15" ry="8" fill="#EF6F57"/>
  <ellipse cx="118" cy="206" rx="15" ry="8" fill="#EF6F57"/>
  <line x1="68" y1="126" x2="46" y2="160" stroke="#4C7FE0" stroke-width="18" stroke-linecap="round"/>
  <circle cx="45" cy="163" r="10" fill="#EF6F57"/>
  <g class="wave-arm">
    <line x1="132" y1="126" x2="160" y2="90" stroke="#4C7FE0" stroke-width="18" stroke-linecap="round"/>
    <circle cx="162" cy="86" r="10" fill="#EF6F57"/>
  </g>
  <rect x="62" y="112" width="76" height="68" rx="28" fill="#4C7FE0"/>
  <path d="M67 128 Q67 114 82 113 L118 113 Q133 114 133 128 L127 160 Q100 172 73 160 Z" fill="#EF6F57"/>
  <g stroke="#1b1b2f" stroke-width="2" stroke-linecap="round">
    <line x1="94" y1="134" x2="86" y2="128"/><line x1="94" y1="138" x2="85" y2="138"/><line x1="94" y1="142" x2="86" y2="148"/>
    <line x1="106" y1="134" x2="114" y2="128"/><line x1="106" y1="138" x2="115" y2="138"/><line x1="106" y1="142" x2="114" y2="148"/>
  </g>
  <ellipse cx="100" cy="138" rx="6" ry="9" fill="#1b1b2f"/>
  <circle cx="100" cy="68" r="50" fill="#EF6F57"/>
  <g clip-path="url(#hero-head)" stroke="#C9513C" stroke-width="1.6" fill="none" opacity=".7">
    <circle cx="100" cy="74" r="16"/><circle cx="100" cy="74" r="31"/><circle cx="100" cy="74" r="46"/>
    <line x1="100" y1="74" x2="100" y2="10"/><line x1="100" y1="74" x2="150" y2="30"/><line x1="100" y1="74" x2="165" y2="80"/>
    <line x1="100" y1="74" x2="140" y2="130"/><line x1="100" y1="74" x2="60" y2="130"/><line x1="100" y1="74" x2="35" y2="80"/>
    <line x1="100" y1="74" x2="50" y2="30"/>
  </g>
  <path d="M66 60 Q78 42 95 62 Q86 78 70 72 Z" fill="#fff" stroke="#1b1b2f" stroke-width="4" stroke-linejoin="round"/>
  <path d="M134 60 Q122 42 105 62 Q114 78 130 72 Z" fill="#fff" stroke="#1b1b2f" stroke-width="4" stroke-linejoin="round"/>
  <path d="M86 96 Q100 106 114 96" stroke="#A8402F" stroke-width="3.5" fill="none" stroke-linecap="round"/>
</svg>`;

const BEAR_SVG = `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="213" rx="62" ry="6" fill="rgba(0,0,0,.12)"/>
  <ellipse cx="100" cy="158" rx="60" ry="52" fill="#8B5A2B"/>
  <ellipse cx="100" cy="166" rx="36" ry="33" fill="#D9A86C"/>
  <ellipse cx="72" cy="204" rx="21" ry="11" fill="#7A4D24"/>
  <ellipse cx="128" cy="204" rx="21" ry="11" fill="#7A4D24"/>
  <ellipse cx="72" cy="205" rx="10" ry="5" fill="#E6C08F"/>
  <ellipse cx="128" cy="205" rx="10" ry="5" fill="#E6C08F"/>
  <ellipse cx="46" cy="150" rx="15" ry="28" fill="#7A4D24" transform="rotate(25 46 150)"/>
  <g class="wave-arm"><ellipse cx="158" cy="118" rx="15" ry="28" fill="#7A4D24" transform="rotate(-35 158 118)"/></g>
  <circle cx="58" cy="32" r="19" fill="#8B5A2B"/><circle cx="58" cy="32" r="10" fill="#D9A86C"/>
  <circle cx="142" cy="32" r="19" fill="#8B5A2B"/><circle cx="142" cy="32" r="10" fill="#D9A86C"/>
  <circle cx="100" cy="72" r="50" fill="#8B5A2B"/>
  <path d="M74 52 Q80 47 86 52 M114 52 Q120 47 126 52" stroke="#4A2E14" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="64" r="7" fill="#2B1A10"/><circle cx="82" cy="61" r="2.5" fill="#fff"/>
  <circle cx="120" cy="64" r="7" fill="#2B1A10"/><circle cx="122" cy="61" r="2.5" fill="#fff"/>
  <ellipse cx="100" cy="92" rx="27" ry="21" fill="#E6C08F"/>
  <circle cx="68" cy="86" r="7" fill="#F28C8C" opacity=".55"/><circle cx="132" cy="86" r="7" fill="#F28C8C" opacity=".55"/>
  <ellipse cx="100" cy="82" rx="11" ry="8" fill="#2B1A10"/>
  <ellipse cx="96" cy="79" rx="3.5" ry="2" fill="#fff" opacity=".6"/>
  <path d="M100 90 L100 96 M87 96 Q100 109 113 96" stroke="#2B1A10" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

function critter(x, y, s, col, dark) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="-14" cy="44" rx="13" ry="6" fill="${dark}"/><ellipse cx="14" cy="44" rx="13" ry="6" fill="${dark}"/>
    <ellipse cx="-25" cy="-36" rx="9" ry="13" fill="${dark}"/><ellipse cx="25" cy="-36" rx="9" ry="13" fill="${dark}"/>
    <ellipse cx="0" cy="0" rx="40" ry="46" fill="${col}"/>
    <path d="M-12 -43 L-6 -58 L0 -45 L7 -60 L12 -43 Z" fill="${col}"/>
    <ellipse cx="0" cy="15" rx="26" ry="27" fill="#F4F8FF"/>
    <circle cx="-14" cy="-12" r="13" fill="#fff"/><circle cx="14" cy="-12" r="13" fill="#fff"/>
    <circle cx="-11" cy="-10" r="6.5" fill="#1b1b2f"/><circle cx="17" cy="-10" r="6.5" fill="#1b1b2f"/>
    <circle cx="-9" cy="-13" r="2" fill="#fff"/><circle cx="19" cy="-13" r="2" fill="#fff"/>
    <ellipse cx="2" cy="5" rx="6" ry="4" fill="#F27C9B"/>
    <rect x="-4.5" y="11" width="5.5" height="9" rx="1.5" fill="#fff" stroke="#c9cfe0"/>
    <rect x="1.5" y="11" width="5.5" height="9" rx="1.5" fill="#fff" stroke="#c9cfe0"/>
  </g>`;
}
const CRITTERS_SVG = `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="196" rx="86" ry="7" fill="rgba(0,0,0,.12)"/>
  ${critter(48, 148, 0.72, '#5E97D1', '#3F74AE')}
  ${critter(154, 150, 0.68, '#86BDEB', '#5A90C4')}
  <g class="wave-arm">${critter(100, 124, 0.95, '#6FA8DC', '#4A82BC')}</g>
</svg>`;

// Christmas: a floppy Santa hat on every buddy
function santaHat(x, y, s, r) {
  return `<g class="santa-hat" transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
    <path d="M-44 4 C-36 -40 -6 -66 26 -66 C44 -64 52 -50 46 -38 C36 -46 22 -40 22 -20 C22 -8 30 0 36 4 Z" fill="#E8434F"/>
    <path d="M-30 -10 C-20 -40 0 -56 22 -58" stroke="#FF7A84" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
    <rect x="-50" y="-6" width="92" height="20" rx="10" fill="#fff"/>
    <circle cx="48" cy="-40" r="11" fill="#fff"/>
  </g>`;
}
const withHat = (svg, hat) => svg.replace(/<\/svg>\s*$/, hat + '</svg>');

const MASCOTS = {
  hero: { name: 'Webster', title: 'the web hero', phrase: 'c_hero', hi: 'hi_hero', svg: withHat(HERO_SVG, santaHat(98, 26, 0.85, -8)) },
  bear: { name: 'Bruno', title: 'the bear', phrase: 'c_bear', hi: 'hi_bear', svg: withHat(BEAR_SVG, santaHat(100, 30, 0.8, -4)) },
  critters: { name: 'The Nibblers', title: 'cheeky critters', phrase: 'c_critters', hi: 'hi_critters', svg: withHat(CRITTERS_SVG, santaHat(100, 70, 0.6, -6)) },
};
const currentMascot = () => MASCOTS[Store.state.mascot] || MASCOTS.bear;
