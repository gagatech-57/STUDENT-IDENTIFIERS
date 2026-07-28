import React from 'react';

export function Su57Loader({ text = "INITIALIZING SU-57 TACTICAL DATALINK...", subtext = "5TH-GEN STEALTH IDENTIFIER VAULT // MACH 2.25" }) {
  return (
    <div className="su57-loader-overlay">
      <div className="su57-hud-container">
        {/* Radar Circular Grid Lines */}
        <div className="hud-radar-circle circle-1"></div>
        <div className="hud-radar-circle circle-2"></div>
        <div className="hud-radar-circle circle-3"></div>
        <div className="hud-radar-sweep"></div>
        
        {/* Supersonic Shockwave Rings */}
        <div className="sonic-ring ring-1"></div>
        <div className="sonic-ring ring-2"></div>

        {/* Su-57 Stealth Fighter Jet SVG */}
        <div className="su57-jet-wrapper">
          <svg
            className="su57-jet-svg"
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* HUD Target Crosshairs */}
            <line x1="120" y1="10" x2="120" y2="40" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="120" y1="200" x2="120" y2="230" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="10" y1="120" x2="40" y2="120" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="200" y1="120" x2="230" y2="120" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Jet Silhouette Shadow Glow */}
            <path
              d="M120 20 L135 65 L165 110 L210 160 L180 175 L150 170 L142 195 L120 185 L98 195 L90 170 L60 175 L30 160 L75 110 L105 65 Z"
              fill="rgba(0, 240, 255, 0.15)"
              filter="blur(8px)"
            />

            {/* Su-57 Stealth Wings & Fuselage Body */}
            <path
              d="M120 18 L126 50 L138 75 L170 120 L212 162 L182 174 L152 168 L142 196 L120 186 L98 196 L88 168 L58 174 L28 162 L70 120 L102 75 L114 50 Z"
              fill="url(#su57BodyGradient)"
              stroke="#00f0ff"
              strokeWidth="1.5"
            />

            {/* LEVCONs & Air Intake Panel Lines */}
            <path d="M120 18 L120 186" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1" strokeDasharray="4 2" />
            <path d="M108 80 L80 135 M132 80 L160 135" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M98 140 L88 168 M142 140 L152 168" stroke="#00f0ff" strokeWidth="1.2" />
            <polygon points="120,40 124,65 116,65" fill="#00f0ff" opacity="0.8" />

            {/* Canted Twin Vertical Tailfins */}
            <path d="M88 150 L68 185 L85 180 Z" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />
            <path d="M152 150 L172 185 L155 180 Z" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />

            {/* Twin Afterburner Engines & Flame Particles */}
            <g className="afterburner-flames">
              {/* Left Engine Thrust */}
              <ellipse cx="106" cy="194" rx="5" ry="3" fill="#00f0ff" />
              <path d="M101 196 L106 230 L111 196 Z" fill="url(#flameGradient)" className="flame-pulse" />
              <path d="M103 196 L106 220 L109 196 Z" fill="#fff" className="flame-core" />

              {/* Right Engine Thrust */}
              <ellipse cx="134" cy="194" rx="5" ry="3" fill="#00f0ff" />
              <path d="M129 196 L134 230 L139 196 Z" fill="url(#flameGradient)" className="flame-pulse" />
              <path d="M131 196 L134 220 L137 196 Z" fill="#fff" className="flame-core" />
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient id="su57BodyGradient" x1="120" y1="18" x2="120" y2="196" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="flameGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
                <stop offset="35%" stopColor="#ff5500" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#ff0055" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Tactical HUD Telemetry Readout */}
        <div className="hud-telemetry">
          <div className="hud-status-badge">
            <span className="live-dot"></span> SU-57 FELON // MACH 2.25
          </div>
          <div className="hud-loader-text">{text}</div>
          <div className="hud-loader-subtext">{subtext}</div>
          
          {/* HUD Telemetry Grid Numbers */}
          <div className="hud-metrics-row">
            <span>ALT: 45,000 FT</span>
            <span>RADAR: ACTIVE</span>
            <span>SQK: 5700</span>
          </div>
        </div>
      </div>
    </div>
  );
}
