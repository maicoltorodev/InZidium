export function RocketIcon({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cuerpo principal del cohete */}
      <path 
        d="M50 15 L35 45 L35 75 L45 85 L55 85 L65 75 L65 45 Z" 
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      
      {/* Punta del cohete */}
      <path 
        d="M50 15 L35 30 L65 30 Z" 
        fill="rgba(232,170,20,0.15)"
        stroke="rgba(232,170,20,0.3)"
        strokeWidth="0.5"
      />
      
      {/* Ventana */}
      <circle 
        cx="50" 
        cy="35" 
        r="8" 
        fill="rgba(100,220,255,0.2)"
        stroke="rgba(100,220,255,0.4)"
        strokeWidth="0.5"
      />
      
      {/* Aletas laterales */}
      <path 
        d="M35 55 L25 70 L35 70 Z" 
        fill="rgba(232,170,20,0.1)"
        stroke="rgba(232,170,20,0.2)"
        strokeWidth="0.5"
      />
      <path 
        d="M65 55 L75 70 L65 70 Z" 
        fill="rgba(232,170,20,0.1)"
        stroke="rgba(232,170,20,0.2)"
        strokeWidth="0.5"
      />
      
      {/* Llamas/fuego (animado) */}
      <g className="animate-pulse">
        <path 
          d="M40 85 L42 95 L45 85 Z" 
          fill="rgba(255,100,50,0.3)"
          stroke="rgba(255,150,50,0.4)"
          strokeWidth="0.5"
        />
        <path 
          d="M50 85 L50 96 L50 85 Z" 
          fill="rgba(255,150,50,0.3)"
          stroke="rgba(255,200,50,0.4)"
          strokeWidth="0.5"
        />
        <path 
          d="M60 85 L58 95 L55 85 Z" 
          fill="rgba(255,100,50,0.3)"
          stroke="rgba(255,150,50,0.4)"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
