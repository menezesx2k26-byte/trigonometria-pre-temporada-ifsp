import type { CampaignId, Mission } from "@/data/types";

type OrbitMapProps = {
  missions: Mission[];
  campaign: CampaignId;
  activeDay: number;
  completedDays: number[];
  masteredDays: number[];
  onSelect: (day: number) => void;
};

export default function OrbitMap({
  missions,
  campaign,
  activeDay,
  completedDays,
  masteredDays,
  onSelect,
}: OrbitMapProps) {
  const titleId = `route-title-${campaign}`;
  const isPoly = campaign === "poly";
  return (
    <section
      className={`orbit-map ${isPoly ? "poly-map" : ""}`}
      aria-labelledby={titleId}
    >
      <div className="section-heading">
        <div>
          <p className="kicker">
            {isPoly ? "Side quest diária" : "Campanha principal"}
          </p>
          <h2 id={titleId}>
            {isPoly
              ? "Forja Polinomial: curta, diária e cumulativa."
              : "Trigonometria: quatorze dias, uma órbita limpa."}
          </h2>
        </div>
        <p>
          {isPoly
            ? "Quatro questões por dia. Dá para terminar antes da preguiça perceber que você começou."
            : "Sem bloqueio artificial: você pode abrir qualquer missão. A rota recomenda; não te aprisiona."}
        </p>
      </div>
      <div className="mission-grid">
        {missions.map((mission) => {
          const isMastered = masteredDays.includes(mission.day);
          const isComplete = completedDays.includes(mission.day);
          const status = isMastered
            ? "dominado"
            : isComplete
              ? "concluído"
              : mission.day === activeDay
                ? "agora"
                : "disponível";
          return (
            <button
              className={`mission-node ${mission.day === activeDay ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
              key={`${campaign}-${mission.day}`}
              onClick={() => onSelect(mission.day)}
              aria-current={mission.day === activeDay ? "step" : undefined}
            >
              <span className="node-orb">
                {String(mission.day).padStart(2, "0")}
              </span>
              <span className="node-copy">
                <small>
                  {mission.phase} · {status}
                </small>
                <strong>{mission.shortTitle}</strong>
                <em>{mission.duration}</em>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
