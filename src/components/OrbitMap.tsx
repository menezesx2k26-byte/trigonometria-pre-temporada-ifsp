import type { Mission } from "@/data/types";

type OrbitMapProps = {
  missions: Mission[];
  activeDay: number;
  completedDays: number[];
  masteredDays: number[];
  onSelect: (day: number) => void;
};

export default function OrbitMap({
  missions,
  activeDay,
  completedDays,
  masteredDays,
  onSelect,
}: OrbitMapProps) {
  return (
    <section className="orbit-map" aria-labelledby="route-title">
      <div className="section-heading">
        <div>
          <p className="kicker">Mapa da campanha</p>
          <h2 id="route-title">Quatorze dias. Uma órbita limpa.</h2>
        </div>
        <p>
          Sem bloqueio artificial: você pode abrir qualquer missão. A rota
          recomenda; não te aprisiona.
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
              key={mission.day}
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
