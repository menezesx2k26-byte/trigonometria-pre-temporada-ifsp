import type { Mission } from "@/data/types";

export default function LessonVisual({ type }: { type: Mission["visual"] }) {
  if (type === "triangle") {
    return (
      <svg
        className="lesson-visual"
        viewBox="0 0 420 250"
        role="img"
        aria-label="Triângulo retângulo com catetos e hipotenusa"
      >
        <defs>
          <linearGradient id="triGlow" x1="0" x2="1">
            <stop stopColor="#42ddff" />
            <stop offset="1" stopColor="#a687ff" />
          </linearGradient>
        </defs>
        <path
          d="M75 205 L75 45 L350 205 Z"
          fill="rgba(66,221,255,.07)"
          stroke="url(#triGlow)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M75 178 H102 V205"
          fill="none"
          stroke="#ffcc66"
          strokeWidth="4"
        />
        <text x="48" y="128">
          oposto
        </text>
        <text x="185" y="232">
          adjacente
        </text>
        <text x="220" y="105" transform="rotate(30 220 105)">
          hipotenusa
        </text>
        <circle cx="350" cy="205" r="7" fill="#ffcc66" />
        <text x="335" y="188">
          θ
        </text>
      </svg>
    );
  }
  if (type === "notable") {
    return (
      <svg
        className="lesson-visual"
        viewBox="0 0 420 250"
        role="img"
        aria-label="Escada de valores notáveis"
      >
        {[0, 1, 2, 3, 4].map((value, index) => (
          <g key={value}>
            <rect
              x={42 + index * 72}
              y={180 - index * 30}
              width="58"
              height={30 + index * 30}
              rx="8"
              fill={`rgba(66,221,255,${0.1 + index * 0.05})`}
              stroke="#42ddff"
            />
            <text x={71 + index * 72} y={168 - index * 30} textAnchor="middle">
              √{value}/2
            </text>
            <text x={71 + index * 72} y="228" textAnchor="middle">
              {index * 30}°
            </text>
          </g>
        ))}
        <path
          d="M45 42 C150 6 270 6 375 42"
          fill="none"
          stroke="#ffcc66"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text x="210" y="29" textAnchor="middle">
          seno sobe →
        </text>
      </svg>
    );
  }
  if (type === "wave") {
    return (
      <svg
        className="lesson-visual"
        viewBox="0 0 420 250"
        role="img"
        aria-label="Gráficos esquemáticos de seno e cosseno"
      >
        <path
          d="M25 125 H395 M50 25 V225"
          stroke="rgba(255,255,255,.24)"
          strokeWidth="2"
        />
        <path
          d="M50 125 C90 35 130 35 170 125 S250 215 290 125 S370 35 395 90"
          fill="none"
          stroke="#42ddff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M50 50 C90 50 130 125 170 200 S250 200 290 125 S370 50 395 50"
          fill="none"
          stroke="#a687ff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity=".9"
        />
        <text x="322" y="105" fill="#42ddff">
          sen x
        </text>
        <text x="320" y="42" fill="#a687ff">
          cos x
        </text>
      </svg>
    );
  }
  if (type === "identity" || type === "transform" || type === "equation") {
    const center =
      type === "identity"
        ? "sen² + cos² = 1"
        : type === "transform"
          ? "mantém ↔ contraria"
          : "referência → famílias";
    return (
      <svg
        className="lesson-visual"
        viewBox="0 0 420 250"
        role="img"
        aria-label="Mapa de relações trigonométricas"
      >
        <circle
          cx="210"
          cy="125"
          r="72"
          fill="rgba(166,135,255,.10)"
          stroke="#a687ff"
          strokeWidth="3"
        />
        <circle
          cx="210"
          cy="125"
          r="105"
          fill="none"
          stroke="rgba(66,221,255,.35)"
          strokeWidth="2"
          strokeDasharray="7 10"
        />
        <text x="210" y="120" textAnchor="middle" className="visual-center">
          {center}
        </text>
        <text x="210" y="150" textAnchor="middle" className="visual-small">
          equivalência • domínio • sinal
        </text>
        <circle cx="210" cy="20" r="8" fill="#42ddff" />
        <circle cx="315" cy="125" r="8" fill="#ffcc66" />
        <circle cx="105" cy="125" r="8" fill="#ff8ea1" />
      </svg>
    );
  }
  if (type === "angles") {
    return (
      <svg
        className="lesson-visual"
        viewBox="0 0 420 250"
        role="img"
        aria-label="Ângulos de 0 a 360 graus"
      >
        <circle
          cx="205"
          cy="130"
          r="92"
          fill="none"
          stroke="rgba(255,255,255,.14)"
          strokeWidth="2"
        />
        <path
          d="M205 130 H360"
          stroke="#42ddff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M205 130 L135 52"
          stroke="#a687ff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M280 130 A75 75 0 0 0 155 74"
          fill="none"
          stroke="#ffcc66"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="205" cy="130" r="9" fill="#ffcc66" />
        <text x="278" y="88">
          θ
        </text>
        <text x="32" y="225">
          0 → 90 → 180 → 360
        </text>
      </svg>
    );
  }
  return (
    <svg
      className="lesson-visual"
      viewBox="0 0 420 250"
      role="img"
      aria-label="Ciclo trigonométrico"
    >
      <circle
        cx="210"
        cy="125"
        r="92"
        fill="rgba(66,221,255,.04)"
        stroke="#42ddff"
        strokeWidth="4"
      />
      <path
        d="M35 125 H385 M210 10 V240"
        stroke="rgba(255,255,255,.22)"
        strokeWidth="2"
      />
      <path
        d="M210 125 L285 72"
        stroke="#ffcc66"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M285 72 V125 H210"
        fill="rgba(166,135,255,.12)"
        stroke="#a687ff"
        strokeDasharray="6 6"
        strokeWidth="2"
      />
      <circle cx="285" cy="72" r="8" fill="#ffcc66" />
      <text x="292" y="67">
        (cos θ, sen θ)
      </text>
      <text x="245" y="148">
        cos θ
      </text>
      <text x="292" y="102">
        sen θ
      </text>
      <text x="305" y="113">
        I
      </text>
      <text x="104" y="113">
        II
      </text>
      <text x="100" y="170">
        III
      </text>
      <text x="304" y="170">
        IV
      </text>
    </svg>
  );
}
