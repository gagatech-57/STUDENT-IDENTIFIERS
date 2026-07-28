import React from 'react';

export function Su57Loader({ text = "SYNCHRONIZING VAULT DATALINK...", subtext = "FETCHING RECORDS & FILE METADATA" }) {
  return (
    <div className="su57-loader-container">
      <div className="su57-hud-container">
        {/* Radar Circular Grid Lines */}
        <div className="hud-radar-circle circle-1"></div>
        <div className="hud-radar-circle circle-2"></div>
        <div className="hud-radar-circle circle-3"></div>

        {/* Sweeping Radar Scanner */}
        <div className="hud-radar-sweep"></div>

        {/* Supersonic Shockwave Rings */}
        <div className="sonic-ring ring-1"></div>
        <div className="sonic-ring ring-2"></div>

        {/* Tactical Jet Vector SVG */}
        <div className="su57-jet-wrapper">
          <svg
            className="su57-jet-svg"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Flame Thrust Glow */}
            <path
              className="flame-pulse"
              d="M235 430 L250 480 L265 430 Z"
              fill="url(#flameGrad)"
            />
            <path
              className="flame-core"
              d="M242 430 L250 465 L258 430 Z"
              fill="#00F0FF"
            />

            {/* Su-57 Fuselage & Wing Geometry */}
            <path
              d="M250 30 
                 L262 100 L275 160 L350 250 L460 360 L440 390 L330 350 L340 420 L370 445 L360 455 L290 435 
                 L250 425 
                 L210 435 L140 455 L130 445 L160 420 L170 350 L60 390 L40 360 L150 250 L225 160 L238 100 Z"
              fill="#161B22"
              stroke="#4F8CFF"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Wing Panel Detail & Stealth Canopy Lines */}
            <path
              d="M250 80 L250 320 M230 180 L180 280 M270 180 L320 280 M200 330 L170 410 M300 330 L330 410"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />

            {/* Cockpit Canopy */}
            <path
              d="M244 110 Q250 90 256 110 L256 160 Q250 170 244 160 Z"
              fill="#00F0FF"
              fillOpacity="0.45"
              stroke="#00F0FF"
              strokeWidth="1.5"
            />

            <defs>
              <linearGradient id="flameGrad" x1="250" y1="430" x2="250" y2="480" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* HUD Telemetry Readout */}
        <div className="hud-telemetry">
          <div className="hud-status-badge">
            <span className="live-dot"></span>
            SYSTEM ONLINE
          </div>
          <p className="hud-loader-text">{text}</p>
          <span className="hud-loader-subtext">{subtext}</span>
        </div>
      </div>
    </div>
  );
}
