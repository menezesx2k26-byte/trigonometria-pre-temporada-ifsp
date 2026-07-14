import type { ReactNode } from "react";
import type { Mission } from "@/data/types";

const color = {
  cyan: "#42ddff",
  violet: "#a687ff",
  amber: "#ffcc66",
  rose: "#ff8ea1",
  mint: "#63f3bd",
  ink: "#07111f",
  text: "#edf7ff",
  muted: "#9eb1c8",
};

type FrameProps = {
  mission: Mission;
  heading: string;
  description: string;
  children: ReactNode;
};

function VisualFrame({ mission, heading, description, children }: FrameProps) {
  const titleId = `visual-title-${mission.day}`;
  const descriptionId = `visual-description-${mission.day}`;
  const gridId = `visual-grid-${mission.day}`;
  const glowId = `visual-glow-${mission.day}`;
  const arrowId = `visual-arrow-${mission.day}`;

  return (
    <svg
      className="lesson-visual"
      viewBox="0 0 440 286"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>{heading}</title>
      <desc id={descriptionId}>{description}</desc>
      <defs>
        <linearGradient
          id={`visual-panel-${mission.day}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#0d2035" />
          <stop offset=".55" stopColor="#081523" />
          <stop offset="1" stopColor="#120f27" />
        </linearGradient>
        <pattern
          id={gridId}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M22 0H0V22"
            fill="none"
            stroke="rgba(158,177,200,.08)"
            strokeWidth="1"
          />
        </pattern>
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill={color.amber} />
        </marker>
      </defs>
      <rect
        x="1"
        y="1"
        width="438"
        height="284"
        rx="24"
        fill={`url(#visual-panel-${mission.day})`}
      />
      <rect
        x="1"
        y="1"
        width="438"
        height="284"
        rx="24"
        fill={`url(#${gridId})`}
      />
      <path d="M22 69H418" stroke="rgba(158,177,200,.16)" />
      <text x="22" y="28" className="visual-kicker">
        DIA {String(mission.day).padStart(2, "0")} · MAPA VISUAL
      </text>
      <text x="22" y="54" className="visual-title">
        {heading}
      </text>
      {children}
    </svg>
  );
}

type ChipProps = {
  x: number;
  y: number;
  width: number;
  text: string;
  stroke?: string;
  fill?: string;
  className?: string;
};

function Chip({
  x,
  y,
  width,
  text,
  stroke = color.cyan,
  fill = "rgba(66,221,255,.09)",
  className = "visual-label",
}: ChipProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height="28"
        rx="14"
        fill={fill}
        stroke={stroke}
        strokeOpacity=".55"
      />
      <text
        x={x + width / 2}
        y={y + 18}
        textAnchor="middle"
        className={className}
      >
        {text}
      </text>
    </g>
  );
}

function AnglesVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Ângulo é giro, não desenho"
      description="Semirretas com origem comum, arco orientado e referências de noventa e cento e oitenta graus."
    >
      <path d="M72 220H372" stroke="rgba(237,247,255,.32)" strokeWidth="2" />
      <path
        d="M222 220V92"
        stroke="rgba(237,247,255,.20)"
        strokeWidth="2"
        strokeDasharray="6 7"
      />
      <path
        d="M222 220H370"
        stroke={color.cyan}
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#visual-glow-1)"
      />
      <path
        d="M222 220L327 132"
        stroke={color.violet}
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#visual-glow-1)"
      />
      <path
        d="M294 220A72 72 0 0 0 277 174"
        fill="none"
        stroke={color.amber}
        strokeWidth="5"
        strokeLinecap="round"
        markerEnd="url(#visual-arrow-1)"
      />
      <path
        d="M222 201H241V220"
        fill="none"
        stroke={color.rose}
        strokeWidth="3"
      />
      <circle cx="222" cy="220" r="8" fill={color.amber} />
      <text x="205" y="242" className="visual-label">
        O
      </text>
      <text x="286" y="184" className="visual-formula">
        θ
      </text>
      <text x="363" y="240" className="visual-axis">
        0° / 360°
      </text>
      <text x="208" y="88" className="visual-axis">
        90°
      </text>
      <text x="55" y="240" className="visual-axis">
        180°
      </text>
      <path
        d="M94 220A128 128 0 0 1 222 92"
        fill="none"
        stroke="rgba(255,142,161,.36)"
        strokeWidth="2"
      />
      <text x="53" y="112" className="visual-note">
        lado inicial
      </text>
      <path
        d="M118 116L207 209"
        stroke={color.amber}
        strokeWidth="1.5"
        markerEnd="url(#visual-arrow-1)"
      />
      <Chip
        x={28}
        y={76}
        width={118}
        text="complemento = 90°"
        stroke={color.rose}
        fill="rgba(255,142,161,.08)"
      />
      <Chip
        x={274}
        y={76}
        width={138}
        text="suplemento = 180°"
        stroke={color.violet}
        fill="rgba(166,135,255,.08)"
      />
    </VisualFrame>
  );
}

function TriangleVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Anatomia depende do ângulo"
      description="Triângulo retângulo com hipotenusa fixa e catetos oposto e adjacente relativos ao ângulo theta."
    >
      <path
        d="M66 238V92L326 238Z"
        fill="rgba(66,221,255,.07)"
        stroke="rgba(237,247,255,.18)"
        strokeWidth="2"
      />
      <path
        d="M66 238V92"
        stroke={color.rose}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M66 238H326"
        stroke={color.cyan}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M66 92L326 238"
        stroke={color.violet}
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#visual-glow-2)"
      />
      <path
        d="M66 216H88V238"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <path
        d="M285 238A41 41 0 0 1 291 218"
        fill="none"
        stroke={color.amber}
        strokeWidth="4"
      />
      <text x="292" y="224" className="visual-formula">
        θ
      </text>
      <text x="18" y="168" className="visual-label">
        oposto
      </text>
      <text x="153" y="262" className="visual-label">
        adjacente
      </text>
      <text
        x="172"
        y="130"
        className="visual-label"
        transform="rotate(29 172 130)"
      >
        hipotenusa
      </text>
      <text x="51" y="255" className="visual-axis">
        A
      </text>
      <text x="50" y="86" className="visual-axis">
        B
      </text>
      <text x="330" y="255" className="visual-axis">
        C
      </text>
      <g transform="translate(294 91)">
        <rect
          width="120"
          height="76"
          rx="16"
          fill="rgba(255,204,102,.08)"
          stroke="rgba(255,204,102,.42)"
        />
        <text x="60" y="24" textAnchor="middle" className="visual-note">
          PITÁGORAS
        </text>
        <text x="60" y="50" textAnchor="middle" className="visual-formula">
          h² = a² + b²
        </text>
        <text x="60" y="67" textAnchor="middle" className="visual-muted">
          h fica oposta a 90°
        </text>
      </g>
    </VisualFrame>
  );
}

function RatiosVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="SOH · CAH · TOA"
      description="Triângulo com os lados O, A e H ligados às três razões trigonométricas."
    >
      <path
        d="M36 238V105L221 238Z"
        fill="rgba(66,221,255,.06)"
        stroke="rgba(237,247,255,.18)"
        strokeWidth="2"
      />
      <path d="M36 238V105" stroke={color.rose} strokeWidth="5" />
      <path d="M36 238H221" stroke={color.cyan} strokeWidth="5" />
      <path d="M36 105L221 238" stroke={color.violet} strokeWidth="5" />
      <path
        d="M36 218H56V238"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <path
        d="M187 238A34 34 0 0 1 192 219"
        fill="none"
        stroke={color.amber}
        strokeWidth="4"
      />
      <text x="191" y="225" className="visual-formula">
        θ
      </text>
      <circle cx="25" cy="169" r="15" fill={color.rose} />
      <text x="25" y="174" textAnchor="middle" className="visual-chip-dark">
        O
      </text>
      <circle cx="126" cy="249" r="15" fill={color.cyan} />
      <text x="126" y="254" textAnchor="middle" className="visual-chip-dark">
        A
      </text>
      <circle cx="128" cy="162" r="15" fill={color.violet} />
      <text x="128" y="167" textAnchor="middle" className="visual-chip-dark">
        H
      </text>
      <g transform="translate(248 86)">
        <rect
          width="166"
          height="49"
          rx="14"
          fill="rgba(255,142,161,.08)"
          stroke="rgba(255,142,161,.42)"
        />
        <text x="16" y="21" className="visual-note" fill={color.rose}>
          SOH
        </text>
        <text x="83" y="35" textAnchor="middle" className="visual-formula">
          sen θ = O/H
        </text>
      </g>
      <g transform="translate(248 146)">
        <rect
          width="166"
          height="49"
          rx="14"
          fill="rgba(66,221,255,.08)"
          stroke="rgba(66,221,255,.42)"
        />
        <text x="16" y="21" className="visual-note" fill={color.cyan}>
          CAH
        </text>
        <text x="83" y="35" textAnchor="middle" className="visual-formula">
          cos θ = A/H
        </text>
      </g>
      <g transform="translate(248 206)">
        <rect
          width="166"
          height="49"
          rx="14"
          fill="rgba(255,204,102,.08)"
          stroke="rgba(255,204,102,.42)"
        />
        <text x="16" y="21" className="visual-note" fill={color.amber}>
          TOA
        </text>
        <text x="83" y="35" textAnchor="middle" className="visual-formula">
          tg θ = O/A
        </text>
      </g>
    </VisualFrame>
  );
}

function NotableVisual({ mission }: { mission: Mission }) {
  const angles = ["0°", "30°", "45°", "60°", "90°"];
  const sine = ["√0/2", "√1/2", "√2/2", "√3/2", "√4/2"];
  const cosine = [...sine].reverse();

  return (
    <VisualFrame
      mission={mission}
      heading="Duas escadas, uma memória"
      description="Tabela exata de seno e cosseno para zero, trinta, quarenta e cinco, sessenta e noventa graus."
    >
      <text x="31" y="106" className="visual-note" fill={color.cyan}>
        sen ↑
      </text>
      <text x="31" y="160" className="visual-note" fill={color.violet}>
        cos ↓
      </text>
      <path d="M92 95H410" stroke="rgba(237,247,255,.15)" />
      <path d="M92 149H410" stroke="rgba(237,247,255,.15)" />
      {angles.map((angle, index) => {
        const x = 107 + index * 73;
        return (
          <g key={angle}>
            <rect
              x={x - 29}
              y="76"
              width="58"
              height="106"
              rx="14"
              fill={
                index === 2 ? "rgba(255,204,102,.10)" : "rgba(255,255,255,.025)"
              }
              stroke={
                index === 2 ? "rgba(255,204,102,.45)" : "rgba(158,177,200,.12)"
              }
            />
            <text
              x={x}
              y="112"
              textAnchor="middle"
              className="visual-formula"
              fill={color.cyan}
            >
              {sine[index]}
            </text>
            <text
              x={x}
              y="166"
              textAnchor="middle"
              className="visual-formula"
              fill={color.violet}
            >
              {cosine[index]}
            </text>
            <text x={x} y="203" textAnchor="middle" className="visual-label">
              {angle}
            </text>
            <circle
              cx={x}
              cy={218}
              r={index === 2 ? 6 : 4}
              fill={index === 2 ? color.amber : color.muted}
            />
          </g>
        );
      })}
      <Chip
        x={90}
        y={234}
        width={260}
        text="seno sobe · cosseno desce · tg = sen ÷ cos"
        stroke={color.amber}
        fill="rgba(255,204,102,.08)"
      />
    </VisualFrame>
  );
}

function RadiansVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="O mesmo giro em duas línguas"
      description="Circunferência marcada simultaneamente em graus e radianos, com um arco de um quarto de volta."
    >
      <circle
        cx="220"
        cy="175"
        r="82"
        fill="rgba(66,221,255,.035)"
        stroke="rgba(237,247,255,.24)"
        strokeWidth="2"
      />
      <path
        d="M220 175H314M220 175V81M220 175H126M220 175V269"
        stroke="rgba(237,247,255,.22)"
        strokeWidth="2"
      />
      <path
        d="M302 175A82 82 0 0 0 220 93"
        fill="none"
        stroke={color.amber}
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#visual-glow-5)"
      />
      <path d="M220 175L278 117" stroke={color.violet} strokeWidth="4" />
      <path
        d="M266 175A46 46 0 0 0 253 143"
        fill="none"
        stroke={color.cyan}
        strokeWidth="3"
      />
      <text x="266" y="153" className="visual-formula">
        θ
      </text>
      <circle cx="220" cy="175" r="7" fill={color.amber} />
      <g transform="translate(318 157)">
        <text className="visual-label">0°</text>
        <text y="17" className="visual-muted">
          0 rad
        </text>
      </g>
      <g transform="translate(202 78)">
        <text className="visual-label">90°</text>
        <text y="17" className="visual-muted">
          π/2
        </text>
      </g>
      <g transform="translate(75 157)">
        <text className="visual-label">180°</text>
        <text y="17" className="visual-muted">
          π
        </text>
      </g>
      <g transform="translate(198 265)">
        <text className="visual-label">270°</text>
        <text y="17" className="visual-muted">
          3π/2
        </text>
      </g>
      <Chip x={24} y={80} width={129} text="180° ↔ π rad" stroke={color.cyan} />
      <g transform="translate(306 82)">
        <rect
          width="108"
          height="55"
          rx="14"
          fill="rgba(166,135,255,.08)"
          stroke="rgba(166,135,255,.42)"
        />
        <text x="54" y="23" textAnchor="middle" className="visual-note">
          ARCO
        </text>
        <text x="54" y="43" textAnchor="middle" className="visual-formula">
          s = r · θ
        </text>
      </g>
    </VisualFrame>
  );
}

function SignsVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Os eixos mandam nos sinais"
      description="Quatro quadrantes coloridos com a função positiva dominante em cada região."
    >
      <g transform="translate(220 177)">
        <path
          d="M0 0V-88A88 88 0 0 1 88 0Z"
          fill="rgba(99,243,189,.14)"
          stroke="rgba(99,243,189,.45)"
        />
        <path
          d="M0 0H-88A88 88 0 0 1 0-88Z"
          fill="rgba(66,221,255,.13)"
          stroke="rgba(66,221,255,.45)"
        />
        <path
          d="M0 0V88A88 88 0 0 1-88 0Z"
          fill="rgba(255,204,102,.13)"
          stroke="rgba(255,204,102,.45)"
        />
        <path
          d="M0 0H88A88 88 0 0 1 0 88Z"
          fill="rgba(166,135,255,.13)"
          stroke="rgba(166,135,255,.45)"
        />
      </g>
      <path
        d="M54 177H386M220 77V277"
        stroke="rgba(237,247,255,.34)"
        strokeWidth="2"
      />
      <circle cx="220" cy="177" r="7" fill={color.text} />
      <g transform="translate(268 117)">
        <text className="visual-note" fill={color.mint}>
          I · TODOS +
        </text>
        <text y="20" className="visual-muted">
          sen + · cos + · tg +
        </text>
      </g>
      <g transform="translate(89 117)">
        <text className="visual-note" fill={color.cyan}>
          II · SENO +
        </text>
        <text y="20" className="visual-muted">
          sen + · cos − · tg −
        </text>
      </g>
      <g transform="translate(78 222)">
        <text className="visual-note" fill={color.amber}>
          III · TANGENTE +
        </text>
        <text y="20" className="visual-muted">
          sen − · cos − · tg +
        </text>
      </g>
      <g transform="translate(268 222)">
        <text className="visual-note" fill={color.violet}>
          IV · COSSENO +
        </text>
        <text y="20" className="visual-muted">
          sen − · cos + · tg −
        </text>
      </g>
      <Chip
        x={118}
        y={76}
        width={204}
        text="Todos · Seno · Tangente · Cosseno"
        stroke={color.amber}
        fill="rgba(255,204,102,.07)"
      />
    </VisualFrame>
  );
}

function RelationsVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Pitágoras governa o ciclo"
      description="Triângulo no círculo unitário e relações derivadas por divisão da identidade fundamental."
    >
      <circle
        cx="112"
        cy="174"
        r="70"
        fill="rgba(66,221,255,.035)"
        stroke={color.cyan}
        strokeWidth="3"
      />
      <path d="M42 174H182M112 94V254" stroke="rgba(237,247,255,.22)" />
      <path
        d="M112 174L164 127V174Z"
        fill="rgba(166,135,255,.13)"
        stroke={color.violet}
        strokeWidth="3"
      />
      <circle cx="164" cy="127" r="6" fill={color.amber} />
      <text x="132" y="145" className="visual-label">
        1
      </text>
      <text x="128" y="191" className="visual-muted">
        cos θ
      </text>
      <text x="169" y="154" className="visual-muted">
        sen θ
      </text>
      <g transform="translate(210 84)">
        <rect
          width="204"
          height="50"
          rx="15"
          fill="rgba(66,221,255,.09)"
          stroke="rgba(66,221,255,.48)"
        />
        <text x="102" y="31" textAnchor="middle" className="visual-formula">
          sen²θ + cos²θ = 1
        </text>
      </g>
      <path
        d="M312 137V151"
        stroke={color.amber}
        markerEnd="url(#visual-arrow-7)"
      />
      <g transform="translate(210 155)">
        <rect
          width="204"
          height="42"
          rx="13"
          fill="rgba(166,135,255,.08)"
          stroke="rgba(166,135,255,.42)"
        />
        <text x="102" y="27" textAnchor="middle" className="visual-formula">
          1 + tg²θ = sec²θ
        </text>
      </g>
      <g transform="translate(210 207)">
        <rect
          width="204"
          height="42"
          rx="13"
          fill="rgba(255,142,161,.08)"
          stroke="rgba(255,142,161,.42)"
        />
        <text x="102" y="27" textAnchor="middle" className="visual-formula">
          cotg²θ + 1 = cossec²θ
        </text>
      </g>
      <text x="312" y="267" textAnchor="middle" className="visual-muted">
        dividir exige denominador ≠ 0
      </text>
    </VisualFrame>
  );
}

function ReductionVisual({ mission }: { mission: Mission }) {
  const points = [
    { x: 289, y: 129, label: "(+,+)", tx: 300, ty: 119, tone: color.mint },
    { x: 151, y: 129, label: "(−,+)", tx: 86, ty: 119, tone: color.cyan },
    { x: 151, y: 221, label: "(−,−)", tx: 84, ty: 241, tone: color.amber },
    { x: 289, y: 221, label: "(+,−)", tx: 300, ty: 241, tone: color.violet },
  ];

  return (
    <VisualFrame
      mission={mission}
      heading="Localize · reduza · sinalize"
      description="Pontos simétricos nos quatro quadrantes com o mesmo ângulo de referência e sinais definidos pelos eixos."
    >
      <circle
        cx="220"
        cy="175"
        r="84"
        fill="rgba(66,221,255,.025)"
        stroke="rgba(237,247,255,.26)"
        strokeWidth="2"
      />
      <path d="M105 175H335M220 78V272" stroke="rgba(237,247,255,.28)" />
      {points.map((point, index) => (
        <g key={point.label}>
          <path
            d={`M220 175L${point.x} ${point.y}`}
            stroke={point.tone}
            strokeWidth="3"
            strokeDasharray={index === 0 ? undefined : "5 5"}
          />
          <circle cx={point.x} cy={point.y} r="6" fill={point.tone} />
          <text
            x={point.tx}
            y={point.ty}
            className="visual-label"
            fill={point.tone}
          >
            {point.label}
          </text>
        </g>
      ))}
      <path
        d="M265 175A45 45 0 0 0 257 150"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <path
        d="M175 175A45 45 0 0 1 183 150"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <path
        d="M175 175A45 45 0 0 0 183 200"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <path
        d="M265 175A45 45 0 0 1 257 200"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <text x="260" y="157" className="visual-formula">
        α
      </text>
      <text x="170" y="157" className="visual-formula">
        α
      </text>
      <text x="169" y="210" className="visual-formula">
        α
      </text>
      <text x="260" y="210" className="visual-formula">
        α
      </text>
      <Chip
        x={96}
        y={76}
        width={248}
        text="mesmo módulo · o quadrante escolhe o sinal"
        stroke={color.amber}
        fill="rgba(255,204,102,.07)"
      />
      <Chip
        x={90}
        y={248}
        width={260}
        text="Todos · Seno · Tangente · Cosseno"
        stroke={color.amber}
        fill="rgba(255,204,102,.07)"
      />
    </VisualFrame>
  );
}

function FunctionsVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="O ciclo desenrola em ondas"
      description="Projeção do círculo unitário nos gráficos de seno e cosseno ao longo de uma volta completa."
    >
      <circle
        cx="86"
        cy="170"
        r="56"
        fill="rgba(66,221,255,.035)"
        stroke="rgba(237,247,255,.25)"
        strokeWidth="2"
      />
      <path d="M24 170H148M86 106V234" stroke="rgba(237,247,255,.20)" />
      <path d="M86 170L126 130" stroke={color.amber} strokeWidth="3" />
      <path
        d="M126 130V170"
        stroke={color.cyan}
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle cx="126" cy="130" r="6" fill={color.amber} />
      <text x="99" y="148" className="visual-formula">
        θ
      </text>
      <path
        d="M126 130H178"
        stroke={color.cyan}
        strokeWidth="2"
        strokeDasharray="5 5"
        markerEnd="url(#visual-arrow-9)"
      />
      <path d="M174 92V244M174 170H420" stroke="rgba(237,247,255,.24)" />
      <path
        d="M174 170C194 118 214 116 234 116C254 116 274 118 294 170C314 222 334 224 354 224C374 224 394 222 414 170"
        fill="none"
        stroke={color.cyan}
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#visual-glow-9)"
      />
      <path
        d="M174 116C194 116 214 143 234 170S274 224 294 224S334 197 354 170S394 116 414 116"
        fill="none"
        stroke={color.violet}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[174, 234, 294, 354, 414].map((x, index) => (
        <g key={x}>
          <path d={`M${x} 166V174`} stroke="rgba(237,247,255,.45)" />
          <text x={x} y="260" textAnchor="middle" className="visual-axis">
            {["0", "π/2", "π", "3π/2", "2π"][index]}
          </text>
        </g>
      ))}
      <text x="382" y="108" className="visual-note" fill={color.violet}>
        cos x
      </text>
      <text x="382" y="154" className="visual-note" fill={color.cyan}>
        sen x
      </text>
      <Chip
        x={24}
        y={78}
        width={124}
        text="(cos θ, sen θ)"
        stroke={color.amber}
        fill="rgba(255,204,102,.07)"
      />
    </VisualFrame>
  );
}

function TangentVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Tangente cresce entre paredes"
      description="Gráfico crescente da tangente entre assíntotas verticais e lembretes sobre período e transformações."
    >
      <path d="M28 167H414M220 82V246" stroke="rgba(237,247,255,.24)" />
      <path
        d="M111 82V246M329 82V246"
        stroke={color.rose}
        strokeWidth="2"
        strokeDasharray="7 6"
      />
      <path
        d="M116 235C150 230 167 206 183 190S204 173 220 167S257 142 274 122S304 91 324 88"
        fill="none"
        stroke={color.amber}
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#visual-glow-10)"
      />
      <path
        d="M30 235C56 229 82 182 106 92"
        fill="none"
        stroke={color.amber}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M334 240C360 229 389 158 414 92"
        fill="none"
        stroke={color.amber}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <text x="91" y="263" className="visual-axis">
        −π/2
      </text>
      <text x="212" y="263" className="visual-axis">
        0
      </text>
      <text x="320" y="263" className="visual-axis">
        π/2
      </text>
      <text x="245" y="112" className="visual-note" fill={color.amber}>
        período π
      </text>
      <path
        d="M116 105H324"
        stroke={color.cyan}
        strokeWidth="2"
        markerStart="url(#visual-arrow-10)"
        markerEnd="url(#visual-arrow-10)"
      />
      <Chip
        x={25}
        y={78}
        width={132}
        text="assíntota vertical"
        stroke={color.rose}
        fill="rgba(255,142,161,.08)"
      />
      <Chip
        x={271}
        y={78}
        width={143}
        text="a·f(bx+c)+d"
        stroke={color.violet}
        fill="rgba(166,135,255,.08)"
        className="visual-formula"
      />
      <text x="219" y="281" textAnchor="middle" className="visual-muted">
        fora muda altura · dentro muda ritmo · tg(−x) = −tg x
      </text>
    </VisualFrame>
  );
}

function AdditionVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Somar ângulos mistura coordenadas"
      description="Dois ângulos no ciclo e as fórmulas de seno e cosseno da soma."
    >
      <circle
        cx="108"
        cy="174"
        r="72"
        fill="rgba(66,221,255,.03)"
        stroke="rgba(237,247,255,.25)"
        strokeWidth="2"
      />
      <path d="M31 174H185M108 96V252" stroke="rgba(237,247,255,.20)" />
      <path d="M108 174L174 144" stroke={color.cyan} strokeWidth="4" />
      <path d="M108 174L145 112" stroke={color.amber} strokeWidth="4" />
      <path
        d="M148 174A40 40 0 0 0 144 157"
        fill="none"
        stroke={color.cyan}
        strokeWidth="3"
      />
      <path
        d="M145 157A45 45 0 0 0 136 139"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <circle cx="174" cy="144" r="6" fill={color.cyan} />
      <circle cx="145" cy="112" r="6" fill={color.amber} />
      <text x="148" y="166" className="visual-formula">
        α
      </text>
      <text x="127" y="145" className="visual-formula">
        β
      </text>
      <text x="151" y="103" className="visual-note" fill={color.amber}>
        α + β
      </text>
      <g transform="translate(207 88)">
        <rect
          width="210"
          height="70"
          rx="16"
          fill="rgba(66,221,255,.08)"
          stroke="rgba(66,221,255,.44)"
        />
        <text x="16" y="23" className="visual-note" fill={color.cyan}>
          SENO MISTURA
        </text>
        <text x="105" y="47" textAnchor="middle" className="visual-formula">
          sen(α+β)
        </text>
        <text x="105" y="63" textAnchor="middle" className="visual-muted">
          = sen α cos β + cos α sen β
        </text>
      </g>
      <g transform="translate(207 175)">
        <rect
          width="210"
          height="70"
          rx="16"
          fill="rgba(166,135,255,.08)"
          stroke="rgba(166,135,255,.44)"
        />
        <text x="16" y="23" className="visual-note" fill={color.violet}>
          COSSENO CONTRARIA
        </text>
        <text x="105" y="47" textAnchor="middle" className="visual-formula">
          cos(α+β)
        </text>
        <text x="105" y="63" textAnchor="middle" className="visual-muted">
          = cos α cos β − sen α sen β
        </text>
      </g>
    </VisualFrame>
  );
}

function IdentitiesVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Identidade é caminho reversível"
      description="Fluxo de simplificação usando uma relação fundamental, fatoração e controle de domínio."
    >
      <g transform="translate(24 92)">
        <rect
          width="122"
          height="62"
          rx="15"
          fill="rgba(255,142,161,.08)"
          stroke="rgba(255,142,161,.42)"
        />
        <text x="61" y="24" textAnchor="middle" className="visual-note">
          UM LADO SÓ
        </text>
        <text x="61" y="47" textAnchor="middle" className="visual-formula">
          (1−sen²x)/cos x
        </text>
      </g>
      <path
        d="M151 123H182"
        stroke={color.amber}
        strokeWidth="3"
        markerEnd="url(#visual-arrow-12)"
      />
      <text x="166" y="111" textAnchor="middle" className="visual-muted">
        substitua
      </text>
      <g transform="translate(187 92)">
        <rect
          width="108"
          height="62"
          rx="15"
          fill="rgba(66,221,255,.08)"
          stroke="rgba(66,221,255,.42)"
        />
        <text x="54" y="24" textAnchor="middle" className="visual-note">
          PITÁGORAS
        </text>
        <text x="54" y="47" textAnchor="middle" className="visual-formula">
          cos²x/cos x
        </text>
      </g>
      <path
        d="M300 123H331"
        stroke={color.amber}
        strokeWidth="3"
        markerEnd="url(#visual-arrow-12)"
      />
      <text x="315" y="111" textAnchor="middle" className="visual-muted">
        simplifique
      </text>
      <g transform="translate(336 92)">
        <rect
          width="80"
          height="62"
          rx="15"
          fill="rgba(99,243,189,.09)"
          stroke="rgba(99,243,189,.46)"
        />
        <text x="40" y="25" textAnchor="middle" className="visual-note">
          CHEGOU
        </text>
        <text x="40" y="48" textAnchor="middle" className="visual-formula">
          cos x
        </text>
      </g>
      <g transform="translate(24 179)">
        <rect
          width="392"
          height="68"
          rx="17"
          fill="rgba(166,135,255,.07)"
          stroke="rgba(166,135,255,.30)"
        />
        <text x="20" y="24" className="visual-note" fill={color.violet}>
          TRILHO SEGURO
        </text>
        <text x="20" y="52" className="visual-label">
          1 · um lado só
        </text>
        <text x="112" y="52" className="visual-label">
          2 · substitua
        </text>
        <text x="220" y="52" className="visual-label">
          3 · fatore
        </text>
        <text x="305" y="52" className="visual-label">
          4 · domínio
        </text>
      </g>
      <Chip
        x={115}
        y={253}
        width={210}
        text="igualdade visual ≠ prova por desenho"
        stroke={color.amber}
        fill="rgba(255,204,102,.07)"
      />
    </VisualFrame>
  );
}

function EquationsVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Igualdade marca · desigualdade pinta"
      description="Reta horizontal cortando o círculo em duas soluções de seno e arco superior destacado para uma inequação."
    >
      <circle
        cx="142"
        cy="176"
        r="82"
        fill="rgba(66,221,255,.03)"
        stroke="rgba(237,247,255,.26)"
        strokeWidth="2"
      />
      <path d="M48 176H236M142 87V265" stroke="rgba(237,247,255,.22)" />
      <path
        d="M75 129H209"
        stroke={color.rose}
        strokeWidth="3"
        strokeDasharray="6 5"
      />
      <path
        d="M75 129A82 82 0 0 1 209 129"
        fill="none"
        stroke={color.cyan}
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#visual-glow-13)"
      />
      <circle cx="75" cy="129" r="7" fill={color.amber} />
      <circle cx="209" cy="129" r="7" fill={color.amber} />
      <path
        d="M142 176L209 129M142 176L75 129"
        stroke={color.violet}
        strokeWidth="3"
      />
      <path
        d="M185 176A43 43 0 0 0 177 151"
        fill="none"
        stroke={color.amber}
        strokeWidth="3"
      />
      <text x="181" y="159" className="visual-formula">
        α
      </text>
      <text x="53" y="116" className="visual-label">
        π−α
      </text>
      <text x="213" y="119" className="visual-label">
        α
      </text>
      <text x="130" y="121" className="visual-note" fill={color.rose}>
        y=m
      </text>
      <g transform="translate(256 87)">
        <rect
          width="160"
          height="76"
          rx="16"
          fill="rgba(66,221,255,.08)"
          stroke="rgba(66,221,255,.42)"
        />
        <text x="80" y="22" textAnchor="middle" className="visual-note">
          sen x = m · 0&lt;m&lt;1
        </text>
        <text x="80" y="45" textAnchor="middle" className="visual-formula">
          x = α + 2kπ
        </text>
        <text x="80" y="64" textAnchor="middle" className="visual-formula">
          x = π−α + 2kπ
        </text>
      </g>
      <g transform="translate(256 181)">
        <rect
          width="160"
          height="59"
          rx="16"
          fill="rgba(255,142,161,.08)"
          stroke="rgba(255,142,161,.42)"
        />
        <text x="80" y="23" textAnchor="middle" className="visual-note">
          sen x &gt; m
        </text>
        <text x="80" y="44" textAnchor="middle" className="visual-label">
          fica no arco destacado
        </text>
      </g>
      <text x="336" y="263" textAnchor="middle" className="visual-muted">
        k ∈ ℤ · respeite o intervalo pedido
      </text>
    </VisualFrame>
  );
}

function BossVisual({ mission }: { mission: Mission }) {
  return (
    <VisualFrame
      mission={mission}
      heading="Painel de controle da órbita"
      description="Triângulo, ciclo e gráfico conectados como três modelos para escolher conforme o dado e o objetivo."
    >
      <g transform="translate(22 91)">
        <rect
          width="118"
          height="126"
          rx="18"
          fill="rgba(255,142,161,.06)"
          stroke="rgba(255,142,161,.32)"
        />
        <text
          x="59"
          y="22"
          textAnchor="middle"
          className="visual-note"
          fill={color.rose}
        >
          TRIÂNGULO
        </text>
        <path
          d="M24 100V47L94 100Z"
          fill="none"
          stroke={color.rose}
          strokeWidth="3"
        />
        <path
          d="M24 88H36V100"
          fill="none"
          stroke={color.amber}
          strokeWidth="2"
        />
        <text x="59" y="118" textAnchor="middle" className="visual-muted">
          lados · ângulos
        </text>
      </g>
      <path
        d="M145 154H163"
        stroke={color.amber}
        strokeWidth="3"
        markerEnd="url(#visual-arrow-14)"
      />
      <g transform="translate(166 91)">
        <rect
          width="108"
          height="126"
          rx="18"
          fill="rgba(66,221,255,.06)"
          stroke="rgba(66,221,255,.32)"
        />
        <text
          x="54"
          y="22"
          textAnchor="middle"
          className="visual-note"
          fill={color.cyan}
        >
          CICLO
        </text>
        <circle
          cx="54"
          cy="72"
          r="35"
          fill="none"
          stroke={color.cyan}
          strokeWidth="3"
        />
        <path
          d="M14 72H94M54 32V112M54 72L80 50"
          stroke="rgba(237,247,255,.35)"
        />
        <circle cx="80" cy="50" r="4" fill={color.amber} />
        <text x="54" y="118" textAnchor="middle" className="visual-muted">
          sinais · soluções
        </text>
      </g>
      <path
        d="M279 154H297"
        stroke={color.amber}
        strokeWidth="3"
        markerEnd="url(#visual-arrow-14)"
      />
      <g transform="translate(300 91)">
        <rect
          width="118"
          height="126"
          rx="18"
          fill="rgba(166,135,255,.06)"
          stroke="rgba(166,135,255,.32)"
        />
        <text
          x="59"
          y="22"
          textAnchor="middle"
          className="visual-note"
          fill={color.violet}
        >
          FUNÇÃO
        </text>
        <path d="M18 76H102M25 38V106" stroke="rgba(237,247,255,.24)" />
        <path
          d="M25 76C38 42 51 42 64 76S90 110 102 76"
          fill="none"
          stroke={color.violet}
          strokeWidth="3"
        />
        <text x="59" y="118" textAnchor="middle" className="visual-muted">
          período · gráfico
        </text>
      </g>
      <g transform="translate(48 236)">
        {[
          ["1", "dado"],
          ["2", "modelo"],
          ["3", "domínio"],
          ["4", "revisão"],
        ].map(([number, label], index) => (
          <g key={number} transform={`translate(${index * 94} 0)`}>
            <circle
              cx="12"
              cy="12"
              r="12"
              fill={index === 3 ? color.mint : color.amber}
            />
            <text
              x="12"
              y="17"
              textAnchor="middle"
              className="visual-chip-dark"
            >
              {number}
            </text>
            <text x="30" y="17" className="visual-label">
              {label}
            </text>
          </g>
        ))}
      </g>
      <text x="220" y="278" textAnchor="middle" className="visual-muted">
        a ferramenta certa transforma conta longa em rota curta
      </text>
    </VisualFrame>
  );
}

export default function LessonVisual({ mission }: { mission: Mission }) {
  switch (mission.day) {
    case 1:
      return <AnglesVisual mission={mission} />;
    case 2:
      return <TriangleVisual mission={mission} />;
    case 3:
      return <RatiosVisual mission={mission} />;
    case 4:
      return <NotableVisual mission={mission} />;
    case 5:
      return <RadiansVisual mission={mission} />;
    case 6:
      return <SignsVisual mission={mission} />;
    case 7:
      return <RelationsVisual mission={mission} />;
    case 8:
      return <ReductionVisual mission={mission} />;
    case 9:
      return <FunctionsVisual mission={mission} />;
    case 10:
      return <TangentVisual mission={mission} />;
    case 11:
      return <AdditionVisual mission={mission} />;
    case 12:
      return <IdentitiesVisual mission={mission} />;
    case 13:
      return <EquationsVisual mission={mission} />;
    default:
      return <BossVisual mission={mission} />;
  }
}
