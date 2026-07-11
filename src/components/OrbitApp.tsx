import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { continuationTracks } from "@/data/continuation";
import { missions, totalQuestions } from "@/data/missions";
import {
  polynomialMissions,
  totalPolynomialQuestions,
} from "@/data/polynomialMissions";
import type { CampaignId, Mission } from "@/data/types";
import {
  completeMission,
  dayScore,
  freshProgress,
  loadProgress,
  saveProgress,
  type OrbitProgress,
} from "@/lib/progress";
import LessonVisual from "./LessonVisual";
import OrbitMap from "./OrbitMap";
import PolynomialVisual from "./PolynomialVisual";
import QuestionDeck from "./QuestionDeck";

const allMissions = [...missions, ...polynomialMissions];
const totalMissionCount = allMissions.length;
const totalQuestionCount = totalQuestions + totalPolynomialQuestions;

const dailyFocus = [
  "Aprender a ler a linguagem",
  "Reconhecer estruturas",
  "Organizar antes de calcular",
  "Prever o resultado",
  "Trocar unidades e reconstruir contas",
  "Usar sinais como atalho",
  "Aplicar relações sem decorar no vazio",
  "Reduzir problemas ao caso conhecido",
  "Ler funções e fatores",
  "Controlar transformações",
  "Extrair informação escondida",
  "Provar antes de apertar botões",
  "Resolver com protocolo",
  "Integrar e conferir",
];

type OpenMission = {
  campaign: CampaignId;
  day: number;
};

function campaignProgress(progress: OrbitProgress, campaign: CampaignId) {
  return campaign === "trig"
    ? {
        activeDay: progress.activeDay,
        completedDays: progress.completedDays,
        masteredDays: progress.masteredDays,
      }
    : {
        activeDay: progress.polyActiveDay,
        completedDays: progress.polyCompletedDays,
        masteredDays: progress.polyMasteredDays,
      };
}

function OrbitHero({
  progress,
  activeTrig,
  activePoly,
  onContinueTrig,
  onContinuePoly,
}: {
  progress: OrbitProgress;
  activeTrig: Mission;
  activePoly: Mission;
  onContinueTrig: () => void;
  onContinuePoly: () => void;
}) {
  const completed =
    progress.completedDays.length + progress.polyCompletedDays.length;
  const mastered =
    progress.masteredDays.length + progress.polyMasteredDays.length;
  const comboDays = Array.from({ length: 14 }, (_, index) => index + 1).filter(
    (day) =>
      progress.completedDays.includes(day) &&
      progress.polyCompletedDays.includes(day),
  ).length;
  const percent = Math.round((completed / totalMissionCount) * 100);
  const xp = completed * 100 + mastered * 50;
  const level = Math.floor(xp / 300) + 1;

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-badges">
          <span>IFSP · 14 dias · campanha dupla</span>
          <span>{totalQuestionCount} questões fechadas</span>
        </div>
        <p className="overline">Pré-temporada em modo jogo</p>
        <h1>
          <span>ÓRBITA</span> 14
        </h1>
        <p className="hero-lead">
          Trigonometria como campanha principal. Polinômios como side quest
          diária de vinte minutos. Você avança leve, mas chega no semestre com
          duas armas carregadas.
        </p>
        <div className="hero-actions">
          <button className="primary-action" onClick={onContinueTrig}>
            Trig · continuar Dia {activeTrig.day}
          </button>
          <button className="ghost-action poly-action" onClick={onContinuePoly}>
            Forja · side quest {activePoly.day}
          </button>
        </div>
        <div className="hero-metrics dual-metrics">
          <div>
            <strong>{comboDays}/14</strong>
            <span>combos diários</span>
          </div>
          <div>
            <strong>{xp} XP</strong>
            <span>nível {level}</span>
          </div>
          <div>
            <strong>{mastered}/28</strong>
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
        <div className="orbit-label label-cos">P(x)</div>
        <div className="orbit-label label-tan">x−r</div>
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
  const isPoly = mission.campaign === "poly";
  const tabPrefix = mission.campaign + "-" + mission.day;
  const learnTabId = tabPrefix + "-learn-tab";
  const practiceTabId = tabPrefix + "-practice-tab";
  const panelId = tabPrefix + "-panel";

  function moveTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextTab = tab === "learn" ? "practice" : "learn";
    setTab(nextTab);
    window.setTimeout(
      () =>
        document
          .getElementById(nextTab === "learn" ? learnTabId : practiceTabId)
          ?.focus(),
      0,
    );
  }

  return (
    <section
      className={"mission-panel " + (isPoly ? "poly-panel" : "")}
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
            {isPoly ? "Side quest" : "Missão principal"} · Dia {mission.day} ·{" "}
            {mission.phase} · {mission.duration}
          </p>
          <h2 id="mission-title" tabIndex={-1}>
            {mission.title}
          </h2>
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
      <div
        className="mission-tabs"
        role="tablist"
        aria-label="Conteúdo da missão"
        onKeyDown={moveTab}
      >
        <button
          id={learnTabId}
          role="tab"
          aria-selected={tab === "learn"}
          aria-controls={panelId}
          className={tab === "learn" ? "active" : ""}
          onClick={() => setTab("learn")}
        >
          Aprender
        </button>
        <button
          id={practiceTabId}
          role="tab"
          aria-selected={tab === "practice"}
          aria-controls={panelId}
          className={tab === "practice" ? "active" : ""}
          onClick={() => setTab("practice")}
        >
          Praticar
        </button>
      </div>
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tab === "learn" ? learnTabId : practiceTabId}
      >
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
              {isPoly ? (
                <PolynomialVisual mission={mission} />
              ) : (
                <LessonVisual mission={mission} />
              )}
              <div className="mnemonic-card">
                <span>{mission.mnemonic.label}</span>
                <blockquote>{mission.mnemonic.chant}</blockquote>
                <p>{mission.mnemonic.meaning}</p>
              </div>
              <div className="source-card">
                <span>Mapa de leitura</span>
                <strong>{mission.source}</strong>
                <small>
                  Referência de localização. A explicação, os diagramas e as
                  questões deste app são autorais.
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
      </div>
    </section>
  );
}

function DailyPlan({
  progress,
  onOpen,
}: {
  progress: OrbitProgress;
  onOpen: (campaign: CampaignId, day: number) => void;
}) {
  return (
    <section className="daily-plan" id="plano" aria-labelledby="daily-title">
      <div className="section-heading">
        <div>
          <p className="kicker">Protocolo das duas semanas</p>
          <h2 id="daily-title">Leve para começar. Substancial ao terminar.</h2>
        </div>
        <p>
          O combo normal cabe em 75–100 minutos. Em dia quebrado, faça a side
          quest de Polinômios e preserve o movimento.
        </p>
      </div>
      <div className="effort-modes">
        <article>
          <span>20–30 min</span>
          <h3>Modo sobrevivência</h3>
          <p>Faça apenas a Forja. Quatro questões e a corrente não quebra.</p>
        </article>
        <article className="recommended-mode">
          <span>75–100 min</span>
          <h3>Combo completo</h3>
          <p>Trigonometria principal + side quest polinomial do mesmo dia.</p>
        </article>
        <article>
          <span>+10 min</span>
          <h3>Modo Boss</h3>
          <p>Reabra dois erros capturados. Sem lista infinita de penitência.</p>
        </article>
      </div>
      <div className="combo-grid">
        {missions.map((trigMission) => {
          const polyMission = polynomialMissions[trigMission.day - 1];
          const trigDone = progress.completedDays.includes(trigMission.day);
          const polyDone = progress.polyCompletedDays.includes(trigMission.day);
          const comboDone = trigDone && polyDone;
          return (
            <article
              className={"combo-card " + (comboDone ? "combo-done" : "")}
              key={trigMission.day}
            >
              <div className="combo-day">
                <span>{String(trigMission.day).padStart(2, "0")}</span>
                <small>
                  {comboDone
                    ? "COMBO FECHADO"
                    : dailyFocus[trigMission.day - 1]}
                </small>
              </div>
              <button
                className={trigDone ? "done" : ""}
                onClick={() => onOpen("trig", trigMission.day)}
              >
                <small>TRIG · {trigMission.duration}</small>
                <strong>{trigMission.shortTitle}</strong>
              </button>
              <i aria-hidden="true">+</i>
              <button
                className={"poly-combo " + (polyDone ? "done" : "")}
                onClick={() => onOpen("poly", polyMission.day)}
              >
                <small>FORJA · {polyMission.duration}</small>
                <strong>{polyMission.shortTitle}</strong>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function OrbitApp() {
  const [progress, setProgress] = useState<OrbitProgress>(freshProgress());
  const [hydrated, setHydrated] = useState(false);
  const [routeCampaign, setRouteCampaign] = useState<CampaignId>("trig");
  const [openMission, setOpenMission] = useState<OpenMission | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const trigProgress = campaignProgress(progress, "trig");
  const polyProgress = campaignProgress(progress, "poly");
  const activeTrig =
    missions.find((mission) => mission.day === trigProgress.activeDay) ??
    missions[0];
  const activePoly =
    polynomialMissions.find(
      (mission) => mission.day === polyProgress.activeDay,
    ) ?? polynomialMissions[0];
  const selectedMission = openMission
    ? (openMission.campaign === "trig" ? missions : polynomialMissions).find(
        (mission) => mission.day === openMission.day,
      )
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
      allMissions
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

  const completedTotal =
    progress.completedDays.length + progress.polyCompletedDays.length;
  const masteredTotal =
    progress.masteredDays.length + progress.polyMasteredDays.length;
  const xp = completedTotal * 100 + masteredTotal * 50;
  const level = Math.floor(xp / 300) + 1;

  function selectMission(campaign: CampaignId, day: number) {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setRouteCampaign(campaign);
    setOpenMission({ campaign, day });
    window.setTimeout(() => {
      document
        .getElementById("missao")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("mission-title")?.focus();
    }, 40);
  }

  function closeMission() {
    setOpenMission(null);
    window.setTimeout(() => returnFocusRef.current?.focus(), 40);
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
    setProgress((current) =>
      completeMission(
        current,
        mission.campaign,
        mission.day,
        mission.questions.map((question) => question.id),
      ),
    );
    setOpenMission(null);
    window.setTimeout(
      () =>
        document
          .getElementById("campanhas")
          ?.scrollIntoView({ behavior: "smooth" }),
      40,
    );
  }

  function resetProgress() {
    if (
      window.confirm(
        "Apagar todo o progresso de Trigonometria e Polinômios neste aparelho?",
      )
    ) {
      const clean = freshProgress();
      setProgress(clean);
      saveProgress(clean);
      setOpenMission(null);
    }
  }

  const visibleMissions =
    routeCampaign === "trig" ? missions : polynomialMissions;
  const visibleProgress =
    routeCampaign === "trig" ? trigProgress : polyProgress;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#top" className="brand">
          <i />
          ÓRBITA 14
        </a>
        <nav aria-label="Navegação principal">
          <a href="#campanhas">Campanhas</a>
          <a href="#plano">Plano diário</a>
          <a href="#arsenal">Arsenal</a>
          <a href="#hangar">Depois</a>
        </nav>
        <div
          className="top-status"
          aria-label={completedTotal + " de 28 missões concluídas"}
        >
          <span>{completedTotal}/28</span>
          <i style={{ width: (completedTotal / 28) * 100 + "%" }} />
        </div>
      </header>
      <main>
        <OrbitHero
          progress={progress}
          activeTrig={activeTrig}
          activePoly={activePoly}
          onContinueTrig={() => selectMission("trig", activeTrig.day)}
          onContinuePoly={() => selectMission("poly", activePoly.day)}
        />

        <section
          className="campaign-hub"
          id="campanhas"
          aria-labelledby="campaign-title"
        >
          <div className="campaign-intro">
            <div>
              <p className="kicker">Escolha sua frente de batalha</p>
              <h2 id="campaign-title">Duas campanhas. Um único Dia 14.</h2>
            </div>
            <p>
              Trigonometria carrega a sessão principal. A Forja Polinomial entra
              curta, fecha um conceito por dia e acumula 56 questões sem parecer
              uma segunda faculdade.
            </p>
          </div>
          <div className="campaign-selector" aria-label="Selecionar campanha">
            <button
              aria-pressed={routeCampaign === "trig"}
              className={routeCampaign === "trig" ? "active" : ""}
              onClick={() => setRouteCampaign("trig")}
            >
              <span>01</span>
              <strong>Órbita Trigonométrica</strong>
              <small>
                {progress.completedDays.length}/14 concluídas · 55–70 min
              </small>
            </button>
            <button
              aria-pressed={routeCampaign === "poly"}
              className={
                "poly-selector " + (routeCampaign === "poly" ? "active" : "")
              }
              onClick={() => setRouteCampaign("poly")}
            >
              <span>02</span>
              <strong>Forja Polinomial</strong>
              <small>
                {progress.polyCompletedDays.length}/14 concluídas · 20–30 min
              </small>
            </button>
          </div>
          <OrbitMap
            missions={visibleMissions}
            campaign={routeCampaign}
            activeDay={visibleProgress.activeDay}
            completedDays={visibleProgress.completedDays}
            masteredDays={visibleProgress.masteredDays}
            onSelect={(day) => selectMission(routeCampaign, day)}
          />
        </section>

        {selectedMission && (
          <MissionPanel
            key={selectedMission.campaign + "-" + selectedMission.day}
            mission={selectedMission}
            progress={progress}
            onClose={closeMission}
            onResult={recordResult}
            onFinish={() => finishMission(selectedMission)}
          />
        )}

        <DailyPlan progress={progress} onOpen={selectMission} />

        <section className="arsenal" id="arsenal">
          <div className="section-heading">
            <div>
              <p className="kicker">Arsenal de revisão</p>
              <h2>O jogo guarda o que precisa voltar.</h2>
            </div>
            <p>
              Sem streak punitiva e sem formulário de penitência. O progresso
              mostra habilidade atual, não uma medalha eterna.
            </p>
          </div>
          <div className="arsenal-grid">
            <article>
              <span>01</span>
              <h3>28 mnemônicos</h3>
              <p>
                Uma âncora por missão: quatorze para o ciclo e quatorze para a
                forja.
              </p>
              <strong>{allMissions.length} cartões</strong>
            </article>
            <article>
              <span>02</span>
              <h3>Erros capturados</h3>
              <p>
                Reabra uma missão e a prática começa pelo primeiro erro ainda
                não corrigido.
              </p>
              <strong>{wrongQuestions} pendentes</strong>
              {wrongMissions.length > 0 && (
                <div className="review-links">
                  {wrongMissions.map(({ mission, count }) => (
                    <button
                      key={mission.campaign + "-" + mission.day}
                      onClick={() =>
                        selectMission(mission.campaign, mission.day)
                      }
                    >
                      {mission.campaign === "poly" ? "Forja" : "Trig"}{" "}
                      {mission.day} · {count}
                    </button>
                  ))}
                </div>
              )}
            </article>
            <article>
              <span>03</span>
              <h3>Nível {level}</h3>
              <p>
                Missão concluída vale 100 XP; domínio atual acrescenta 50 XP. Se
                a nota cair, o selo acompanha a realidade.
              </p>
              <strong>
                {xp} XP · {masteredTotal} dominadas
              </strong>
            </article>
          </div>
        </section>

        <section className="hangar" id="hangar">
          <div className="hangar-copy">
            <p className="kicker">Hangar de continuação</p>
            <h2>Você chega tinindo. O livro ainda tem DLC.</h2>
            <p>
              O núcleo de Polinômios e Equações Polinomiais agora está dentro
              dos 14 dias. Complexos, localização avançada de raízes e os
              capítulos finais permanecem visíveis para a próxima expansão.
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
                <span>próxima expansão</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <div>
          <strong>ÓRBITA 14</strong>
          <p>Trigonometria + Forja Polinomial para a pré-temporada do IFSP.</p>
        </div>
        <button onClick={resetProgress}>zerar progresso local</button>
      </footer>
    </div>
  );
}
