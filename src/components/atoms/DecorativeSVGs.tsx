export const BusinessSVGs = {
  // Employee performance chart
  PerformanceChart: () => (
    <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05"/>
        </linearGradient>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#fbbf24"/>
        </linearGradient>
      </defs>
      
      {/* Background grid */}
      <g opacity="0.1">
        {[...Array(6)].map((_, i) => (
          <line key={i} x1="20" y1={40 + i * 30} x2="280" y2={40 + i * 30} stroke="#7c3aed" strokeWidth="1"/>
        ))}
        {[...Array(8)].map((_, i) => (
          <line key={i} x1={20 + i * 35} y1="40" x2={20 + i * 35} y2="190" stroke="#7c3aed" strokeWidth="1"/>
        ))}
      </g>
      
      {/* Chart area */}
      <path d="M20 160 L55 140 L90 120 L125 100 L160 80 L195 90 L230 70 L265 50 L280 50 L280 190 L20 190 Z" fill="url(#chartGradient)"/>
      
      {/* Chart line */}
      <path d="M20 160 L55 140 L90 120 L125 100 L160 80 L195 90 L230 70 L265 50" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      
      {/* Data points */}
      {[
        {x: 20, y: 160, color: "#7c3aed"},
        {x: 55, y: 140, color: "#7c3aed"},
        {x: 90, y: 120, color: "#7c3aed"},
        {x: 125, y: 100, color: "#fbbf24"},
        {x: 160, y: 80, color: "#fbbf24"},
        {x: 195, y: 90, color: "#fbbf24"},
        {x: 230, y: 70, color: "#fbbf24"},
        {x: 265, y: 50, color: "#fbbf24"}
      ].map((point, i) => (
        <circle key={i} cx={point.x} cy={point.y} r="4" fill={point.color} stroke="white" strokeWidth="2"/>
      ))}
      
      {/* Labels */}
      <text x="150" y="25" textAnchor="middle" className="text-xs font-semibold fill-violet-600">Employee Performance Trends</text>
    </svg>
  ),

  // Team collaboration illustration
  TeamCollaboration: () => (
    <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="teamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="150" cy="100" r="80" fill="url(#teamGradient)"/>
      
      {/* Central meeting table */}
      <ellipse cx="150" cy="100" rx="60" ry="30" fill="#f3f4f6" stroke="#7c3aed" strokeWidth="2"/>
      
      {/* People around table */}
      {[
        {x: 100, y: 80, color: "#7c3aed"},
        {x: 200, y: 80, color: "#fbbf24"},
        {x: 120, y: 120, color: "#7c3aed"},
        {x: 180, y: 120, color: "#fbbf24"},
        {x: 150, y: 60, color: "#7c3aed"}
      ].map((person, i) => (
        <g key={i}>
          <circle cx={person.x} cy={person.y} r="12" fill={person.color}/>
          <circle cx={person.x} cy={person.y - 3} r="6" fill="white"/>
          <rect x={person.x - 8} y={person.y + 5} width="16" height="8" rx="2" fill="white"/>
        </g>
      ))}
      
      {/* Connection lines */}
      <path d="M100 80 L150 100 M200 80 L150 100 M120 120 L150 100 M180 120 L150 100 M150 60 L150 100" 
            stroke="#7c3aed" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="3,3"/>
      
      {/* Rating stars */}
      {[...Array(5)].map((_, i) => (
        <g key={i} transform={`translate(${50 + i * 40}, 30)`}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                fill="#fbbf24" opacity="0.7"/>
        </g>
      ))}
      
      <text x="150" y="180" textAnchor="middle" className="text-xs font-semibold fill-violet-600">Team Performance</text>
    </svg>
  ),

  // Customer satisfaction meter
  SatisfactionMeter: () => (
    <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="50%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#10b981"/>
        </linearGradient>
      </defs>
      
      {/* Meter background */}
      <path d="M50 150 A50 50 0 0 1 250 150" stroke="#e5e7eb" strokeWidth="20" fill="none"/>
      
      {/* Meter fill */}
      <path d="M50 150 A50 50 0 0 1 200 120" stroke="url(#meterGradient)" strokeWidth="20" fill="none" strokeLinecap="round"/>
      
      {/* Needle */}
      <line x1="150" y1="100" x2="200" y2="120" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="150" cy="100" r="6" fill="#7c3aed"/>
      
      {/* Labels */}
      <text x="50" y="180" className="text-xs font-semibold fill-red-500">Poor</text>
      <text x="150" y="180" className="text-xs font-semibold fill-yellow-500">Good</text>
      <text x="250" y="180" className="text-xs font-semibold fill-green-500">Excellent</text>
      
      {/* Rating value */}
      <text x="150" y="80" textAnchor="middle" className="text-lg font-bold fill-violet-600">85%</text>
      <text x="150" y="95" textAnchor="middle" className="text-xs font-semibold fill-violet-600">Satisfaction</text>
    </svg>
  ),

  // Data analytics dashboard
  AnalyticsDashboard: () => (
    <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      
      {/* Dashboard background */}
      <rect x="20" y="20" width="260" height="160" rx="8" fill="url(#dashboardGradient)" stroke="#7c3aed" strokeWidth="1"/>
      
      {/* Chart bars */}
      {[
        {x: 40, y: 120, height: 40, color: "#7c3aed"},
        {x: 70, y: 100, height: 60, color: "#fbbf24"},
        {x: 100, y: 80, height: 80, color: "#7c3aed"},
        {x: 130, y: 90, height: 70, color: "#fbbf24"},
        {x: 160, y: 70, height: 90, color: "#7c3aed"},
        {x: 190, y: 110, height: 50, color: "#fbbf24"},
        {x: 220, y: 95, height: 65, color: "#7c3aed"}
      ].map((bar, i) => (
        <rect key={i} x={bar.x} y={bar.y} width="20" height={bar.height} fill={bar.color} rx="2"/>
      ))}
      
      {/* Pie chart */}
      <circle cx="200" cy="60" r="25" fill="none" stroke="#7c3aed" strokeWidth="8" strokeDasharray="40 120"/>
      <circle cx="200" cy="60" r="25" fill="none" stroke="#fbbf24" strokeWidth="8" strokeDasharray="20 140" strokeDashoffset="-40"/>
      
      {/* Labels */}
      <text x="150" y="40" textAnchor="middle" className="text-sm font-bold fill-violet-600">Performance Analytics</text>
      <text x="200" y="100" textAnchor="middle" className="text-xs fill-violet-600">Ratings</text>
    </svg>
  ),

  // Employee growth chart
  GrowthChart: () => (
    <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="growthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05"/>
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="300" height="200" fill="url(#growthGradient)"/>
      
      {/* Growth curve */}
      <path d="M30 160 Q80 140 130 120 T230 80 T280 60" stroke="#7c3aed" strokeWidth="3" fill="none" strokeLinecap="round"/>
      
      {/* Data points */}
      {[
        {x: 30, y: 160, size: 6},
        {x: 80, y: 140, size: 5},
        {x: 130, y: 120, size: 5},
        {x: 180, y: 100, size: 6},
        {x: 230, y: 80, size: 7},
        {x: 280, y: 60, size: 8}
      ].map((point, i) => (
        <circle key={i} cx={point.x} cy={point.y} r={point.size} fill="#7c3aed" stroke="white" strokeWidth="2"/>
      ))}
      
      {/* Growth arrow */}
      <path d="M270 70 L285 55 M285 55 L270 40" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
      
      {/* Labels */}
      <text x="150" y="30" textAnchor="middle" className="text-sm font-bold fill-violet-600">Employee Growth</text>
      <text x="150" y="45" textAnchor="middle" className="text-xs fill-violet-600">+25% This Month</text>
    </svg>
  ),

  // Feedback loop illustration
  FeedbackLoop: () => (
    <svg className="w-full h-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="loopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      
      {/* Central circle */}
      <circle cx="150" cy="100" r="40" fill="url(#loopGradient)" stroke="#7c3aed" strokeWidth="2"/>
      
      {/* Feedback arrows */}
      <path d="M110 100 A40 40 0 1 1 190 100" stroke="#7c3aed" strokeWidth="3" fill="none" strokeLinecap="round" markerEnd="url(#arrowhead)"/>
      
      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#7c3aed"/>
        </marker>
      </defs>
      
      {/* Icons around the circle */}
      {[
        {x: 150, y: 50, icon: "👤", label: "Employee"},
        {x: 200, y: 100, icon: "⭐", label: "Rating"},
        {x: 150, y: 150, icon: "📊", label: "Analytics"},
        {x: 100, y: 100, icon: "💬", label: "Feedback"}
      ].map((item, i) => (
        <g key={i}>
          <circle cx={item.x} cy={item.y} r="20" fill="white" stroke="#7c3aed" strokeWidth="2"/>
          <text x={item.x} y={item.y + 5} textAnchor="middle" className="text-sm">{item.icon}</text>
          <text x={item.x} y={item.y + 35} textAnchor="middle" className="text-xs font-semibold fill-violet-600">{item.label}</text>
        </g>
      ))}
      
      <text x="150" y="190" textAnchor="middle" className="text-xs font-semibold fill-violet-600">Continuous Feedback Loop</text>
    </svg>
  )
};
