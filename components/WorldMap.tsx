'use client';
import { motion } from 'framer-motion';

// ─── Mercator helpers ─────────────────────────────────────────────────────────
// viewBox: 0 0 1000 500
// x = (lon + 180) * (1000 / 360)
// y = (90  - lat) * (500 / 180)

export default function WorldMap() {
  return (
    <div
      className="w-full aspect-[2/1] relative rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl"
      style={{ background: '#050d1a' }}
    >
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dot grid */}
          <pattern id="wm-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(100,255,218,0.18)" />
          </pattern>
          {/* Arc gradient: India (teal) → USA (indigo) */}
          <linearGradient id="arc-grad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="#64ffda" stopOpacity="1" />
            <stop offset="40%"  stopColor="#64ffda" stopOpacity="0.7" />
            <stop offset="70%"  stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
          </linearGradient>
          {/* Pulse gradient for moving dash */}
          <linearGradient id="dash-grad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="#64ffda" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          {/* India glow filter */}
          <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* USA glow filter */}
          <filter id="glow-indigo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background dot grid */}
        <rect width="1000" height="500" fill="url(#wm-dots)" />

        {/* ── LANDMASSES ───────────────────────────────────────────────────── */}
        <g
          fill="rgba(13,25,48,0.92)"
          stroke="rgba(100,255,218,0.18)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        >
          {/* ── GREENLAND ── */}
          <path d="M 288,30 L 310,22 L 338,20 L 360,28 L 372,42 L 368,62 L 350,75 L 325,82 L 302,72 L 288,54 Z" />

          {/* ── CANADA ── */}
          <path d="M 128,103 L 145,88 L 162,75 L 185,65 L 215,60 L 245,58 L 268,62 L 285,75 L 285,90 L 295,98 L 312,98 L 318,105 L 308,115 L 295,118 L 282,118 L 268,112 L 250,112 L 232,115 L 215,115 L 198,112 L 182,112 L 165,112 L 148,110 Z" />

          {/* ── USA CONTINENTAL ── */}
          <path d="
            M 128,110  L 148,110  L 165,112  L 182,112  L 198,112
            L 215,115  L 232,115  L 250,112  L 265,112  L 278,118
            L 290,120  L 305,118  L 312,110  L 316,108
            L 315,120  L 313,132  L 308,142  L 306,152
            L 310,158  L 315,162  L 318,170  L 312,175  L 308,178
            L 300,183  L 295,190  L 292,198  L 286,204  L 282,202
            L 279,196  L 278,190  L 276,184  L 280,178  L 282,172
            L 278,175  L 272,180  L 265,182  L 258,182
            L 248,182  L 240,180  L 228,177  L 218,174
            L 208,174  L 198,172  L 185,170  L 172,168
            L 165,163  L 162,158  L 162,142  L 162,128
            L 160,118  L 148,112  L 132,110 Z
          " />

          {/* ── ALASKA ── */}
          <path d="M 48,95 L 62,88 L 78,84 L 95,86 L 105,95 L 98,108 L 80,112 L 62,110 L 50,102 Z" />

          {/* ── MEXICO + CENTRAL AMERICA ── */}
          <path d="
            M 172,168  L 185,170  L 198,172  L 210,174  L 218,174
            L 225,178  L 228,185  L 222,192  L 215,198
            L 208,205  L 200,210  L 195,218  L 190,225
            L 183,228  L 178,222  L 175,215  L 172,208
            L 168,200  L 165,192  L 165,182  L 165,173 Z
          " />

          {/* ── CUBA + CARIBBEAN (simplified) ── */}
          <path d="M 265,195 L 285,192 L 295,198 L 285,202 L 268,200 Z" />

          {/* ── SOUTH AMERICA ── */}
          <path d="
            M 212,235  L 228,228  L 248,228  L 262,235
            L 272,248  L 278,265  L 288,285  L 295,308
            L 302,335  L 305,358  L 300,382  L 290,405
            L 278,428  L 260,448  L 245,455  L 232,448
            L 218,428  L 208,402  L 200,372  L 196,342
            L 198,315  L 205,292  L 210,268  L 212,248 Z
          " />

          {/* ── ICELAND ── */}
          <path d="M 418,72 L 435,68 L 448,72 L 445,82 L 430,85 L 418,80 Z" />

          {/* ── UK + IRELAND ── */}
          <path d="M 443,108 L 452,102 L 460,104 L 462,112 L 458,120 L 450,122 L 443,116 Z" />
          <path d="M 436,108 L 442,104 L 444,112 L 438,115 L 434,110 Z" />

          {/* ── SCANDINAVIA ── */}
          <path d="
            M 480,72  L 490,62  L 498,58  L 508,60  L 515,68
            L 512,80  L 505,90  L 498,98  L 490,100  L 482,95
            L 478,85 Z
          " />
          {/* Finland */}
          <path d="M 516,65 L 528,58 L 540,60 L 538,75 L 530,82 L 518,80 L 514,70 Z" />

          {/* ── WESTERN EUROPE ── */}
          {/* Iberian Peninsula (Spain + Portugal) */}
          <path d="M 442,135 L 462,128 L 480,130 L 488,140 L 485,152 L 472,158 L 455,158 L 443,150 L 440,140 Z" />
          {/* France */}
          <path d="M 462,120 L 480,118 L 496,122 L 502,132 L 495,142 L 482,145 L 468,142 L 460,132 Z" />
          {/* Italy */}
          <path d="M 496,130 L 508,125 L 518,128 L 520,138 L 515,148 L 508,158 L 502,168 L 496,175 L 490,162 L 492,150 L 495,140 Z" />
          {/* Germany + Benelux */}
          <path d="M 490,112 L 508,108 L 520,112 L 525,122 L 518,130 L 505,130 L 495,125 Z" />
          {/* Poland + Czechia */}
          <path d="M 522,108 L 542,105 L 555,108 L 555,118 L 545,125 L 530,125 L 520,118 Z" />
          {/* Balkans */}
          <path d="M 508,135 L 525,130 L 538,132 L 545,142 L 540,155 L 525,158 L 512,152 L 506,142 Z" />
          {/* Greece */}
          <path d="M 518,152 L 530,148 L 538,155 L 535,165 L 525,168 L 515,162 Z" />

          {/* ── RUSSIA (simplified — enormous) ── */}
          <path d="
            M 545,105  L 562,98   L 582,90   L 610,78   L 645,68
            L 680,60   L 720,55   L 760,52   L 800,52   L 840,55
            L 875,60   L 905,68   L 930,78   L 948,90
            L 942,105  L 922,112  L 900,115  L 875,112
            L 850,108  L 820,108  L 800,112  L 775,115
            L 752,115  L 730,115  L 712,118  L 695,115
            L 678,112  L 660,112  L 640,115  L 618,118
            L 600,120  L 580,122  L 562,120  L 548,115 Z
          " />

          {/* ── UKRAINE + BELARUS ── */}
          <path d="M 548,115 L 565,112 L 582,112 L 595,118 L 592,128 L 578,132 L 560,130 L 548,122 Z" />

          {/* ── TURKEY ── */}
          <path d="M 538,148 L 558,142 L 582,140 L 605,142 L 618,148 L 612,158 L 595,162 L 572,162 L 550,158 L 538,152 Z" />

          {/* ── CAUCASUS + IRAN ── */}
          <path d="M 570,158 L 595,155 L 618,150 L 638,148 L 655,152 L 665,162 L 660,175 L 645,182 L 628,185 L 608,182 L 590,178 L 575,170 Z" />

          {/* ── IRAQ + SYRIA + LEBANON ── */}
          <path d="M 555,158 L 572,155 L 590,158 L 595,168 L 588,178 L 572,182 L 558,178 L 550,168 Z" />

          {/* ── SAUDI ARABIA + ARABIA ── */}
          <path d="
            M 560,175  L 578,170  L 600,168  L 620,170
            L 638,175  L 648,188  L 645,205  L 635,218
            L 618,228  L 598,232  L 578,228  L 562,215
            L 552,200  L 552,188 Z
          " />

          {/* ── PAKISTAN ── */}
          <path d="
            M 648,148  L 665,142  L 682,140  L 692,148
            L 692,158  L 685,168  L 672,172  L 658,168
            L 648,160 Z
          " />

          {/* ── AFGHANISTAN ── */}
          <path d="M 648,140 L 665,135 L 682,135 L 688,142 L 682,148 L 665,148 L 650,145 Z" />

          {/* ── INDIA (key shape — triangle pointing south) ── */}
          <path
            d="
              M 685,155  L 695,148  L 706,145  L 718,146
              L 730,148  L 742,152  L 752,158  L 758,165
              L 755,172  L 748,178  L 742,185
              L 738,192  L 734,200  L 730,208
              L 726,215  L 722,220  L 718,226
              L 715,231  L 714,235
              L 710,228  L 706,220  L 702,212
              L 698,202  L 695,192  L 692,180
              L 688,168  L 685,158 Z
            "
            fill="rgba(100,255,218,0.08)"
            stroke="rgba(100,255,218,0.35)"
            strokeWidth="1.2"
          />

          {/* ── SRI LANKA ── */}
          <path d="M 720,240 L 726,238 L 728,245 L 722,248 L 718,244 Z" />

          {/* ── CHINA ── */}
          <path d="
            M 700,115  L 718,110  L 740,108  L 762,108
            L 782,110  L 802,115  L 820,118  L 835,125
            L 840,135  L 835,145  L 822,152
            L 808,158  L 790,162  L 772,162
            L 758,158  L 748,152  L 750,142
            L 745,132  L 735,125  L 720,120
            L 705,120 Z
          " />

          {/* ── MONGOLIA ── */}
          <path d="M 720,108 L 740,100 L 768,98 L 795,100 L 808,108 L 800,115 L 778,118 L 752,118 L 730,115 Z" />

          {/* ── KOREA + JAPAN ── */}
          <path d="M 832,130 L 842,125 L 852,128 L 850,138 L 840,140 L 832,136 Z" />
          {/* Japan */}
          <path d="M 858,115 L 870,110 L 882,112 L 888,120 L 882,128 L 870,130 L 858,124 Z" />
          <path d="M 875,130 L 885,128 L 890,136 L 882,140 L 874,136 Z" />

          {/* ── SE ASIA (simplified) ── */}
          {/* Myanmar + Thailand + Indochina */}
          <path d="
            M 758,162  L 772,160  L 785,162  L 795,170
            L 798,182  L 792,195  L 782,205  L 770,210
            L 760,205  L 754,195  L 752,182  L 754,170 Z
          " />
          {/* Malaysia + Indonesia (west) */}
          <path d="M 780,215 L 800,212 L 818,215 L 822,225 L 810,228 L 795,226 L 780,222 Z" />
          {/* Borneo */}
          <path d="M 820,218 L 842,215 L 858,220 L 862,232 L 850,240 L 832,238 L 818,228 Z" />
          {/* Java */}
          <path d="M 798,248 L 822,244 L 848,246 L 852,254 L 830,256 L 806,254 Z" />
          {/* Philippines */}
          <path d="M 850,182 L 862,178 L 870,185 L 865,195 L 855,198 L 848,190 Z" />

          {/* ── AFRICA ── */}
          <path d="
            M 440,198  L 460,192  L 478,188  L 498,188
            L 518,190  L 538,195  L 548,205
            L 545,218  L 538,232  L 535,248  L 535,265
            L 538,282  L 538,298  L 535,315
            L 528,332  L 518,352  L 508,372
            L 495,392  L 482,412  L 468,432
            L 455,445  L 440,448
            L 428,435  L 418,415  L 410,392
            L 406,368  L 408,342  L 412,315
            L 416,292  L 418,268  L 420,248
            L 422,228  L 425,212  L 430,200 Z
          " />
          {/* Egypt + N.Africa extension */}
          <path d="M 538,195 L 555,188 L 572,185 L 590,185 L 595,195 L 585,205 L 568,208 L 548,205 Z" />
          {/* Madagascar */}
          <path d="M 570,335 L 580,325 L 590,330 L 592,348 L 582,358 L 568,352 L 565,338 Z" />

          {/* ── AUSTRALIA ── */}
          <path d="
            M 800,358  L 822,350  L 848,345  L 872,342
            L 895,345  L 915,352  L 928,365  L 930,380
            L 925,398  L 912,412  L 895,420  L 872,422
            L 848,418  L 828,410  L 812,398  L 802,382
            L 798,368 Z
          " />
          {/* Tasmania */}
          <path d="M 882,428 L 892,424 L 898,432 L 890,438 L 882,434 Z" />
          {/* New Zealand */}
          <path d="M 942,398 L 950,390 L 958,395 L 955,410 L 946,415 L 940,408 Z" />
          <path d="M 948,418 L 956,412 L 962,418 L 958,428 L 950,430 L 945,424 Z" />
        </g>

        {/* ── HIGHLIGHTED: INDIA ── */}
        <g filter="url(#glow-teal)">
          <path
            d="
              M 685,155  L 695,148  L 706,145  L 718,146
              L 730,148  L 742,152  L 752,158  L 758,165
              L 755,172  L 748,178  L 742,185
              L 738,192  L 734,200  L 730,208
              L 726,215  L 722,220  L 718,226
              L 715,231  L 714,235
              L 710,228  L 706,220  L 702,212
              L 698,202  L 695,192  L 692,180
              L 688,168  L 685,158 Z
            "
            fill="rgba(100,255,218,0.10)"
            stroke="#64ffda"
            strokeWidth="1.5"
          />
        </g>

        {/* ── HIGHLIGHTED: USA ── */}
        <g filter="url(#glow-indigo)">
          <path
            d="
              M 128,110  L 148,110  L 165,112  L 182,112  L 198,112
              L 215,115  L 232,115  L 250,112  L 265,112  L 278,118
              L 290,120  L 305,118  L 312,110  L 316,108
              L 315,120  L 313,132  L 308,142  L 306,152
              L 310,158  L 315,162  L 318,170  L 312,175  L 308,178
              L 300,183  L 295,190  L 292,198  L 286,204  L 282,202
              L 279,196  L 278,190  L 276,184  L 280,178  L 282,172
              L 278,175  L 272,180  L 265,182  L 258,182
              L 248,182  L 240,180  L 228,177  L 218,174
              L 208,174  L 198,172  L 185,170  L 172,168
              L 165,163  L 162,158  L 162,142  L 162,128
              L 160,118  L 148,112  L 132,110 Z
            "
            fill="rgba(129,140,248,0.10)"
            stroke="#818cf8"
            strokeWidth="1.5"
          />
        </g>

        {/* ── ARC: Mumbai → Buffalo ───────────────────────────────────────── */}
        {/* Base arc (static, low opacity) */}
        <path
          d="M 714,210 C 590,18 380,18 280,131"
          fill="none"
          stroke="url(#arc-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Animated arc draw-on */}
        <motion.path
          d="M 714,210 C 590,18 380,18 280,131"
          fill="none"
          stroke="url(#arc-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Moving dash pulse */}
        <motion.path
          d="M 714,210 C 590,18 380,18 280,131"
          fill="none"
          stroke="url(#dash-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="30 180"
          animate={{ strokeDashoffset: [0, -210] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
          opacity="0.9"
        />

        {/* ── INDIA PIN ── */}
        {/* Outer pulse ring */}
        <motion.circle
          cx="714" cy="210"
          r="14"
          fill="none"
          stroke="rgba(100,255,218,0.5)"
          strokeWidth="1"
          animate={{ r: [10, 22], opacity: [0.7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
        />
        {/* Inner dot */}
        <circle cx="714" cy="210" r="5" fill="#64ffda" style={{ filter: 'drop-shadow(0 0 6px #64ffda)' }} />
        <circle cx="714" cy="210" r="2.5" fill="#050d1a" />
        {/* Label */}
        <text x="724" y="207" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#64ffda">INDIA</text>
        <text x="724" y="217" fontFamily="monospace" fontSize="7.5" fill="rgba(100,255,218,0.55)">Mumbai</text>

        {/* ── USA / BUFFALO PIN ── */}
        <motion.circle
          cx="280" cy="131"
          r="14"
          fill="none"
          stroke="rgba(129,140,248,0.5)"
          strokeWidth="1"
          animate={{ r: [10, 22], opacity: [0.7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: 0.5 }}
        />
        <circle cx="280" cy="131" r="5" fill="#818cf8" style={{ filter: 'drop-shadow(0 0 6px #818cf8)' }} />
        <circle cx="280" cy="131" r="2.5" fill="#050d1a" />
        {/* Label — placed to left to avoid crowding */}
        <text x="192" y="128" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#818cf8">USA</text>
        <text x="192" y="138" fontFamily="monospace" fontSize="7.5" fill="rgba(129,140,248,0.55)">Buffalo, NY</text>
      </svg>
    </div>
  );
}