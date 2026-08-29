# Cómo contribuir a Bot Detector

¡Gracias por tu interés en colaborar! Esta guía explica lo básico para empezar, sin asumir que ya sabes usar Git o GitHub a fondo.

## Antes de empezar: ¿qué es qué?

- **Repositorio**: la carpeta de este proyecto, con todo su historial de cambios guardado.
- **Git**: el programa que lleva ese historial.
- **GitHub**: el sitio web donde vive la copia de este repositorio en internet.

## Requisito: autenticación con GitHub

Desde 2021, GitHub ya no acepta usuario y contraseña normales para subir cambios (`git push`). Necesitas crear un **Personal Access Token (classic)**, que funciona como una llave especial y temporal.

Guía oficial para crearlo: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

Al crearlo, marca únicamente el permiso (scope) **`repo`** — es todo lo que necesitas para este proyecto.

⚠️ Nunca compartas tu token con nadie, ni lo subas a ningún archivo del repositorio.

## Flujo de trabajo para proponer cambios

1. **Crea tu propia copia (fork)** de este repositorio, o si ya tienes acceso, crea una **rama (branch)** nueva en vez de trabajar directo sobre `main`.
2. Haz tus cambios en los archivos que necesites.
3. Guarda esos cambios como un **commit**, con un mensaje corto que describa qué hiciste (ej: `Agrega detección de nombres genéricos`).
4. Sube (**push**) tu rama a GitHub.
5. Abre un **Pull Request (PR)** — es una solicitud para que tus cambios se incorporen al proyecto principal. Ahí se revisará antes de aceptarlo.

## Sobre el correo en tus commits

Cada commit queda con tu nombre y correo asociado. Como este repositorio es público, ese correo será visible para cualquiera. Si prefieres no exponer tu correo real, puedes usar el correo "noreply" que GitHub genera automáticamente para tu cuenta (lo encuentras en Settings → Emails → "Keep my email addresses private").

## ¿Qué tipo de aportes son bienvenidos?

- Nuevas reglas heurísticas para detectar patrones de bots.
- Reportes de falsos positivos/negativos (cuentas reales marcadas como bots, o bots que no fueron detectados).
- Mejoras de rendimiento en el `MutationObserver`.
- Correcciones de errores o mejoras de código en general.

## Privacidad del proyecto

Todo el análisis de Bot Detector ocurre **localmente en el navegador del usuario**. No se envía ningún dato a servidores externos. Cualquier contribución debe mantener este principio.

## ¿Dudas?

Abre un Issue describiendo tu pregunta o problema, y con gusto lo revisamos.
