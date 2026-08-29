# 🛡️ Bot Detector

Una herramienta de código abierto para identificar la probabilidad de interacciones automatizadas (bots) y granjas de contenido en redes sociales mediante análisis de patrones en tiempo real.

## 🎯 Objetivo
Blindar a los usuarios de la desinformación y manipulación digital mediante la evaluación gráfica e instantánea de perfiles y comentarios.

---

## 📐 Decisiones de Arquitectura y Enfoque

Al evaluar cómo abordar este proyecto, consideramos diferentes caminos técnicos:

- **Enfoque inicial evaluado (Aplicación Web / Scraping Server-Side):**
  Consideramos crear un sitio web externo donde los usuarios pegaran enlaces para analizarlos. Sin embargo, las restricciones de las APIs oficiales y los bloqueos hacia servidores que realizan web scraping hacen inviable esta opción para un MVP.

- **Solución adoptada (Extensión de Navegador - WebExtension):**
  Desarrollamos este primer prototipo como una extensión web (Manifest V3 en JS, HTML y CSS). Al ejecutarse localmente en el navegador, lee directamente el DOM de la página inyectando la interfaz gráfica sin chocar con barreras de autenticación externas.

- **Escalabilidad Futura:**
  No descartamos migrar o complementar este sistema a futuro con un backend en Node.js o Python apoyado en modelos de Machine Learning (IA) para procesar datos más complejas en múltiples plataformas (Twitter/X, Instagram, TikTok).

---

## 🔍 Métodos de Detección (Motor de Heurística en Navegador)

Dado que la extensión opera localmente, implementa un motor de puntuación basado en cuatro pilares de análisis directo en el DOM:

1. **Análisis Heurístico de Nombre y Avatar:**
   - Detección de patrones alfanuméricos sospechosos o secuencias generadas automáticamente mediante Expresiones Regulares (RegEx).
   - Verificación de avatares predeterminados o sin personalizar.

2. **Detección de *Copypastas* y Spam:**
   - Comparación en tiempo real de los textos en la sección de comentarios para detectar frases idénticas o variadas por pocas palabras.
   - Identificación de patrones de enlaces repetitivos de spam.

3. **Inspección de Atributos de Perfil:**
   - Lectura de estructuras de enlace al perfil (ej. URLs con IDs puramente numéricos frente a usernames consolidados).

4. **Algoritmo de Puntuación (Score Engine):**
   - Cálculo dinámico ponderado de sospecha que asigna un % de probabilidad e inyecta la etiqueta visual (`Confirmed Human` vs `Suspected Bot`) en la pantalla del usuario.

---

## 🤝 ¿Cómo puedes aportar?
No necesitas ser un experto en programación para colaborar:
- **Desarrolladores:** Implementación del estándar Manifest V3, selectores de DOM para extraer elementos, optimización de algoritmos en JS o diseño de hojas de estilo en CSS.
- **Creadores / Usuarios:** Reporte de patrones comunes de bots en redes sociales, propuestas de UI/UX y pruebas alfas.
- **Analistas:** Aportando datasets o listados de patrones de spam y texto.

## 🚀 Estado del Proyecto
*Fase inicial de ideación, arquitectura y maquetación de la extensión.*
- **Creadores / Usuarios:** Reportando patrones comunes de bots, proponiendo ideas de UI/UX o probando las versiones alfa.
- **Analistas:** Aportando datasets o listados de patrones sospechosos.

## 🚀 Estado del Proyecto
*El proyecto esta en fase inicial de ideacion y estructura.*
