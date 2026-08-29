# Arquitectura de Bot Detector

## El proceso personal: de la idea tradicional al ajuste técnico

Al principio intenté estructurar todo con el proceso típico de desarrollo web usando `index`, `styles` y `content.js` (los archivos base donde se definen la estructura HTML, el diseño visual y la lógica de programación de una extensión), pensando en un enfoque clásico donde un script pudiera indexar y extraer datos de forma directa. Sin embargo, en la marcha me fui dando cuenta de los muros con los que choca esa idea en una plataforma cerrada como Facebook.

Por un lado, chocaba de frente con las protecciones duras de la plataforma: cualquier intento de *scraping* (el uso de bots o programas automatizados para extraer masivamente información de una web) salta de inmediato a los sistemas de bloqueo y listas negras. Por otro lado, analizando cómo funciona realmente el DOM (el modelo en forma de árbol que usa el navegador para organizar y leer todos los elementos de una página web) de estas redes, entendí que no precargan todo el contenido de los perfiles en una sola vista estática porque el navegador colapsaría, y cada dato profundo se obtiene mediante llamadas dinámicas a sus servidores.

Eso me obligó a cambiar el enfoque por completo. Pasé de buscar un *scraping* invasivo a diseñar una extensión local y pasiva. La nueva lógica se basa en que el script simplemente lee el HTML que el propio navegador ya renderizó de manera orgánica cuando uno entra a un perfil de forma natural, tomando los datos visibles sin pedirle permiso a nadie.

Todo el cálculo de las alertas, la frecuencia de comentarios, el tipo de lenguaje y las métricas visibles se procesa mediante heurísticas (conjunto de reglas lógicas basadas en patrones y probabilidades para detectar comportamientos sospechosos sin necesidad de espiar bases de datos) directo en el dispositivo de forma local, sin mandar información a servidores externos y evitando por completo cualquier riesgo de baneo o violación de las políticas de la plataforma.

## Por qué no hay un `index.html`

Otro ajuste mental importante: una extensión de navegador no es un sitio web que se "abre". No tiene una pantalla propia con un `index.html` que se ejecuta y se previsualiza como cualquier página. En cambio, es un conjunto de instrucciones que el navegador inyecta dentro de otra página (en este caso, Facebook) cuando el usuario la visita. Por eso el proyecto no tiene ni necesita ese archivo — la "pantalla" de esta extensión literalmente es la interfaz de Facebook, con el badge inyectado encima.

## El reto de vigilar una página que nunca deja de cambiar

Facebook (y la mayoría de redes sociales modernas) no cargan todo su contenido de una sola vez: a medida que haces scroll, aparecen publicaciones y comentarios nuevos constantemente, sin recargar la página. Para que la extensión pueda analizar ese contenido a medida que aparece, usamos un `MutationObserver` — un mecanismo del navegador que permite "vigilar" cambios en el HTML de la página en tiempo real.

El desafío no es solo detectar esos cambios, sino hacerlo sin volver lento el navegador. Facebook modifica su DOM constantemente por razones que no tienen nada que ver con contenido nuevo (animaciones, contadores, etc.), así que reaccionar a cada cambio individual sería ineficiente. La solución fue agrupar los cambios detectados en ráfagas cortas de tiempo (una técnica llamada *debounce*) y procesarlos en lote, en vez de uno por uno.

Además, en lugar de depender de los nombres de clase CSS de Facebook (que son generados automáticamente, cambian con cada actualización de la plataforma y no tienen significado legible), la extensión se apoya en atributos de accesibilidad como `role="article"` y `role="link"` — atributos que Facebook mantiene estables porque los necesitan los lectores de pantalla para personas con discapacidad visual. Esto hace que la detección sea más resistente a los rediseños visuales de la plataforma.

## El reto de probar una extensión

Un descubrimiento importante durante el desarrollo: las extensiones de navegador no se pueden "previsualizar" como una página web normal. Para probarlas hace falta cargarlas en modo desarrollador directamente en un navegador compatible (Chrome de escritorio, o alternativas como Microsoft Edge Canary en Android). Los navegadores móviles convencionales, como Chrome para Android, no permiten esto — una limitación importante a tener en cuenta si el desarrollo se hace principalmente desde un celular.
