import { useEffect, useMemo, useState } from "react";
import { continuationTracks } from "@/data/continuation";
import { missions, totalQuestions } from "@/data/missions";
import type { Mission } from "@/data/types";
import {
  dayScore,
  freshProgress,
  loadProgress,
  saveProgress,
  type OrbitProgress,
} from "@/lib/progress";
import LessonVisual from "./LessonVisual";
import OrbitMap from "./OrbitMap";
import QuestionDeck from "./QuestionDeck";

function OrbitHero({
  progress,
  activeMission,
  onContinue,
}: {
  progress: OrbitProgress;
  activeMission: Mission;
  onContinue: () => void;
}) {
  const completed = progress.completedDays.length;
  const percent = Math.round((completed / missions.length) * 100);
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-badges">
          <span>IFSP · 14 dias</span>
          <span>{totalQuestions} questões fechadas</span>
        </div>
        <p className="overline">Pré-temporada intensiva</p>
        <h1>
          <span>ÓRBITA</span> 14
        </h1>
        <p className="hero-lead">
          Trigonometria mastigada sem infantilização: conceito, imagem mental,
          exemplo, armadilha e prática. O teclado foi expulso das avaliações.
        </p>
        <div className="hero-actions">
          <button className="primary-action" onClick={onContinue}>
            Continuar no Dia {activeMission.day}
          </button>
          <a className="ghost-action" href="#rota">
            Ver rota completa
          </a>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>{completed}/14</strong>
            <span>missões</span>
          </div>
          <div>
            <strong>{percent}%</strong>
            <span>órbita</span>
          </div>
          <div>
            <strong>{progress.masteredDays.length}</strong>
            <span>dominadas</span>
          </div>
        </div>
      </div>
      <div className="hero-orbit" aria-hidden="true">
        <div className="orbit-ring ring-one" />
        <div className="orbit-ring ring-two" />
        <div className="orbit-ring ring-three" />
        <div className="orbit-axis axis-x" />
        <div className="orbit-axis axis-y" />
        <div className="planet">
          <span>{percent}%</span>
          <small>TRAJETÓRIA</small>
        </div>
        <i className="satellite sat-one" />
        <i className="satellite sat-two" />
        <i className="satellite sat-three" />
        <div className="orbit-label label-sen">sen θ</div>
        <div className="orbit-label label-cos">cos θ</div>
        <div className="orbit-label label-tan">tg θ</div>
      </div>
    </section>
  );
}

function MissionPanel({
  mission,
  progress,
  onClose,
  onResult,
  onFinish,
}: {
  mission: Mission;
  progress: OrbitProgress;
  onClose: () => void;
  onResult: (id: string, correct: boolean) => void;
  onFinish: () => void;
}) {
  const score = dayScore(
    progress,
    mission.questions.map((question) => question.id),
  );
  const [tab, setTab] = useState<"learn" | "practice">(() =>
    score.answered > 0 ? "practice" : "learn",
  );
  return (
    <section
      className="mission-panel"
      id="missao"
      aria-labelledby="mission-title"
    >
      <button
        className="close-panel"
        onClick={onClose}
        aria-label="Fechar missão"
      >
        ×
      </button>
      <div className="mission-intro">
        <div>
          <p className="kicker">
            Dia {mission.day} · {mission.phase} · {mission.duration}
          </p>
          <h2 id="mission-title">{mission.title}</h2>
          <p>{mission.objective}</p>
        </div>
        <div className="mission-score">
          <strong>
            {score.correct}/{mission.questions.length}
          </strong>
          <span>corretas</span>
          <small>{score.percent}%</small>
        </div>
      </div>
      <div className="mission-tabs" role="tablist">
        <button
          className={tab === "learn" ? "active" : ""}
          onClick={() => setTab("learn")}
        >
          Aprender
        </button>
        <button
          className={tab === "practice" ? "active" : ""}
          onClick={() => setTab("practice")}
        >
          Praticar
        </button>
      </div>
      {tab === "learn" ? (
        <div className="learn-layout">
          <div className="lesson-main">
            <div className="why-card">
              <span>POR QUE ISSO IMPORTA</span>
              <p>{mission.why}</p>
            </div>
            <div className="lesson-blocks">
              {mission.blocks.map((block) => (
                <article key={block.title}>
                  <small>{block.eyebrow}</small>
                  <h3>{block.title}</h3>
                  <p>{block.body}</p>
                  {block.formula && <code>{block.formula}</code>}
                </article>
              ))}
            </div>
            <article className="worked-example">
              <p className="kicker">Exemplo guiado</p>
              <h3>{mission.example.prompt}</h3>
              <ol>
                {mission.example.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <strong>{mission.example.result}</strong>
            </article>
          </div>
          <aside className="lesson-aside">
            <LessonVisual mission={mission} />
            <div className="mnemonic-card">
              <span>{mission.mnemonic.label}</span>
              <blockquote>{mission.mnemonic.chant}</blockquote>
              <p>{mission.mnemonic.meaning}</p>
            </div>
            <div className="source-card">
              <span>Mapa de leitura</span>
              <strong>{mission.source}</strong>
              <small>
                Referência de localização. A explicação e as questões deste app
                são autorais.
              </small>
            </div>
            <button
              className="primary-action full"
              onClick={() => setTab("practice")}
            >
              Entendi. Quero praticar.
            </button>
          </aside>
        </div>
      ) : (
        <QuestionDeck
          mission={mission}
          previous={progress.questionResults}
          onResult={onResult}
          onFinish={onFinish}
        />
      )}
    </section>
  );
}

export default function OrbitApp() {
  const [progress, setProgress] = useState<OrbitProgress>(freshProgress());
  const [hydrated, setHydrated] = useState(false);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const activeMission =
    missions.find((mission) => mission.day === progress.activeDay) ??
    missions[0];
  const selectedMission = openDay
    ? missions.find((mission) => mission.day === openDay)
    : undefined;

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) saveProgress(progress);
  }, [hydrated, progress]);

  const wrongQuestions = useMemo(
    () =>
      Object.values(progress.questionResults).filter(
        (result) => !result.correct,
      ).length,
    [progress.questionResults],
  );
  const wrongMissions = useMemo(
    () =>
      missions
        .map((mission) => ({
          mission,
          count: mission.questions.filter(
            (question) =>
              progress.questionResults[question.id] &&
              !progress.questionResults[question.id].correct,
          ).length,
        }))
        .filter((item) => item.count > 0),
    [progress.questionResults],
  );

  function selectDay(day: number) {
    setProgress((current) => ({
      ...current,
      activeDay: day,
      lastStudyAt: new Date().toISOString(),
    }));
    setOpenDay(day);
    window.setTimeout(
      () =>
        document
          .getElementById("missao")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      40,
    );
  }

  function recordResult(id: string, correct: boolean) {
    setProgress((current) => {
      const previous = current.questionResults[id];
      return {
        ...current,
        lastStudyAt: new Date().toISOString(),
        questionResults: {
          ...current.questionResults,
          [id]: {
            correct,
            attempts: (previous?.attempts ?? 0) + 1,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    });
  }

  function finishMission(mission: Mission) {
    setProgress((current) => {
      const score = dayScore(
        current,
        mission.questions.map((question) => question.id),
      );
      const completedDays = current.completedDays.includes(mission.day)
        ? current.completedDays
        : [...current.completedDays, mission.day];
      const masteredDays =
        score.percent >= 75 && !current.masteredDays.includes(mission.day)
          ? [...current.masteredDays, mission.day]
          : current.masteredDays;
      return {
        ...current,
        completedDays,
        masteredDays,
        activeDay: Math.min(14, mission.day + 1),
        lastStudyAt: new Date().toISOString(),
      };
    });
    setOpenDay(null);
    window.setTimeout(
      () =>
        document.getElementById("rota")?.scrollIntoView({ behavior: "smooth" }),
      40,
    );
  }

  function resetProgress() {
    if (
      window.confirm("Apagar todo o progresso da Órbita 14 neste aparelho?")
    ) {
      const clean = freshProgress();
      setProgress(clean);
      saveProgress(clean);
      setOpenDay(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#top" className="brand">
          <i />
          ÓRBITA 14
        </a>
        <nav>
          <a href="#rota">Rota</a>
          <a href="#arsenal">Arsenal</a>
          <a href="#hangar">Depois</a>
        </nav>
        <div className="top-status">
          <span>{progress.completedDays.length}/14</span>
          <i
            style={{ width: `${(progress.completedDays.length / 14) * 100}%` }}
          />
        </div>
      </header>
      <main>
        <OrbitHero
          progress={progress}
          activeMission={activeMission}
          onContinue={() => selectDay(activeMission.day)}
        />
        <div id="rota">
          <OrbitMap
            missions={missions}
            activeDay={progress.activeDay}
            completedDays={progress.completedDays}
            masteredDays={progress.masteredDays}
            onSelect={selectDay}
          />
        </div>
        {selectedMission && (
          <MissionPanel
            mission={selectedMission}
            progress={progress}
            onClose={() => setOpenDay(null)}
            onResult={recordResult}
            onFinish={() => finishMission(selectedMission)}
          />
        )}
        <section className="arsenal" id="arsenal">
          <div className="section-heading">
            <div>
              <p className="kicker">Arsenal de revisão</p>
              <h2>Memória que trabalha a seu favor.</h2>
            </div>
            <p>
              Os erros são capturados automaticamente. Nenhum formulário de
              penitência.
            </p>
          </div>
          <div className="arsenal-grid">
            <article>
              <span>01</span>
              <h3>Mnemônicos</h3>
              <p>
                Quatorze âncoras curtas, uma por missão. Feitas para ritmo e
                repetição.
              </p>
              <strong>{missions.length} cartões</strong>
            </article>
            <article>
              <span>02</span>
              <h3>Erros capturados</h3>
              <p>
                Ao reabrir uma missão pendente, a prática começa no primeiro
                erro ainda não corrigido.
              </p>
              <strong>{wrongQuestions} pendentes</strong>
              {wrongMissions.length > 0 && (
                <div className="review-links">
                  {wrongMissions.map(({ mission, count }) => (
                    <button
                      key={mission.day}
                      onClick={() => selectDay(mission.day)}
                    >
                      Dia {mission.day} · {count}
                    </button>
                  ))}
                </div>
              )}
            </article>
            <article>
              <span>03</span>
              <h3>Domínio honesto</h3>
              <p>
                75% ou mais marca domínio. Abaixo disso, a missão continua
                aberta sem bloquear sua rota.
              </p>
              <strong>{progress.masteredDays.length} dominadas</strong>
            </article>
          </div>
        </section>
        <section className="hangar" id="hangar">
          <div className="hangar-copy">
            <p className="kicker">Hangar de continuação</p>
            <h2>O componente continua. O cronômetro não.</h2>
            <p>
              Complexos e Polinômios permanecem no mapa do semestre, mas não
              consomem os 14 dias da pré-temporada. Eles entram depois que a
              órbita trigonométrica estiver estável.
            </p>
          </div>
          <div className="continuation-grid">
            {continuationTracks.map((track) => (
              <article key={track.title}>
                <small>FME 6 · continuação</small>
                <h3>{track.title}</h3>
                <p>{track.source}</p>
                <ul>
                  {track.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span>fora da rota de 14 dias</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <div>
          <strong>ÓRBITA 14</strong>
          <p>Feito para a pré-temporada de Trigonometria do IFSP.</p>
        </div>
        <button onClick={resetProgress}>zerar progresso local</button>
      </footer>
    </div>
  );
}
