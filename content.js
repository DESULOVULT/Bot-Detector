console.log("🤖 Bot Detector: Inicializando observador...");

// Reglas y pesos de puntuación heurística
const HEURISTIC_RULES = {
  LOW_FRIENDS_POSTS_RATIO: { score: 25, label: "Frecuencia de ráfaga/baja diversidad" },
  NAME_CHANGE_SUSPECT: { score: 15, label: "Historial de nombres sospechoso" },
  LOW_ACCOUNT_AGE: { score: 20, label: "Antigüedad baja" },
  GENERIC_BIO: { score: 15, label: "Veracidad de biografía baja" },
  SPAM_KEYWORDS: { score: 25, label: "Palabras clave de spam" }
};

// Función para calcular la puntuación total de riesgo (0 - 100)
function calculateBotProbability(profileData) {
  let score = 0;
  let detectedSignals = [];

  // Evaluación de prueba
  if (profileData.friends <= 10 && profileData.posts <= 10) {
    score += HEURISTIC_RULES.LOW_FRIENDS_POSTS_RATIO.score;
    detectedSignals.push(HEURISTIC_RULES.LOW_FRIENDS_POSTS_RATIO.label);
  }

  score = Math.min(score, 100);

  return {
    score: score,
    signals: detectedSignals
  };
}

// Función para inyectar la ventanilla/overlay flotante en la página
function injectAnalysisCard(targetNode, analysisResult) {
  if (!targetNode || targetNode.querySelector(".bot-detector-overlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "bot-detector-overlay";
  overlay.innerHTML = `
    <div class="bot-card-header">
      <span class="bot-card-title">Bot Analysis Quick View</span>
      <span class="bot-card-score">${analysisResult.score}% Probabilidad</span>
    </div>
    <div class="bot-card-body">
      <ul>
        ${analysisResult.signals.map(s => `<li>${s}</li>`).join("")}
      </ul>
    </div>
  `;

  targetNode.appendChild(overlay);
}

// Inicializador principal con MutationObserver
function startDOMObserver() {
  const observer = new MutationObserver((mutations) => {
    // Pendiente: Selectores CSS específicos para capturar nodos en Facebook
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

startDOMObserver();

