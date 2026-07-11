import type { ReactNode } from "react";
import type { Mission } from "@/data/types";

const c = {
  cyan: "#42ddff",
  violet: "#a687ff",
  amber: "#ffcc66",
  rose: "#ff8ea1",
  mint: "#63f3bd",
  ink: "#07111f",
};

const visualMeta = [
  [
    "Raio-X de um polinômio",
    "Termos, grau, coeficiente líder e constante separados visualmente.",
  ],
  [
    "Identidade por coeficientes",
    "Gavetas de potências correspondentes ligadas uma a uma.",
  ],
  ["Soma por colunas", "Termos de mesma potência alinhados antes da redução."],
  [
    "Produto e termo líder",
    "Grade distributiva e previsão do grau do produto.",
  ],
  [
    "Divisão euclidiana",
    "Dividendo reconstruído por divisor, quociente e resto.",
  ],
  ["Teorema do resto", "Substituição P de a decidindo raiz e fator."],
  ["Briot-Ruffini", "Tabela sintética com o ciclo desce, multiplica e soma."],
  ["Produto nulo", "Equação fatorada abrindo ramos para cada raiz."],
  [
    "Raízes viram fatores",
    "Correspondência entre cada raiz r e o fator x menos r.",
  ],
  ["Multiplicidade", "Raiz par tocando o eixo e raiz ímpar atravessando-o."],
  [
    "Relações de Girard",
    "Coeficientes alimentando soma, pares e produto das raízes.",
  ],
  [
    "Radar racional",
    "Funil de candidatos do termo final sobre o termo inicial.",
  ],
  ["Protocolo de caça", "Fluxo lista, testa, divide e fatora."],
  [
    "Boss da Forja",
    "Painel final reunindo leitura, raiz, divisão e verificação.",
  ],
] as const;

function Frame({
  mission,
  children,
}: {
  mission: Mission;
  children: ReactNode;
}) {
  const [heading, description] = visualMeta[mission.day - 1];
  const titleId = `poly-title-${mission.day}`;
  const descriptionId = `poly-description-${mission.day}`;
  const panelId = `poly-panel-${mission.day}`;
  const gridId = `poly-grid-${mission.day}`;
  const glowId = `poly-glow-${mission.day}`;
  const arrowId = `poly-arrow-${mission.day}`;

  return (
    <svg
      className="lesson-visual polynomial-visual"
      viewBox="0 0 440 286"
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>{heading}</title>
      <desc id={descriptionId}>{description}</desc>
      <defs>
        <linearGradient id={panelId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#102238" />
          <stop offset=".55" stopColor="#0b1728" />
          <stop offset="1" stopColor="#211126" />
        </linearGradient>
        <pattern
          id={gridId}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <path d="M22 0H0V22" fill="none" stroke="rgba(255,204,102,.06)" />
        </pattern>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
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
          <path d="M0 0L10 5L0 10Z" fill={c.amber} />
        </marker>
      </defs>
      <rect
        x="1"
        y="1"
        width="438"
        height="284"
        rx="24"
        fill={`url(#${panelId})`}
      />
      <rect
        x="1"
        y="1"
        width="438"
        height="284"
        rx="24"
        fill={`url(#${gridId})`}
      />
      <path d="M22 69H418" stroke="rgba(255,255,255,.12)" />
      <text x="22" y="28" className="visual-kicker poly-kicker">
        FORJA {String(mission.day).padStart(2, "0")} · MAPA VISUAL
      </text>
      <text x="22" y="54" className="visual-title">
        {heading}
      </text>
      {children}
    </svg>
  );
}

function Pill({
  x,
  y,
  width,
  children,
  tone = c.cyan,
}: {
  x: number;
  y: number;
  width: number;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height="30"
        rx="15"
        fill={`${tone}18`}
        stroke={tone}
        strokeOpacity=".65"
      />
      <text
        x={x + width / 2}
        y={y + 19}
        textAnchor="middle"
        className="visual-label"
      >
        {children}
      </text>
    </g>
  );
}

function Anatomy({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      <text x="50" y="132" className="visual-formula">
        P(x)=
      </text>
      <text x="105" y="132" className="visual-formula" fill={c.amber}>
        5x⁴
      </text>
      <text x="150" y="132" className="visual-formula">
        −
      </text>
      <text x="168" y="132" className="visual-formula" fill={c.cyan}>
        2x
      </text>
      <text x="198" y="132" className="visual-formula">
        +
      </text>
      <text x="218" y="132" className="visual-formula" fill={c.violet}>
        9
      </text>
      <path d="M126 140V170" stroke={c.amber} />
      <path d="M183 140V170" stroke={c.cyan} />
      <path d="M224 140V170" stroke={c.violet} />
      <Pill x={63} y={177} width={126} tone={c.amber}>
        grau 4 · líder 5
      </Pill>
      <Pill x={198} y={177} width={112} tone={c.violet}>
        constante 9
      </Pill>
      <Pill x={120} y={223} width={200} tone={c.mint}>
        P(a)=0 → a é raiz
      </Pill>
    </Frame>
  );
}

function Identity({ mission }: { mission: Mission }) {
  const rows = [
    ["x²", "a−1", "3"],
    ["x", "b+2", "−1"],
    ["1", "4", "4"],
  ];
  return (
    <Frame mission={mission}>
      <text x="80" y="91" className="visual-note">
        EXPRESSÃO A
      </text>
      <text x="286" y="91" className="visual-note">
        EXPRESSÃO B
      </text>
      {rows.map(([power, left, right], index) => {
        const y = 108 + index * 48;
        return (
          <g key={power}>
            <rect
              x="28"
              y={y}
              width="162"
              height="34"
              rx="9"
              fill="rgba(66,221,255,.08)"
              stroke={c.cyan}
              strokeOpacity=".45"
            />
            <rect
              x="250"
              y={y}
              width="162"
              height="34"
              rx="9"
              fill="rgba(166,135,255,.08)"
              stroke={c.violet}
              strokeOpacity=".45"
            />
            <text x="48" y={y + 22} className="visual-label">
              {power}
            </text>
            <text
              x="151"
              y={y + 22}
              textAnchor="end"
              className="visual-formula"
            >
              {left}
            </text>
            <path
              d={`M194 ${y + 17}H246`}
              stroke={c.amber}
              strokeWidth="2"
              markerEnd={`url(#poly-arrow-${mission.day})`}
            />
            <text x="270" y={y + 22} className="visual-label">
              {power}
            </text>
            <text
              x="383"
              y={y + 22}
              textAnchor="end"
              className="visual-formula"
            >
              {right}
            </text>
          </g>
        );
      })}
      <text x="220" y="266" textAnchor="middle" className="visual-note">
        MESMA POTÊNCIA · MESMA GAVETA
      </text>
    </Frame>
  );
}

function Columns({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      {["x²", "x", "1"].map((label, index) => (
        <g key={label}>
          <rect
            x={64 + index * 106}
            y="95"
            width="90"
            height="132"
            rx="14"
            fill="rgba(66,221,255,.05)"
            stroke="rgba(66,221,255,.28)"
          />
          <text
            x={109 + index * 106}
            y="118"
            textAnchor="middle"
            className="visual-note"
          >
            {label}
          </text>
        </g>
      ))}
      <text x="109" y="151" textAnchor="middle" className="visual-formula">
        2
      </text>
      <text x="215" y="151" textAnchor="middle" className="visual-formula">
        −3
      </text>
      <text x="321" y="151" textAnchor="middle" className="visual-formula">
        1
      </text>
      <text x="109" y="180" textAnchor="middle" className="visual-formula">
        +1
      </text>
      <text x="215" y="180" textAnchor="middle" className="visual-formula">
        +5
      </text>
      <text x="321" y="180" textAnchor="middle" className="visual-formula">
        −4
      </text>
      <path d="M78 191H350" stroke={c.amber} strokeWidth="2" />
      <text x="109" y="216" textAnchor="middle" className="visual-formula">
        3
      </text>
      <text x="215" y="216" textAnchor="middle" className="visual-formula">
        2
      </text>
      <text x="321" y="216" textAnchor="middle" className="visual-formula">
        −3
      </text>
      <text x="220" y="260" textAnchor="middle" className="visual-note">
        JUNTE COEFICIENTES · PRESERVE A POTÊNCIA
      </text>
    </Frame>
  );
}

function Product({ mission }: { mission: Mission }) {
  const cells = ["2x³", "6x", "−x²", "−3"];
  return (
    <Frame mission={mission}>
      <text x="220" y="96" textAnchor="middle" className="visual-formula">
        (2x−1)(x²+3)
      </text>
      <text x="162" y="124" textAnchor="middle" className="visual-note">
        x²
      </text>
      <text x="268" y="124" textAnchor="middle" className="visual-note">
        3
      </text>
      <text x="82" y="160" textAnchor="middle" className="visual-note">
        2x
      </text>
      <text x="82" y="204" textAnchor="middle" className="visual-note">
        −1
      </text>
      {cells.map((value, index) => {
        const x = 112 + (index % 2) * 106;
        const y = 136 + Math.floor(index / 2) * 44;
        return (
          <g key={value}>
            <rect
              x={x}
              y={y}
              width="100"
              height="38"
              rx="9"
              fill="rgba(166,135,255,.09)"
              stroke={index === 0 ? c.amber : c.violet}
              strokeOpacity=".6"
            />
            <text
              x={x + 50}
              y={y + 24}
              textAnchor="middle"
              className="visual-formula"
            >
              {value}
            </text>
          </g>
        );
      })}
      <Pill x={100} y={236} width={240} tone={c.amber}>
        graus 1+2=3 · líderes 2·1=2
      </Pill>
    </Frame>
  );
}

function Division({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      <text x="220" y="116" textAnchor="middle" className="visual-formula">
        D(x) = d(x) · q(x) + r(x)
      </text>
      <Pill x={24} y={148} width={92} tone={c.cyan}>
        dividendo
      </Pill>
      <Pill x={128} y={148} width={82} tone={c.violet}>
        divisor
      </Pill>
      <Pill x={222} y={148} width={92} tone={c.mint}>
        quociente
      </Pill>
      <Pill x={326} y={148} width={88} tone={c.rose}>
        resto
      </Pill>
      <path
        d="M65 187C105 229 160 229 198 188"
        fill="none"
        stroke={c.cyan}
        strokeWidth="2"
      />
      <path
        d="M243 188C280 229 335 229 375 188"
        fill="none"
        stroke={c.violet}
        strokeWidth="2"
      />
      <text x="220" y="244" textAnchor="middle" className="visual-note">
        r=0 OU grau(r)&lt;grau(d)
      </text>
    </Frame>
  );
}

function Remainder({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      <Pill x={30} y={118} width={112} tone={c.cyan}>
        divisor x−a
      </Pill>
      <path
        d="M148 133H198"
        stroke={c.amber}
        strokeWidth="3"
        markerEnd={`url(#poly-arrow-${mission.day})`}
      />
      <circle
        cx="245"
        cy="133"
        r="42"
        fill="rgba(255,204,102,.09)"
        stroke={c.amber}
        strokeWidth="2"
      />
      <text x="245" y="138" textAnchor="middle" className="visual-formula">
        P(a)
      </text>
      <path
        d="M289 133H337"
        stroke={c.amber}
        strokeWidth="3"
        markerEnd={`url(#poly-arrow-${mission.day})`}
      />
      <Pill x={344} y={118} width={70} tone={c.rose}>
        resto
      </Pill>
      <path
        d="M245 178V206"
        stroke={c.mint}
        strokeWidth="2"
        markerEnd={`url(#poly-arrow-${mission.day})`}
      />
      <Pill x={130} y={216} width={230} tone={c.mint}>
        P(a)=0 ⇔ raiz a ⇔ fator x−a
      </Pill>
    </Frame>
  );
}

function Ruffini({ mission }: { mission: Mission }) {
  const top = [1, -6, 11, -6];
  const bottom = [1, -5, 6, 0];
  return (
    <Frame mission={mission}>
      <text x="52" y="128" className="visual-formula" fill={c.amber}>
        1
      </text>
      <path
        d="M78 96V222M78 158H390"
        stroke="rgba(255,255,255,.28)"
        strokeWidth="2"
      />
      {top.map((value, index) => (
        <text
          key={`t-${value}-${index}`}
          x={125 + index * 78}
          y="128"
          textAnchor="middle"
          className="visual-formula"
        >
          {value}
        </text>
      ))}
      {[1, -5, 6].map((value, index) => (
        <text
          key={`m-${value}-${index}`}
          x={203 + index * 78}
          y="151"
          textAnchor="middle"
          className="visual-muted"
        >
          {value > 0 ? `+${value}` : value}
        </text>
      ))}
      {bottom.map((value, index) => (
        <text
          key={`b-${value}-${index}`}
          x={125 + index * 78}
          y="192"
          textAnchor="middle"
          className="visual-formula"
          fill={index === 3 ? c.mint : undefined}
        >
          {value}
        </text>
      ))}
      <text x="220" y="231" textAnchor="middle" className="visual-note">
        DESCE → MULTIPLICA → SOMA
      </text>
      <text x="220" y="255" textAnchor="middle" className="visual-muted">
        q=x²−5x+6 · resto 0
      </text>
    </Frame>
  );
}

function ProductZero({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      <Pill x={116} y={91} width={208} tone={c.amber}>
        (x−2)(x+3)=0
      </Pill>
      <path
        d="M220 123V142M220 142L130 171M220 142L310 171"
        fill="none"
        stroke={c.amber}
        strokeWidth="2"
      />
      <Pill x={55} y={177} width={150} tone={c.cyan}>
        x−2=0
      </Pill>
      <Pill x={235} y={177} width={150} tone={c.violet}>
        x+3=0
      </Pill>
      <path d="M130 209V224M310 209V224" stroke={c.mint} strokeWidth="2" />
      <text x="130" y="249" textAnchor="middle" className="visual-formula">
        x=2
      </text>
      <text x="310" y="249" textAnchor="middle" className="visual-formula">
        x=−3
      </text>
    </Frame>
  );
}

function Decomposition({ mission }: { mission: Mission }) {
  const roots = [
    ["r₁", "x−r₁", c.cyan],
    ["r₂", "x−r₂", c.violet],
    ["r₃", "x−r₃", c.rose],
  ];
  return (
    <Frame mission={mission}>
      {roots.map(([root, factor, tone], index) => {
        const y = 96 + index * 48;
        return (
          <g key={root}>
            <circle
              cx="88"
              cy={y + 15}
              r="22"
              fill={`${tone}18`}
              stroke={tone}
            />
            <text
              x="88"
              y={y + 20}
              textAnchor="middle"
              className="visual-formula"
            >
              {root}
            </text>
            <path
              d={`M112 ${y + 15}H188`}
              stroke={tone}
              strokeWidth="2"
              markerEnd={`url(#poly-arrow-${mission.day})`}
            />
            <rect
              x="200"
              y={y}
              width="150"
              height="30"
              rx="9"
              fill={`${tone}12`}
              stroke={tone}
              strokeOpacity=".55"
            />
            <text
              x="275"
              y={y + 20}
              textAnchor="middle"
              className="visual-formula"
            >
              {factor}
            </text>
          </g>
        );
      })}
      <text x="220" y="258" textAnchor="middle" className="visual-note">
        P(x)=a(x−r₁)(x−r₂)(x−r₃)
      </text>
    </Frame>
  );
}

function Multiplicity({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      <path d="M35 196H405" stroke="rgba(255,255,255,.28)" strokeWidth="2" />
      <path
        d="M72 105C116 105 128 196 176 196C224 196 236 105 280 105"
        fill="none"
        stroke={c.violet}
        strokeWidth="4"
      />
      <circle cx="176" cy="196" r="6" fill={c.violet} />
      <text x="176" y="220" textAnchor="middle" className="visual-label">
        par · toca
      </text>
      <path
        d="M278 232C315 231 329 105 378 104"
        fill="none"
        stroke={c.cyan}
        strokeWidth="4"
      />
      <circle cx="328" cy="196" r="6" fill={c.cyan} />
      <text x="342" y="220" textAnchor="middle" className="visual-label">
        ímpar · cruza
      </text>
      <Pill x={102} y={86} width={116} tone={c.violet}>
        (x−r)²
      </Pill>
      <Pill x={292} y={86} width={116} tone={c.cyan}>
        (x−s)³
      </Pill>
      <text x="220" y="260" textAnchor="middle" className="visual-note">
        EXPOENTE DO FATOR = MULTIPLICIDADE
      </text>
    </Frame>
  );
}

function Girard({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      <Pill x={100} y={88} width={240} tone={c.amber}>
        x³−Sx²+Px−R=0
      </Pill>
      <path
        d="M220 120V142M220 142L96 176M220 142V176M220 142L344 176"
        fill="none"
        stroke={c.amber}
        strokeWidth="2"
      />
      <Pill x={28} y={183} width={136} tone={c.cyan}>
        α+β+γ=S
      </Pill>
      <Pill x={171} y={183} width={98} tone={c.violet}>
        pares=P
      </Pill>
      <Pill x={276} y={183} width={136} tone={c.rose}>
        αβγ=R
      </Pill>
      <text x="220" y="252" textAnchor="middle" className="visual-note">
        COEFICIENTES CONTAM A HISTÓRIA DAS RAÍZES
      </text>
    </Frame>
  );
}

function RationalRadar({ mission }: { mission: Mission }) {
  return (
    <Frame mission={mission}>
      <Pill x={34} y={94} width={164} tone={c.rose}>
        divisores do final
      </Pill>
      <Pill x={242} y={94} width={164} tone={c.cyan}>
        divisores do líder
      </Pill>
      <path
        d="M116 126L185 177M324 126L255 177"
        stroke={c.amber}
        strokeWidth="2"
      />
      <path
        d="M150 166H290L255 214H185Z"
        fill="rgba(255,204,102,.09)"
        stroke={c.amber}
        strokeWidth="2"
      />
      <text x="220" y="190" textAnchor="middle" className="visual-formula">
        ± p/q
      </text>
      <Pill x={128} y={229} width={184} tone={c.mint}>
        teste P(p/q)=0
      </Pill>
      <text x="220" y="272" textAnchor="middle" className="visual-muted">
        candidato ≠ raiz confirmada
      </text>
    </Frame>
  );
}

function Hunt({ mission }: { mission: Mission }) {
  const steps = [
    ["1", "LISTA", c.rose],
    ["2", "TESTA", c.amber],
    ["3", "DIVIDE", c.cyan],
    ["4", "FATORA", c.mint],
  ];
  return (
    <Frame mission={mission}>
      {steps.map(([number, label, tone], index) => {
        const x = 24 + index * 104;
        return (
          <g key={label}>
            <circle
              cx={x + 42}
              cy="147"
              r="36"
              fill={`${tone}18`}
              stroke={tone}
              strokeWidth="2"
            />
            <text
              x={x + 42}
              y="143"
              textAnchor="middle"
              className="visual-muted"
            >
              {number}
            </text>
            <text
              x={x + 42}
              y="161"
              textAnchor="middle"
              className="visual-note"
            >
              {label}
            </text>
            {index < 3 && (
              <path
                d={`M${x + 80} 147H${x + 102}`}
                stroke={c.amber}
                strokeWidth="2"
                markerEnd={`url(#poly-arrow-${mission.day})`}
              />
            )}
          </g>
        );
      })}
      <Pill x={83} y={213} width={274} tone={c.violet}>
        uma raiz reduz o grau e abre as outras
      </Pill>
    </Frame>
  );
}

function Boss({ mission }: { mission: Mission }) {
  const nodes = [
    ["TERMOS", 220, 99, c.amber],
    ["RAIZ", 112, 172, c.cyan],
    ["DIVISÃO", 328, 172, c.violet],
    ["CONFERE", 220, 244, c.mint],
  ] as const;
  return (
    <Frame mission={mission}>
      <circle
        cx="220"
        cy="172"
        r="58"
        fill="rgba(255,204,102,.08)"
        stroke={c.amber}
        strokeWidth="2"
        strokeDasharray="6 7"
      />
      <circle
        cx="220"
        cy="172"
        r="34"
        fill="rgba(255,204,102,.16)"
        stroke={c.amber}
        filter={`url(#poly-glow-${mission.day})`}
      />
      <text x="220" y="169" textAnchor="middle" className="visual-note">
        MODO
      </text>
      <text x="220" y="184" textAnchor="middle" className="visual-formula">
        TININDO
      </text>
      {nodes.map(([label, x, y, tone]) => (
        <g key={label}>
          <circle cx={x} cy={y} r="27" fill={`${tone}18`} stroke={tone} />
          <text x={x} y={y + 4} textAnchor="middle" className="visual-muted">
            {label}
          </text>
        </g>
      ))}
      <path
        d="M220 127V136M166 172H183M257 172H274M220 207V216"
        stroke="rgba(255,255,255,.4)"
        strokeWidth="2"
      />
    </Frame>
  );
}

export default function PolynomialVisual({ mission }: { mission: Mission }) {
  const visuals = [
    Anatomy,
    Identity,
    Columns,
    Product,
    Division,
    Remainder,
    Ruffini,
    ProductZero,
    Decomposition,
    Multiplicity,
    Girard,
    RationalRadar,
    Hunt,
    Boss,
  ];
  const Visual = visuals[mission.day - 1] ?? Boss;
  return <Visual mission={mission} />;
}
