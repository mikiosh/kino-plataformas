# Catálogo Plataformas para Kino

Películas y series separadas por plataforma y país, con una pestaña LGBT+ que incluye ambos tipos de contenido. Solo catálogo: Kino busca dónde reproducir con tus otros plugins.

## Instalar

En Kino 0.9.54 o posterior: Ajustes → Plugins → Agregar → escribe **mikiosh/kino-plataformas** → Agregar → Instalar.

Abre la sección **Plataformas**. Hay pestañas **Películas**, **Series** y **LGBT+**. Cada plataforma tiene su propia fila y «Ver más». Usa **Más plataformas** y **Plataformas anteriores** para recorrer el directorio. Inicio muestra seis plataformas y las dos filas LGBT+. Las series permiten elegir temporada.

## País y cobertura

En los ajustes del plugin, País de disponibilidad usa códigos de dos letras (MX, ES, AR, US, etc.). Por defecto se usa MX como punto de partida configurable. Los títulos de una plataforma se filtran por disponibilidad en ese país según TMDB/JustWatch. Por defecto se incluyen suscripción, gratis y anuncios; puedes añadir alquiler y compra.

**No se garantiza cobertura universal ni completa de todos los servicios.** Sin configurar ninguna llave, se usan 39 plataformas precargadas (snapshot de Sofa): Netflix, Prime Video, Disney+, Apple TV+, HBO Max, Paramount+, ViX y otras. Las variantes de una misma plataforma pueden estar agrupadas. Algunos servicios no tienen contenido en el país elegido y su fila quedará vacía. La navegación conserva todas las plataformas precargadas; que aparezca un nombre no confirma que opere en tu país.

Para cargar el **directorio completo que TMDB ofrece para el país y tipo de contenido**, configura una llave v3 o token de lectura v4 propio en **Llave TMDB opcional**. Se guarda como ajuste password y se envía exclusivamente a api.themoviedb.org. No la publiques ni la pegues en GitHub. El directorio se almacena durante 24 horas. No se necesita ninguna cuenta de Netflix u otras plataformas para consultar este catálogo. Kino puede mostrar un aviso genérico de credenciales por el campo password: aquí corresponde a la llave opcional de TMDB.

La sección LGBT+ consulta etiquetas LGBT, gay, lesbian, transgender y bisexual de TMDB. Puede incluir omisiones o clasificaciones incorrectas. Es una selección temática general, independiente de la plataforma y el país; no promete que esos títulos estén disponibles en la región. La búsqueda global también es general por título, no restringida a plataformas.

La presencia de un título no garantiza reproducción. Usa «Buscar dónde verlo» en Kino y tus fuentes instaladas. Se excluyen títulos marcados adult por TMDB; esto no sustituye clasificaciones por edad ni control parental. LGBT no se marca como adulto por su temática.

## Validación

Validador oficial: aprobado. Siete pruebas con datos simulados comprueban tipos separados, filtro por país/proveedor, paginación de todas las plataformas precargadas, opción de alquiler/compra, LGBT para ambos tipos, temporadas y directorio ampliado. No se ha probado dentro de Kino ni se han verificado respuestas reales autenticadas de TMDB. El kit de Node no expone el servicio kino.tmdb de la app.

La versión inicial 0.1.0 se distribuye sin firma de autor. No contiene claves incrustadas. Catálogo principal mediante kino.tmdb; la llave opcional solo consulta el directorio de plataformas.

## Créditos

Datos y carteles: [TMDB](https://www.themoviedb.org/).

![TMDB](https://files.readme.io/29c6fee-blue_short.svg)

This product uses the TMDB API but is not endorsed or certified by TMDB.

Disponibilidad de plataformas: TMDB, con datos de [JustWatch](https://www.justwatch.com/). La disponibilidad puede cambiar o estar desactualizada.

Directorio precargado adaptado de [Sofa](https://github.com/jakejarvis/sofa/blob/main/packages/db/src/platforms.json), consultado el 16 de octubre de 2026. Copyright (c) 2026 Jake Jarvis; licencia MIT, incluida en NOTICE-SOFA.txt.

Andamiaje y kit basados en [kino-plugin-archive](https://github.com/kinotvapp/kino-plugin-archive), Apache-2.0; licencia incluida. [Documentación de Kino](https://kinotvapp.github.io/kino-plugins/).
