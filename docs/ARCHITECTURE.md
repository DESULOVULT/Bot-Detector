# Arquitectura de Bot Detector

## El proceso personal: de la idea tradicional al ajuste técnico

Al principio intenté estructurar todo con el proceso típico de desarrollo web usando `index`, `styles` y `content.js` (los archivos base donde se definen la estructura HTML, el diseño visual y la lógica de programación de una extensión), pensando en un enfoque clásico donde un script pudiera indexar y extraer datos de forma directa. Sin embargo, en la marcha me fui dando cuenta de los muros con los que choca esa idea en una plataforma cerrada como Facebook.

Por un lado, chocaba de frente con las protecciones duras de la plataforma: cualquier intento de *scraping* (el uso de bots o programas automatizados para extraer masivamente información de una web) salta de inmediato a los sistemas de bloqueo y listas negras. Por otro lado, analizando cómo funciona realmente el DOM (el modelo en forma de árbol que usa el navegador para organizar y leer todos los elementos de una página web) de estas redes, entendí que no precargan todo el contenido de los perfiles en una sola vista estática porque el navegador colapsaría, y cada dato profundo se obtiene mediante llamadas dinámicas a sus servidores.

Eso me obligó a cambiar el enfoque por completo. Pasé de buscar un *scraping* invasivo a diseñar una extensión local y pasiva. La nueva lógica se basa en que el script simplemente lee el HTML que el propio navegador ya renderizó de manera orgánica cuando uno entra a un perfil de forma natural, tomando los datos visibles sin pedirle permiso a nadie.

Todo el cálculo de las alertas, la frecuencia de comentarios, el tipo de lenguaje y las métricas visibles se procesa mediante heurísticas (conjunto de reglas lógicas basadas en patrones y probabilidades para detectar comportamientos sospechosos sin necesidad de espiar bases de datos) directo en el dispositivo de forma local, sin mandar información a servidores externos y evitando por completo cualquier riesgo de baneo o violación de las políticas de la plataforma.

---

## Por qué no hay un `index.html`

Otro ajuste mental importante: una extensión de navegador no es un sitio web que se "abre". No tiene una pantalla propia con un `index.html` que se ejecuta y se previsualiza como cualquier página. En cambio, es un conjunto de instrucciones que el navegador inyecta dentro de otra página (en este caso, Facebook) cuando el usuario la visita. Por eso el proyecto no tiene ni necesita ese archivo — la "pantalla" de esta extensión literalmente es la interfaz de Facebook, con el badge inyectado encima.

---

## El reto de vigilar una página que nunca deja de cambiar

Facebook (y la mayoría de redes sociales modernas) no cargan todo su contenido de una sola vez: a medida que haces *scroll*, aparecen publicaciones y comentarios nuevos constantemente, sin recargar la página. Para que la extensión pueda analizar ese contenido a medida que aparece, usamos un `MutationObserver` — un mecanismo del navegador que permite "vigilar" cambios en el HTML de la página en tiempo real.

El desafío no es solo detectar esos cambios, sino hacerlo sin volver lento el navegador. Facebook modifica su DOM constantemente por razones que no tienen nada que ver con contenido nuevo (animaciones, contadores, etc.), así que reaccionar a cada cambio individual sería ineficiente. La solución fue agrupar los cambios detectados en ráfagas cortas de tiempo (una técnica llamada *debounce*) y procesarlos en lote, en vez de uno por uno.

Además, en lugar de depender de los nombres de clase CSS de Facebook (que son generados automáticamente, cambian con cada actualización de la plataforma y no tienen significado legible), la extensión se apoya en atributos de accesibilidad como `role="article"` y `role="link"` — atributos que Facebook mantiene estables porque los necesitan los lectores de pantalla para personas con discapacidad visual. Esto hace que la detección sea más resistente a los rediseños visuales de la plataforma.

---

## El reto de probar una extensión

Un descubrimiento importante durante el desarrollo: las extensiones de navegador no se pueden "previsualizar" como una página web normal. Para probarlas hace falta cargarlas en modo desarrollador directamente en un navegador compatible (Chrome de escritorio, o alternativas como Microsoft Edge Canary en Android). Los navegadores móviles convencionales, como Chrome para Android, no permiten esto — una limitación importante a tener en cuenta si el desarrollo se hace principalmente desde un celular.

---

## ¿Por qué una extensión y no una app o un programa de escritorio?

Antes de decidirse por el formato de extensión de navegador, se evaluaron las alternativas más obvias:

- **App independiente (Android/iOS):** Para que una app pudiera "ver" contenido de Facebook, tendría que depender de la API oficial (que restringe fuertemente el acceso a datos de perfiles ajenos) o recurrir a *scraping* por cuenta propia — el mismo riesgo de bloqueos que ya se había descartado. Además, habría que simular un navegador completo dentro de la app y gestionar sesiones de *login* manualmente, reconstruyendo desde cero algo que un navegador real ya resuelve de fábrica.
- **Programa de escritorio (Windows/Mac):** El problema de fondo es el mismo: sin un navegador real de por medio, no hay forma legítima de "ver" lo que el usuario ve en Facebook. Sería posible controlar un navegador por detrás con herramientas de automatización (como Selenium o Playwright), pero eso equivale a automatizar un navegador desde afuera — un patrón que las plataformas detectan y bloquean con más facilidad que una extensión real.
- **Extensión de navegador (la opción elegida):** Esta es la única alternativa que aprovecha que **el usuario ya inició sesión y ya está viendo Facebook de forma completamente normal**. La extensión no pide nada, no simula nada, no automatiza un navegador desde afuera: simplemente lee lo que ya está renderizado en pantalla, del mismo modo en que lo haría un lector de pantalla para personas con discapacidad visual (de ahí que la detección se apoye en atributos de accesibilidad como `role="article"`).

### Cómo opera la extensión sin ser detectada como "bot"

Para abordar la duda sobre cómo evitar que los sistemas de Facebook detecten este comportamiento como un bot, la clave radica en la separación estricta entre lectura pasiva y automatización activa:

- **Lectura local vs. Automatización externa:** Las herramientas de automatización tradicionales controlan el navegador desde afuera o abren páginas por cuenta propia, activando cortafuegos de inmediato. En contraste, esta extensión opera en modo estrictamente pasivo: **no toma decisiones de navegación**. El usuario humano es quien navega, hace *scroll* y decide qué perfiles visitar; la extensión simplemente lee el HTML que ya fue renderizado orgánicamente en la pantalla, imitando el comportamiento de un lector de accesibilidad web.
- **Uso de atributos estables:** Mediante el uso de atributos nativos de accesibilidad (como `role="article"`), la herramienta se vuelve inmune a los cambios dinámicos de clases CSS y mantiene una lectura limpia sin interferir con las peticiones de red de la plataforma.

### Comparativa con aplicaciones de terceros ("Video Download")

A menudo surge la duda sobre el método que emplean apps de descarga de video de Facebook para saltarse restricciones de acceso. Aunque dichas aplicaciones logran su cometido, suelen enfrentar suspensiones masivas de cuentas porque manipulan sesiones, utilizan contenedores web (*WebViews*) o interceptan peticiones de red (*network hooking*) directamente contra los servidores de Meta. Replicar ese enfoque en una herramienta de análisis de comportamiento es inviable:

- Cualquier alteración en las cabeceras de red o llamadas repetitivas hacia los *endpoints* de perfil activa los sistemas automáticos de baneo (como *checkpoints* o *captchas*).
- La extensión elude este problema al **no realizar llamadas independientes** a los servidores de Facebook, consumiendo únicamente el DOM local generado por la sesión legítima del usuario.

Esto no descarta una posible evolución futura: si el proyecto creciera hacia, por ejemplo, un panel con estadísticas históricas de cuentas reportadas por la comunidad, ahí sí tendría sentido sumar una aplicación web con su propio backend — pero esa pieza existiría *además* de la extensión, no en su lugar. La extensión seguiría siendo la encargada de "ver" Facebook.

## Filosofía de privacidad y ética Esta sección se movió a un documento propio: [docs/PRIVACY_PHILOSOPHY.md](./PRIVACY_PHILOSOPHY.md)
