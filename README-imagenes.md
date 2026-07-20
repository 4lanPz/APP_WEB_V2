# Imágenes y vídeo

Cómo meter una foto en el sitio sin tocar código, y cómo preparar el vídeo del
hero. Todo lo de aquí funciona sin depender de que nadie más colabore.

---

## 1. Poner una foto

```
1. Copia el archivo a  entrega/  con el nombre del slot
2. npm run imagenes
3. Listo — recarga la web
```

**El nombre del archivo es lo único que importa.** La extensión da igual (`.jpg`,
`.png`, `.webp`, `.tif`); el nombre tiene que ser exactamente el id del slot.

- **Telas** → el slug de la tela, que es lo que sale en su URL.
  `/productos/microfibra/athletic` → `athletic.jpg`
  `/productos/polialgodon/lacoast-20` → `lacoast-20.jpg`
- **Huecos únicos** → nombre fijo: `oficio-tintoreria.jpg`, `retrato-asesor.jpg`,
  `macro-tejido.jpg`…
- **Hitos de Empresa** → `hito-fnd-01.jpg`, `hito-loc-02.jpg`…

### Ver la lista de nombres

```bash
npm run dev          # y abre http://localhost:3000/admin/imagenes
```

Esa página es la lista de tareas: enseña **todos** los huecos, cuáles están
llenos, una miniatura de los que sí, y el nombre exacto que espera cada uno
(seleccionable, para copiarlo). Está agrupada por página.

Solo existe en desarrollo — en producción devuelve 404.

Sin levantar el servidor:

```bash
npm run imagenes:slots
```

### Si te equivocas al escribir el nombre

El comando no lo procesa y te lo dice, con la corrección:

```
NOMBRES QUE NO CORRESPONDEN A NINGÚN SLOT — 1
  · atletic.jpg   ¿querías decir "athletic"?
```

El archivo se queda en `entrega/` sin tocar. Renómbralo y vuelve a correr.
Esto es justo lo que evita el fallo silencioso de siempre: un nombre mal escrito
que no da error pero deja el hueco vacío, y parece un fallo de la web.

### Qué hace el comando

- Reorienta según EXIF, redimensiona al ancho del slot y convierte a WebP (q82).
- Avisa si el original es más pequeño de lo que el slot pide (se publica igual,
  pero se verá blando en pantallas grandes).
- Mueve el original a `entrega/procesadas/` para que la carpeta quede limpia.
  **No borra nada**: ese archivo es el único máster que hay.
- Reescribe `src/data/imagenes.generado.ts`, que es lo que hace que la foto
  aparezca. Ese archivo se versiona: sin él, en otra máquina el hueco sale vacío.

> **Sobre "los tamaños que next/image necesita":** no se pre-generan, y no hace
> falta. `next/image` produce cada ancho bajo demanda y lo cachea; lo único que
> importa es que el original sea lo bastante grande. Por eso el script avisa de
> los cortos en vez de generar diez copias de cada foto.

### Cambiar el texto alternativo

El `alt` de cada slot está en `src/data/slots-imagen.ts`, escrito **antes** de que
exista la foto: describe lo que el hueco debe contener. Si al llenarlo la imagen
no corresponde a esa descripción, corrige el `alt` ahí. Un `alt` que miente es
peor que no tenerlo: es la única versión de la imagen que recibe quien usa lector
de pantalla.

### Añadir un hueco nuevo

En `src/data/slots-imagen.ts`, a `SLOTS_UNICOS`. Los de tela salen solos de
`taxonomy.ts`: añadir una tela al catálogo crea su slot sin tocar nada.

---

## 2. Vídeo del hero

```bash
npm run video -- "C:\ruta\a\tu\original.mov"
```

Necesita **ffmpeg** en el PATH (`winget install Gyan.FFmpeg` en Windows; abre una
terminal nueva después). No es dependencia de npm a propósito: se usa una vez
cada muchos meses y no compensa cargar el binario en el proyecto.

Genera en `public/video/`:

| Archivo | Qué es |
|---|---|
| `hero.mp4` | H.264, compatible con todo |
| `hero.webm` | VP9, más pequeño, para quien lo soporte |
| `hero-poster.jpg` | fotograma fijo del segundo 1 |

Ninguno lleva pista de audio: el hero es mudo por diseño.

Al terminar activa el vídeo en la portada (`src/data/video.generado.ts`). Antes
de correrlo, la portada usa el fondo estático y **no descarga nada**.

### El material de origen

- **6–10 s.** Más no aporta: es un bucle de fondo.
- **Bucle limpio** — el último fotograma tiene que casar con el primero, o se
  verá un salto cada pasada. Eso se resuelve al grabar o al montar, no aquí.
- Que no pase nada importante en el centro-izquierda: ahí va el titular.

### Peso

El objetivo es **≤ 3 MB** por variante. Por encima, el vídeo penaliza el LCP en
móvil, que es donde se va a ver la mayor parte del tráfico. El script avisa si te
pasas y sugiere qué tocar, en orden: recortar duración → subir `crf` → bajar el
ancho de 1600 a 1280.

**¿Y si no baja de 3 MB?** El límite razonable para versionar en git es ese mismo:
git guarda cada versión entera, así que un `hero.mp4` de 8 MB que cambies tres
veces son 24 MB en el historial para siempre. Si tu vídeo no baja:

- **Lo más simple** — súbelo a `public/video/` igual y acepta el peso, si estás
  seguro de que no lo vas a cambiar. Una vez, 5 MB, no es un drama.
- **Lo correcto si va a cambiar** — sírvelo desde fuera del repo (Cloudinary,
  Bunny, S3 + CloudFront, o el propio hosting) y cambia las rutas en
  `HeroVideo.tsx`. Son dos líneas.

### Cómo está cableado

`src/components/ui/HeroVideo.tsx`, siguiendo Motion Architecture §06:
velocidad 0.5×, opacidad 0.85, velo de tinta 28%, mudo, en bucle, sin controles.

**`prefers-reduced-motion`:** el `<video>` no está en el HTML del servidor. Se
monta en un efecto solo si el sistema no pide menos animación. Así quien lo pide
ve únicamente el póster **y no llega a descargar el vídeo**, que es la parte que
de verdad le importa. Y no hay desajuste de hidratación, porque servidor y primer
render de cliente pintan lo mismo.

El póster se queda debajo siempre: es lo que se ve mientras carga y lo que queda
si el navegador no sabe reproducir ninguno de los dos formatos.

---

## 3. Comandos

| Comando | Qué hace |
|---|---|
| `npm run imagenes` | procesa `entrega/` y actualiza el manifiesto |
| `npm run imagenes:slots` | lista los nombres válidos en terminal |
| `npm run video -- <archivo>` | comprime el vídeo del hero y saca el póster |
| `npm run catalogo` | verifica el catálogo y genera los pedidos pendientes |
| `npm run imagenes:telas-pw` | regenera las fotos que salen de `Telas_PW/` |

---

## 4. Los dos orígenes de imagen

Conviven a propósito:

- **`Telas_PW/`** — las 2,4 GB que mandó el cliente. `npm run imagenes:telas-pw`
  las regenera desde `scripts/preparar-imagenes.ts`, donde cada foto lleva
  anotada la etiqueta de producción que la identifica. Está fuera del repo.
- **`entrega/`** — lo que pongas tú a mano. Es el camino normal a partir de ahora.

Los dos escriben en los mismos slots. Si procesas una foto tuya con el nombre de
una tela que ya venía de `Telas_PW/`, la tuya la reemplaza — y volverá la antigua
si alguien corre `imagenes:telas-pw` otra vez. Para las telas que ya tienen foto
del cliente, esto no debería pasar; para el resto, no hay conflicto posible.

---

## 5. Lo que sigue bloqueado, y por qué

`npm run catalogo` imprime el registro completo. Resumen:

- **Material generado por IA** (los banners de familia) — licencia resuelta, pero
  no puede ir en un hueco que afirme algo nuestro: "nuestra planta", "nuestros
  clientes", "nuestro asesor". Solo ambiente.
- **`Fotos_-10.jpg`** — fotografía real de una empleada (EXIF de Canon). Falta su
  autorización, que no es lo mismo que una licencia.
- **Macros sin identificar** — no se asignan a una tela si no se sabe con certeza
  cuál es. Una foto equivocada en una ficha técnica es el mismo error que un
  gramaje inventado.

Si pones tú la foto en un slot, esa decisión es tuya y el registro no te lo
impide. El registro está para que la razón no se pierda, no para bloquearte.
