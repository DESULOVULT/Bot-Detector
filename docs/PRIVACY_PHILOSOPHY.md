## La filosofía central: usar las gemas para destruir las gemas

Al diseñar la interfaz de análisis por perfil, surgió una pregunta que puso a prueba el enfoque completo del proyecto: ¿debería la extensión navegar automáticamente a cada perfil que aparece en el feed (el muro principal donde Facebook muestra publicaciones de forma continua) para analizarlo a fondo?

La respuesta llevó a definir el principio que guía todo el diseño técnico: en lugar de pelear contra las reglas de la plataforma, la extensión usa exactamente las mismas piezas de información que Facebook ya expone de forma pública y voluntaria como la herramienta para identificar comportamiento sospechoso. No se trata de evitar por completo cualquier automatización —después de todo, un script (una secuencia de instrucciones que el navegador ejecuta automáticamente) leyendo y procesando datos es, técnicamente, una forma de automatización— sino de decidir con precisión qué tipo de automatización es aceptable y cuál no.

La línea que separa ambos casos es la diferencia entre leer y navegar:

- **Leer** (lo que hace esta extensión): procesar el HTML que el navegador ya cargó porque el propio usuario, con intención humana real, decidió mirar esa parte de Facebook. La extensión no decide a dónde ir ni cuándo — simplemente observa lo que ya está en pantalla, del mismo modo en que lo haría un lector de pantalla para personas con discapacidad visual.
- **Navegar automáticamente** (lo que esta extensión evita): que el propio script decida, por su cuenta, visitar perfiles en secuencia sin que el usuario lo haya pedido. Esto es funcionalmente un bot operando la plataforma sin intervención humana directa — exactamente el patrón que los sistemas antibot (los mecanismos de seguridad que las plataformas usan para detectar y bloquear comportamiento automatizado, no humano) de Facebook están diseñados para identificar y bloquear.

Dicho de otro modo: sí usamos técnicas de lectura automatizada —en cierto sentido, "bots" leyendo datos—, pero las usamos exclusivamente en modo pasivo y con el único propósito de exponer comportamiento inauténtico, nunca para replicarlo. Son las gemas del propio ecosistema (datos públicos, atributos de accesibilidad, estructura del DOM) las que se usan para desarmar a quienes abusan de ese mismo ecosistema.

### Datos que no es posible obtener aún, al menos de forma convencional

No toda la información es un dato válido para "usar contra los bots" — hay un límite claro entre leer lo que ya es público y voluntario, y acceder a algo que ninguna plataforma expone por diseño. Durante el diseño de la interfaz surgieron ideas de métricas más "profundas" que, al revisarlas con detenimiento, resultaron inviables por razones técnicas o de privacidad:

- **Historial de nombres anteriores:** Facebook no expone públicamente esta información salvo que el propio usuario active voluntariamente la función "También conocido como" en su cuenta. No hay forma de ver nombres que la persona ya eliminó.
- **Reputación de IP:** la dirección IP (una especie de "número de matrícula" único que identifica a cada dispositivo conectado a internet) de un tercero nunca es visible para otro usuario, por diseño fundamental de cómo funciona la web — no es una limitación de Facebook, sino de internet en general.
- **Actividad de mensajería:** solo el propio usuario puede ver el contenido de sus conversaciones. No existe forma de que la extensión conozca la actividad de mensajes de otra persona sin violar su privacidad.
- **Ratio de seguidos/seguidores:** una proporción común (por ejemplo, "sigue a 500 pero solo lo siguen 10") en redes como Instagram o Twitter/X para detectar cuentas sospechosas. A diferencia de esas plataformas, Facebook no expone este dato de forma estándar en la mayoría de perfiles personales.

Esta distinción importa porque protege dos cosas al mismo tiempo: la integridad técnica del proyecto (no prometer datos que no se pueden entregar de forma confiable) y su integridad ética (no normalizar la idea de que una herramienta "de detección" tiene licencia para invadir privacidad ajena en nombre de un buen propósito, incluso cuando ese propósito es legítimo).

### Los dos niveles de análisis

Este principio se traduce en dos niveles concretos, según cuánta intención humana hay detrás de cada acción:

- **Nivel 1 — Badge inline (siempre activo):** un badge es la pequeña etiqueta visual (como un sello o insignia) que aparece junto al nombre de una persona mostrando el porcentaje de sospecha. "Inline" significa que aparece integrado directamente en el mismo lugar donde ya está el contenido, sin abrir nada nuevo. Se calcula con datos ya visibles en el contexto donde aparece un nombre o foto (feed, comentarios, listas de reacciones), sin visitar ningún perfil.
- **Nivel 2 — Panel detallado (bajo demanda):** "bajo demanda" significa que solo ocurre cuando alguien lo pide explícitamente, no de forma automática. Se activa únicamente cuando el propio usuario decide, por su propia voluntad, entrar a un perfil — igual que lo haría sin la extensión instalada. Ahí, la extensión lee todos los datos que esa página ya expone de forma natural y sin pedir permiso especial: ubicación, universidad, número de amigos y publicaciones, tipo de foto de perfil, e incluso si el perfil tiene configurada la privacidad para ocultar información — este último es, en sí mismo, un dato valioso (ver más abajo).

**Nota sobre el análisis masivo de Nivel 2 y futuras líneas abiertas:**

Automatizar el Nivel 2 de forma masiva (visitar perfiles en cadena desde una lista de comentarios) mediante un permiso del usuario sigue chocando con los sistemas de seguridad de la plataforma, ya que simula un flujo de navegación automatizado no humano. Debido a esto, el núcleo actual de la extensión limita el Nivel 2 a la navegación orgánica e individual del usuario. El diseño de un mecanismo seguro para procesar perfiles profundos de forma masiva sin activar alertas antibot se deja como un pendiente abierto para la comunidad, confiando en que futuras contribuciones encuentren enfoques innovadores para resolver este desafío sin comprometer la estabilidad ni el enfoque pasivo de la herramienta.

### Una señal inesperada: la restricción de privacidad como evidencia de humanidad

Uno de los hallazgos más interesantes durante el diseño fue notar que el hecho de que un perfil tenga su información restringida es, en sí mismo, una señal útil. Configurar la privacidad de una cuenta (ocultar amigos, publicaciones o datos personales) requiere entender las opciones de la plataforma y tomar la decisión consciente de usarlas — algo que la mayoría de perfiles automatizados no hacen, ya sea porque no fueron programados para eso o porque a las granjas de bots les conviene mantener sus perfiles abiertos para maximizar alcance.

Por eso, un perfil visiblemente restringido tiende a inclinar la balanza hacia "cuenta humana real", mientras que un perfil completamente abierto combinado con poca actividad genuina tiende a la dirección contraria.

Es importante no sobreestimar esta señal: no es una prueba absoluta, sino una probabilidad más dentro del conjunto de heurísticas. Es razonable esperar que, con el tiempo, operaciones de bots más sofisticadas aprendan a imitar este comportamiento restringiendo perfiles deliberadamente para parecer más humanas. Por eso esta señal debe usarse siempre en combinación con las demás, nunca de forma aislada.
