/* Inline SVG icon set used across the site (no font/icon dependency). */

export function Arrow({ size = 15 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUp({ size = 14 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function Star({ size = 15 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5l2.7 6.9 6.9 2.6-6.9 2.7L12 20.6l-2.7-6.9-6.9-2.7 6.9-2.6z" />
    </svg>
  );
}

export function Crown({ size = 28 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 7.5l4.6 3.6L12 4.5l5.4 6.6L22 7.5l-2 10.5H4L2 7.5z" />
      <rect x="3.8" y="19" width="16.4" height="2.6" rx="1.3" />
    </svg>
  );
}

export function Wave({ size = 24 }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3v9a5 5 0 0 0 5 5h6" />
      <path d="M14 13l4 4-4 4" />
    </svg>
  );
}

export function Squiggle({ width = 60, height = 14 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 60 14" fill="none" stroke="#FF3D00" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M2 10 L18 3 L28 10 L56 2" />
    </svg>
  );
}

export function NoteArrow({ size = 20 }) {
  return (
    <svg className="ico i" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h9a5 5 0 0 1 5 5v6" />
      <path d="M13 13l4 4 4-4" />
    </svg>
  );
}

export function Smile({ size = 18 }) {
  return (
    <svg className="ico i" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M7.8 13.6c1.1 1.7 2.5 2.6 4.2 2.6s3.1-.9 4.2-2.6" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </svg>
  );
}

const brandPaths = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.295-1.552 3.3-1.23 3.3-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

export function BrandIcon({ name, size = 19 }) {
  if (name === "instagram") {
    return (
      <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.741 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.479 1.382.9.421.42.68.819.9 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.013 3.585-.07 4.85c-.053 1.17-.249 1.805-.413 2.227-.217.561-.479.96-.9 1.381-.421.421-.819.681-1.381.9-.42.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.013-4.85-.07c-1.17-.053-1.805-.249-2.227-.413-.561-.217-.96-.479-1.381-.9-.421-.421-.681-.819-.9-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.013-3.585.07-4.85c.053-1.17.249-1.805.413-2.227.217-.561.479-.96.9-1.381.42-.421.819-.681 1.381-.9.422-.164 1.057-.36 2.227-.413 1.266-.055 1.646-.071 4.85-.071zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
      </svg>
    );
  }
  const d = brandPaths[name] || brandPaths.github;
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* Small brand marks used inside skill tags (known names only). */
const skillMarks = {
  "Next.js": (
    <>
      <circle cx="12" cy="12" r="11" fill="#fff" />
      <path fill="#000" d="M7.5 7h2.3l4.4 6.2V7h2.3v10h-2.3L9.8 10.8V17H7.5z" />
    </>
  ),
  React: (
    <g fill="none">
      <g stroke="#61DAFB" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="2.3" fill="#61DAFB" />
    </g>
  ),
  "Node.js": <path d="M12 1.6l9 5.2v10.4l-9 5.2-9-5.2V6.8z" fill="none" stroke="#5FA04E" strokeWidth="2" strokeLinejoin="round" />,
  MongoDB: (
    <>
      <path fill="#47A248" d="M12 1.5c3.4 3.6 6 7.4 6 12.1 0 4.3-2.4 7.4-5.2 8.9l-.8.5-.8-.5C8.4 21 6 17.9 6 13.6 6 8.9 8.6 5.1 12 1.5z" />
      <path d="M12 4.5v17.2" stroke="#0B2E13" strokeWidth="1.4" fill="none" />
    </>
  ),
  Figma: (
    <g transform="translate(4 0)">
      <path fill="#F24E1E" d="M8 0H4a4 4 0 0 0 0 8h4z" />
      <path fill="#FF7262" d="M8 0h4a4 4 0 0 1 0 8H8z" />
      <path fill="#A259FF" d="M8 8H4a4 4 0 0 0 0 8h4z" />
      <circle cx="12" cy="12" r="4" fill="#1ABCFE" />
      <path fill="#0ACF83" d="M8 16H4a4 4 0 0 0 0 8h4z" />
    </g>
  ),
  Photoshop: (
    <>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#001E36" />
      <text x="12" y="16.3" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="700" fill="#31A8FF">Ps</text>
    </>
  ),
  Illustrator: (
    <>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#330000" />
      <text x="12" y="16.3" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="700" fill="#FF9A00">Ai</text>
    </>
  ),
  Canva: (
    <>
      <defs>
        <linearGradient id="cvGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#00C4CC" />
          <stop offset="1" stopColor="#7D2AE8" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill="url(#cvGrad)" />
      <text x="12" y="16.5" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="13" fontWeight="700" fill="#fff">C</text>
    </>
  ),
  "Premiere Pro": (
    <>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#2A0634" />
      <text x="12" y="16.3" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="700" fill="#9999FF">Pr</text>
    </>
  ),
  "After Effects": (
    <>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#00005B" />
      <text x="12" y="16.3" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="11" fontWeight="700" fill="#9999FF">Ae</text>
    </>
  ),
  "DaVinci Resolve": (
    <>
      <circle cx="12" cy="12" r="11" fill="#0D0D0D" />
      <path fill="#E44C4C" d="M12 12 12 3A9 9 0 0 1 21 12Z" />
      <path fill="#F2C94C" d="M12 12h9a9 9 0 0 1-9 9Z" />
      <path fill="#4FCC6B" d="M12 12v9a9 9 0 0 1-9-9Z" />
      <path fill="#4C9AE4" d="M12 12H3a9 9 0 0 1 9-9Z" />
      <circle cx="12" cy="12" r="3.4" fill="#0D0D0D" />
      <circle cx="12" cy="12" r="1.4" fill="#fff" />
    </>
  ),
  CapCut: (
    <>
      <rect width="24" height="24" rx="6" fill="#111" />
      <path d="M16.8 7.6A6.5 6.5 0 1 0 17 15.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 16.5 16 7.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  Git: (
    <>
      <path fill="#F05032" d="M12 1.2 22.8 12 12 22.8 1.2 12z" />
      <g fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
        <path d="M11.5 6.4V17.6" />
        <path d="M11.5 12c0 2.5 2 4 4.9 4" />
      </g>
      <circle cx="11.5" cy="6.4" r="2" fill="#fff" />
      <circle cx="11.5" cy="17.6" r="2" fill="#fff" />
      <circle cx="16.4" cy="16" r="2" fill="#fff" />
    </>
  ),
  "VS Code": (
    <>
      <circle cx="12" cy="12" r="11" fill="#007ACC" />
      <path d="M9.6 8.4 6 12l3.6 3.6M14.4 8.4 18 12l-3.6 3.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  Linux: (
    <>
      <ellipse cx="12" cy="11.6" rx="7" ry="9.2" fill="#1B1B1B" />
      <ellipse cx="12" cy="15" rx="4.6" ry="5.2" fill="#fff" />
      <circle cx="9.4" cy="7.2" r="1.4" fill="#fff" />
      <circle cx="14.6" cy="7.2" r="1.4" fill="#fff" />
      <circle cx="9.6" cy="7.4" r=".7" fill="#1B1B1B" />
      <circle cx="14.4" cy="7.4" r=".7" fill="#1B1B1B" />
      <path d="M10.7 9.4h2.6L12 11.6z" fill="#F5A623" />
      <ellipse cx="8.4" cy="21.2" rx="2.7" ry="1.4" fill="#F5A623" />
      <ellipse cx="15.6" cy="21.2" rx="2.7" ry="1.4" fill="#F5A623" />
    </>
  ),
};

export function SkillMark({ name, size = 14 }) {
  const mark = skillMarks[name];
  if (!mark) {
    return (
      <svg className="ico" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="rgba(200,255,0,.35)" />
      </svg>
    );
  }
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {mark}
    </svg>
  );
}

export function ServiceIcon({ name, size = 18 }) {
  if (name === "camera") {
    return (
      <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    );
  }
  if (name === "play") {
    return (
      <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.5 4.8v14.4L19.5 12z" />
      </svg>
    );
  }
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}
