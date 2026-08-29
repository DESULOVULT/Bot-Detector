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

## ¿Por qué una extensión y no una app o un programa de escritorio?

Antes de decidirse por el formato de extensión de navegador, se evaluaron las alternativas más obvias:

- **App independiente (Android/iOS):** Para que una app pudiera "ver" contenido de Facebook, tendría que depender de la API oficial (que restringe fuertemente el acceso a datos de perfiles ajenos) o recurrir a scraping por cuenta propia — el mismo riesgo de bloqueos que ya se había descartado. Además, habría que simular un navegador completo dentro de la app y gestionar sesiones de login manualmente, reconstruyendo desde cero algo que un navegador real ya resuelve de fábrica.

- **Programa de escritorio (Windows/Mac):** El problema de fondo es el mismo: sin un navegador real de por medio, no hay forma legítima de "ver" lo que el usuario ve en Facebook. Sería posible controlar un navegador por detrás con herramientas de automatización (como Selenium o Playwright), pero eso equivale a automatizar un navegador desde afuera — un patrón que las plataformas detectan y bloquean con más facilidad que una extensión real.

- **Extensión de navegador (la opción elegida):** Esta es la única alternativa que aprovecha que **el usuario ya inició sesión y ya está viendo Facebook de forma completamente normal**. La extensión no pide nada, no simula nada, no automatiza un navegador desde afuera: simplemente lee lo que ya está renderizado en pantalla, del mismo modo en que lo haría un lector de pantalla para personas con discapacidad visual (de ahí que la detección se apoye en atributos de accesibilidad como `role="article"`, ver sección siguiente).

En definitiva, la extensión no se eligió solo por ser la opción más simple de programar, sino por ser la única que respeta cómo estas plataformas están diseñadas para ser usadas — por un humano, en un navegador, con sesión iniciada — en lugar de pelear contra esas reglas.

Esto no descarta una posible evolución futura: si el proyecto creciera hacia, por ejemplo, un panel con estadísticas históricas de cuentas reportadas por la comunidad, ahí sí tendría sentido sumar una aplicación web con su propio backend — pero esa pieza existiría *además* de la extensión, no en su lugar. La extensión seguiría siendo la encargada de "ver" Facebook.

## La filosofía central: usar las gemas para destruir las gemas

Al diseñar la interfaz de análisis por perfil, surgió una pregunta que puso a prueba el enfoque completo del proyecto: ¿debería la extensión navegar automáticamente a cada perfil que aparece en el feed (el muro principal donde Facebook muestra publicaciones de forma continua) para analizarlo a fondo?

La respuesta llevó a definir el principio que guía todo el diseño técnico: **en lugar de pelear contra las reglas de la plataforma, la extensión usa exactamente las mismas piezas de información que Facebook ya expone de forma pública y voluntaria como la herramienta para identificar comportamiento sospechoso.** No se trata de evitar por completo cualquier automatización —después de todo, un script (una secuencia de instrucciones que el navegador ejecuta automáticamente) leyendo y procesando datos es, técnicamente, una forma de automatización— sino de decidir con precisión *qué tipo* de automatización es aceptable y cuál no.

La línea que separa ambos casos es la diferencia entre **leer** y **navegar**:

- **Leer** (lo que hace esta extensión): procesar el HTML que el navegador ya cargó porque el propio usuario, con intención humana real, decidió mirar esa parte de Facebook. La extensión no decide a dónde ir ni cuándo — simplemente observa lo que ya está en pantalla, del mismo modo en que lo haría un lector de pantalla para personas con discapacidad visual.
- **Navegar automáticamente** (lo que esta extensión evita): que el propio script decida, por su cuenta, visitar perfiles en secuencia sin que el usuario lo haya pedido. Esto es funcionalmente un bot operando la plataforma sin intervención humana directa — exactamente el patrón que los sistemas antibot (los mecanismos de seguridad que las plataformas usan para detectar y bloquear comportamiento automatizado, no humano) de Facebook están diseñados para identificar y bloquear.

Dicho de otro modo: sí usamos técnicas de lectura automatizada —en cierto sentido, "bots" leyendo datos—, pero las usamos exclusivamente en modo pasivo y con el único propósito de exponer comportamiento inauténtico, nunca para replicarlo. Son las gemas del propio ecosistema (datos públicos, atributos de accesibilidad, estructura del DOM) las que se usan para desarmar a quienes abusan de ese mismo ecosistema.

### Los dos niveles de análisis

Este principio se traduce en dos niveles concretos, según cuánta intención humana hay detrás de cada acción:

- **Nivel 1 — Badge inline (siempre activo):** un "badge" es la pequeña etiqueta visual (como un sello o insignia) que aparece junto al nombre de una persona mostrando el porcentaje de sospecha. "Inline" significa que aparece integrado directamente en el mismo lugar donde ya está el contenido, sin abrir nada nuevo. Se calcula con datos ya visibles en el contexto donde aparece un nombre o foto (feed, comentarios, listas de reacciones), sin visitar ningún perfil.

- **Nivel 2 — Panel detallado (bajo demanda):** "bajo demanda" significa que solo ocurre cuando alguien lo pide explícitamente, no de forma automática. Se activa únicamente cuando el propio usuario decide, por su propia voluntad, entrar a un perfil — igual que lo haría sin la extensión instalada. Ahí, la extensión lee todos los datos que esa página ya expone de forma natural y sin pedir permiso especial: ubicación, universidad, número de amigos y publicaciones, tipo de foto de perfil, e incluso **si el perfil tiene configurada la privacidad para ocultar información** — este último es, en sí mismo, un dato valioso (ver más abajo).

### Una señal inesperada: la restricción de privacidad como evidencia de humanidad

Uno de los hallazgos más interesantes durante el diseño fue notar que **el hecho de que un perfil tenga su información restringida es, en sí mismo, una señal útil.** Configurar la privacidad de una cuenta (ocultar amigos, publicaciones o datos personales) requiere entender las opciones de la plataforma y tomar la decisión consciente de usarlas — algo que la mayoría de perfiles automatizados no hacen, ya sea porque no fueron programados para eso o porque a las granjas de bots les conviene mantener sus perfiles abiertos para maximizar alcance.

Por eso, un perfil visiblemente restringido tiende a inclinar la balanza hacia "cuenta humana real", mientras que un perfil completamente abierto combinado con poca actividad genuina (ver sección de heurísticas) tiende a la dirección contraria.

Es importante no sobreestimar esta señal: no es una prueba absoluta, sino una probabilidad más dentro del conjunto de heurísticas. Es razonable esperar que, con el tiempo, operaciones de bots más sofisticadas aprendan a imitar este comportamiento restringiendo perfiles deliberadamente para parecer más humanas. Por eso esta señal debe usarse siempre en combinación con las demás, nunca de forma aislada.

### Datos que no es posible ni ético obtener

No toda la información es un dato válido para "usar contra los bots" — hay un límite claro entre leer lo que ya es público y voluntario, y acceder a algo que ninguna plataforma expone por diseño. Durante el diseño de la interfaz surgieron ideas de métricas más "profundas" que, al revisarlas con detenimiento, resultaron inviables por razones técnicas o de privacidad:

- **Historial de nombres anteriores:** Facebook no expone públicamente esta información salvo que el propio usuario active voluntariamente la función "También conocido como" en su cuenta. No hay forma de ver nombres que la persona ya eliminó.
- **Reputación de IP:** la dirección IP (una especie de "número de matrícula" único que identifica a cada dispositivo conectado a internet) de un tercero nunca es visible para otro usuario, por diseño fundamental de cómo funciona la web — no es una limitación de Facebook, sino de internet en general.
- **Actividad de mensajería:** solo el propio usuario puede ver el contenido de sus conversaciones. No existe forma de que la extensión conozca la actividad de mensajes de otra persona sin violar su privacidad.
- **Ratio de seguidos/seguidores:** una proporción (por ejemplo, "sigue a 500 pero solo lo siguen 10") común en redes como Instagram o Twitter/X para detectar cuentas sospechosas. A diferencia de esas plataformas, Facebook no expone este dato de forma estándar en la mayoría de perfiles personales.

Esta distinción importa porque protege dos cosas al mismo tiempo: la integridad técnica del proyecto (no prometer datos que no se pueden entregar de forma confiable) y su integridad ética (no normalizar la idea de que una herramienta "de detección" tiene licencia para invadir privacidad ajena en nombre de un buen propósito, incluso cuando ese propósito es leg��timo).
