import { useState } from 'react';

const SeatMap = ({ onSelectCategory, selectedCategory, hoveredCategory }) => {
    const [hoveredSection, setHoveredSection] = useState(null);

    const categories = [
        { id: 1, name: 'CAT 1', color: '#8b5cf6', detail: 'Best View' },
        { id: 2, name: 'CAT 2', color: '#3b82f6', detail: 'Standard View' },
        { id: 3, name: 'CAT 3', color: '#10b981', detail: 'Goals View' },
    ];

    const isHighlighted = (catId) => {
        return selectedCategory === catId || hoveredCategory === catId || hoveredSection === catId;
    };

    return (
        <div className="w-full aspect-square bg-[#0a0a0a] rounded-[2.5rem] border border-gray-800 relative overflow-hidden flex items-center justify-center p-8 shadow-2xl">
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <svg viewBox="0 0 500 500" className="w-full h-full max-w-[450px] drop-shadow-[0_0_50px_rgba(139,92,246,0.3)] transition-all duration-700">
                <defs>
                    <pattern id="grassPattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                        <rect width="10" height="20" fill="#059669" />
                        <rect x="10" width="10" height="20" fill="#047857" />
                    </pattern>

                    <radialGradient id="fieldSheen" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#333" />
                        <stop offset="50%" stopColor="#555" />
                        <stop offset="100%" stopColor="#222" />
                    </linearGradient>

                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="innerShadow">
                        <feOffset dx="0" dy="2" />
                        <feGaussianBlur stdDeviation="3" result="offset-blur" />
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                        <feFlood floodColor="black" floodOpacity="0.5" result="color" />
                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                </defs>

                {/* Outer Glow Ring */}
                <ellipse cx="250" cy="250" rx="240" ry="220" fill="none" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="1" strokeDasharray="10 5" className="animate-spin-slow" style={{ animationDuration: '60s' }} />

                {/* Stadium Base */}
                <ellipse cx="250" cy="250" rx="230" ry="210" fill="url(#metalGradient)" stroke="#444" strokeWidth="6" filter="url(#innerShadow)" />

                {/* The Pitch */}
                <g transform="translate(150, 150)">
                    <rect width="200" height="200" rx="16" fill="url(#grassPattern)" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <rect width="200" height="200" rx="16" fill="url(#fieldSheen)" style={{ mixBlendMode: 'overlay' }} />

                    {/* Pitch Markings */}
                    <path d="M 0,100 L 200,100" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                    <circle cx="100" cy="100" r="2" fill="white" />

                    {/* Goal Areas */}
                    <rect x="80" y="0" width="40" height="15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                    <rect x="80" y="185" width="40" height="15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />

                    {/* Corner Arcs */}
                    <path d="M 5,0 A 5,5 0 0 1 0,5" stroke="white" fill="none" />
                    <path d="M 200,5 A 5,5 0 0 1 195,0" stroke="white" fill="none" />
                    <path d="M 195,200 A 5,5 0 0 1 200,195" stroke="white" fill="none" />
                    <path d="M 0,195 A 5,5 0 0 1 5,200" stroke="white" fill="none" />
                </g>

                {/* SECTIONS */}
                {/* CAT 1 (West/East Main Stands) */}
                <g
                    onClick={() => onSelectCategory(1)}
                    onMouseEnter={() => setHoveredSection(1)}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="cursor-pointer group"
                >
                    <path
                        d="M 110,160 Q 60,250 110,340 L 50,370 Q -10,250 50,130 Z"
                        fill={categories[0].color}
                        opacity={isHighlighted(1) ? 0.9 : 0.2}
                        stroke={isHighlighted(1) ? "white" : "none"}
                        strokeWidth="2"
                        className="transition-all duration-300"
                        filter={isHighlighted(1) ? "url(#neonGlow)" : ""}
                    />
                    <path
                        d="M 390,160 Q 440,250 390,340 L 450,370 Q 510,250 450,130 Z"
                        fill={categories[0].color}
                        opacity={isHighlighted(1) ? 0.9 : 0.2}
                        stroke={isHighlighted(1) ? "white" : "none"}
                        strokeWidth="2"
                        className="transition-all duration-300"
                        filter={isHighlighted(1) ? "url(#neonGlow)" : ""}
                    />

                </g>

                {/* CAT 2 (North/South Ends) */}
                <g
                    onClick={() => onSelectCategory(2)}
                    onMouseEnter={() => setHoveredSection(2)}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="cursor-pointer"
                >
                    <path
                        d="M 160,110 Q 250,60 340,110 L 370,50 Q 250,-10 130,50 Z"
                        fill={categories[1].color}
                        opacity={isHighlighted(2) ? 0.9 : 0.2}
                        stroke={isHighlighted(2) ? "white" : "none"}
                        strokeWidth="2"
                        className="transition-all duration-300"
                        filter={isHighlighted(2) ? "url(#neonGlow)" : ""}
                    />
                    <path
                        d="M 160,390 Q 250,440 340,390 L 370,450 Q 250,510 130,450 Z"
                        fill={categories[1].color}
                        opacity={isHighlighted(2) ? 0.9 : 0.2}
                        stroke={isHighlighted(2) ? "white" : "none"}
                        strokeWidth="2"
                        className="transition-all duration-300"
                        filter={isHighlighted(2) ? "url(#neonGlow)" : ""}
                    />

                </g>

                {/* CAT 3 (Corners) */}
                <g
                    onClick={() => onSelectCategory(3)}
                    onMouseEnter={() => setHoveredSection(3)}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="cursor-pointer"
                >
                    <path d="M 115,115 L 140,60 Q 80,20 40,80 L 60,140 Q 80,110 115,115 Z" fill={categories[2].color} opacity={isHighlighted(3) ? 0.9 : 0.2} stroke={isHighlighted(3) ? "white" : "none"} strokeWidth="2" className="transition-all duration-300" filter={isHighlighted(3) ? "url(#neonGlow)" : ""} />
                    <path d="M 385,115 L 360,60 Q 420,20 460,80 L 440,140 Q 420,110 385,115 Z" fill={categories[2].color} opacity={isHighlighted(3) ? 0.9 : 0.2} stroke={isHighlighted(3) ? "white" : "none"} strokeWidth="2" className="transition-all duration-300" filter={isHighlighted(3) ? "url(#neonGlow)" : ""} />
                    <path d="M 115,385 L 140,440 Q 80,480 40,420 L 60,360 Q 80,390 115,385 Z" fill={categories[2].color} opacity={isHighlighted(3) ? 0.9 : 0.2} stroke={isHighlighted(3) ? "white" : "none"} strokeWidth="2" className="transition-all duration-300" filter={isHighlighted(3) ? "url(#neonGlow)" : ""} />
                    <path d="M 385,385 L 360,440 Q 420,480 460,420 L 440,360 Q 420,390 385,385 Z" fill={categories[2].color} opacity={isHighlighted(3) ? 0.9 : 0.2} stroke={isHighlighted(3) ? "white" : "none"} strokeWidth="2" className="transition-all duration-300" filter={isHighlighted(3) ? "url(#neonGlow)" : ""} />


                </g>
            </svg>

            {/* Premium Legend */}
            <div className="absolute top-8 left-8 flex flex-col gap-3">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className={`flex items-center gap-3 transition-all duration-300 ${isHighlighted(cat.id) ? 'translate-x-2' : 'opacity-40'}`}
                    >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{cat.name}</p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">{cat.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-8 right-8 flex flex-col items-end">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 italic">AFCON 2025</span>
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Interactive Smart View</span>
            </div>
        </div>
    );
};

export default SeatMap;
