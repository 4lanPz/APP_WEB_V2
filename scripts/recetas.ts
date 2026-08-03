/**
 * De qué original de `Telas_PW/` sale cada foto publicada, y con qué encuadre.
 *
 * Está en un módulo aparte —y no dentro de `preparar-imagenes.ts`, que es quien
 * las usa para generar— porque hay un segundo lector: `medir-fotos.ts`, que
 * mide el croma y la luminancia de lo publicado para decidir si una foto sirve
 * para el recoloreo. Las dos cosas tienen que salir del MISMO encuadre: medir el
 * original entero y publicar un recorte daría un número que describe otra
 * imagen, y esa es exactamente la clase de discrepancia que nadie ve al leer el
 * log. Con un solo mapa no puede pasar.
 *
 * Es la misma razón por la que `gris.ts` está fuera de los dos scripts que
 * escriben en `public/`.
 */

import { join } from "node:path";

export const ORIGENES_DIR = join(import.meta.dirname, "..", "Telas_PW");

export interface Receta {
  /** Ruta dentro de Telas_PW/ */
  origen: string;
  /** Ancho máximo de salida, en px. */
  ancho: number;
  /**
   * Rectángulo del ORIGINAL que se conserva, en píxeles del archivo tal cual
   * sale de la cámara. Sin él se procesa el cuadro entero, que es lo que hacen
   * todas las telas menos las que alimentan la lupa.
   *
   * Las coordenadas son sobre el archivo SIN rotar. Es seguro porque el recorte
   * se aplica antes que `.rotate()` y los originales de Athletic traen
   * `orientation: 1` —comprobado, no supuesto—: si algún día entra aquí un
   * original con EXIF girado, el recorte caería en otra parte de la foto, y por
   * eso `generar()` lo verifica y falla en vez de recortar a ciegas.
   */
  recorte?: { left: number; top: number; width: number; height: number };
}

/** De qué original sale cada foto de sección. */
export const ORIGEN_FOTOS: Record<string, Receta> = {
  "oficio-nave-tejido": { origen: "Tejeduria6.jpg", ancho: 1920 },
  "oficio-taller-alangasi": { origen: "Enero_1 (4).jpg", ancho: 1200 },
  "local-fachada": { origen: "_DSC5241.jpg", ancho: 1920 },
  "macro-fibra-blanca": { origen: "Post 16_2.jpg", ancho: 1920 },
  "macro-tejido": { origen: "_MG_4106.jpg", ancho: 1920 },
  "macro-punto-camiseta": { origen: "Post-16_1-(4).jpg", ancho: 1920 },
};

/** De qué original sale la foto de cada tela. */
export const ORIGEN_TELAS: Record<string, Receta> = {
  "sevilla-plus": {
    origen: "Tela Sevilla Plus Microfibra/_MG_3673.jpg",
    ancho: 1280,
  },
  /**
   * Titanium publica TRES vistas, y el orden de la galería no se decide aquí:
   * lo decide `vistasDeTela` a partir del id del slot (principal → caída →
   * trama). Cambiar cuál es la principal es cambiar qué original alimenta cada
   * id, no reordenar este mapa.
   *
   * Las tres son 4:3, que es la relación de la caja de la principal
   * (`aspect-4/3` con `object-cover`, ver `MacroLupa`). Entrando ya en 4:3
   * llenan la caja con los 1280px generados; un origen 16:9 dejaría ~960 útiles
   * y la caja tendría que estirarlos. Vale para las tres porque cualquiera de
   * ellas pasa a ser la principal al pulsar su miniatura.
   *
   * EL LOTE TRAE UNA CUARTA, Y NO SE PUBLICA. `TITANIUM (4).jpg` era una copia
   * de la (3) —mismo md5, no parecidas: la misma—, así que cablearla pondría la
   * foto principal otra vez en la tira de miniaturas, que se lee como un fallo.
   * Comprobado antes de descartarla, no supuesto.
   */
  titanium: { origen: "NuevasTelas/TITANIUM (3).jpg", ancho: 1280 },
  "titanium-caida": { origen: "NuevasTelas/TITANIUM (1).jpg", ancho: 1280 },
  "titanium-trama": { origen: "NuevasTelas/TITANIUM (2).jpg", ancho: 1280 },
  // b.jpg = blanco (convención a/am/b/n/r = azul/amarillo/blanco/negro/rojo,
  // verificada contra la carpeta kAPPA, que usa los nombres completos).
  athletic: { origen: "Microfibra/athletic/b.jpg", ancho: 1080 },
  chelsea: { origen: "Microfibra/chelsea/b.jpg", ancho: 1080 },
  dortmund: { origen: "Microfibra/dormunt/b.jpg", ancho: 1080 },
  // Mezi no tiene b.jpg; su único color plano limpio es el negro.
  mezi: { origen: "texturizado/mezi/negro.jpg", ancho: 1080 },
  "dortmund-plus-brillante": {
    origen: "Telas Brillantes/Dortmund (1).jpg",
    ancho: 1280,
  },
  "sevilla-plus-brillante": {
    origen: "Telas Brillantes/Sevilla (1).jpg",
    ancho: 1280,
  },

  /**
   * Macros de `Texturaa Fotos/`. El archivo no dice qué tela es; lo dice la
   * ETIQUETA de producción que aparece en la toma siguiente del mismo lote, y
   * que se anota aquí junto a sus valores. Donde la ficha existe y la etiqueta
   * es legible, los números coinciden — esa es la verificación.
   */
  // Microfibra
  "dobleface-plus": { origen: "Texturaa Fotos/IMG_7987.jpg", ancho: 1280 }, // IMG_7988 · DOBLE FACE PLUS · 1,20 / 3,00 / 139,00
  sevilla: { origen: "Texturaa Fotos/IMG_8011.jpg", ancho: 1280 }, // IMG_8012 · SEVILLA · 0,90 / 3,90 / 142,30
  "aston-plus": { origen: "Texturaa Fotos/IMG_8013.jpg", ancho: 1280 }, // IMG_8015 · ASTON PLUS · 1,20 / 3,15 / 132,47
  kansas: { origen: "Texturaa Fotos/IMG_8016.jpg", ancho: 1280 }, // IMG_8019 · KANSAS · 1,20 / 3,20
  boston: { origen: "Texturaa Fotos/IMG_8020.jpg", ancho: 1280 }, // IMG_8023 · BOSTON · 0,90 / 4,30
  // La etiqueta dice MICROFIBRA: no es "Juventus 0,90 Tex", que es texturizado
  // y además a pedido. Sin ese campo, los dos nombres serían indistinguibles.
  juventus: { origen: "Texturaa Fotos/IMG_8024.jpg", ancho: 1280 }, // IMG_8027 · JUVENTUS · microfibra

  // Texturizado
  gaby: { origen: "Texturaa Fotos/IMG_8103.jpg", ancho: 1280 }, // IMG_8104 · GABY · 0,90 / 3,60 / 154,32
  napoli: { origen: "Texturaa Fotos/IMG_8105.jpg", ancho: 1280 }, // IMG_8107 · NAPOLI · 1,20 / 3,00 / 138,89
  napoles: { origen: "Texturaa Fotos/IMG_8108.jpg", ancho: 1280 }, // IMG_8111 · NAPOLES · 1,20
  kiana: { origen: "Texturaa Fotos/IMG_8112.jpg", ancho: 1280 }, // IMG_8114 · KIANA · 0,90
  river: { origen: "Texturaa Fotos/IMG_8115.jpg", ancho: 1280 }, // IMG_8118 · RIVER · 1,20 / 3,80
  // "Ribb 150" texturizado, que es de línea. No confundir con "Ribb 150 Mic
  // Tampa", que es microfibra y va a pedido: la etiqueta dice Texturizado.
  "ribb-150": { origen: "Texturaa Fotos/IMG_8123.jpg", ancho: 1280 }, // IMG_8125 · RIBB 150 · texturizado

  /**
   * Interlock 30 vs 40, que estaba sin resolver. Hay dos etiquetas: "INTERLOCK
   * SPUN/40 BLANCO FROZEN" a 1,20 / 2,40 y "INTERLOCK SPUN BLANCO FROZEN" a
   * 1,10 / 2,10 / 216,45. `INTERLOCK.png` marca 1,10 / 2,10 / 216,45, luego esa
   * ficha es la del 30 — por el dato, no por el nombre del archivo.
   */
  "interlock-30": {
    origen: "Tela Interlock Spum Blanco Frozen/_MG_3618.jpg",
    ancho: 1280,
  },
  "interlock-40": { origen: "Texturaa Fotos/IMG_8035.jpg", ancho: 1280 }, // IMG_8036 · INTERLOCK SPUN/40 · 1,20 / 2,40

  // Poli-algodón. Las tres Lacoast se distinguen porque cada etiqueta lleva su
  // nombre completo: LACOAST, LACOAST POLO y LACOAST KRATOS MARENGO.
  "denis-20": { origen: "Texturaa Fotos/IMG_8083.jpg", ancho: 1280 }, // IMG_8084 · DENIS · poli-algodón/20
  "lacoast-20": { origen: "Texturaa Fotos/IMG_8088.jpg", ancho: 1280 }, // IMG_8091 · LACOAST
  "lacoast-polo-20": { origen: "Texturaa Fotos/IMG_8085.jpg", ancho: 1280 }, // IMG_8087 · LACOAST POLO · 80/20
  "lacoast-kratos-22": { origen: "Texturaa Fotos/IMG_8099.jpg", ancho: 1280 }, // IMG_8102 · LACOAST KRATOS MARENGO · 1,20 / 1,82
  "pique-ares-24": { origen: "Texturaa Fotos/IMG_8096.jpg", ancho: 1280 }, // IMG_8098 · PIQUE ARES · 1,20 / 2,10
};

/**
 * Derivados de alta de la galería de Athletic (base de la principal + capa de
 * la lupa macro). Ver `SLOTS_ALTA_TELA` en `slots-imagen.ts` para el porqué de
 * que sean dos archivos.
 *
 * EL RECORTE ES EL MISMO EN LOS DOS Y NO SE TOCA POR SEPARADO. Es la esquina
 * superior derecha del original, 4:3 exacto (3000x2250), elegida por
 * composición sobre la zona en foco: la foto tiene profundidad de campo real y
 * el resto del cuadro se deshace al ampliar. Si alguien mueve uno de los dos
 * rectángulos y no el otro, la lupa deja de ampliar el punto que señala el
 * cursor.
 *
 * Los anchos: 2400 es lo que pide la principal con holgura; 3000 es el ancho
 * ÍNTEGRO del recorte, o sea el techo real. Subirlo sería escalar, y escalar es
 * inventar píxeles que la óptica no capturó — `generar()` lo rechaza.
 */
const RECORTE_ATHLETIC = { left: 3000, top: 0, width: 3000, height: 2250 };

export const ORIGEN_ALTA: Record<string, Receta> = {
  "athletic-macro": {
    origen: "Microfibra/Athletic (3).jpeg",
    ancho: 2400,
    recorte: RECORTE_ATHLETIC,
  },
  "athletic-zoom": {
    origen: "Microfibra/Athletic (3).jpeg",
    ancho: 3000,
    recorte: RECORTE_ATHLETIC,
  },
};

/** Todas las recetas en un solo mapa, para buscar por id. */
export const RECETAS: Record<string, Receta> = {
  ...ORIGEN_FOTOS,
  ...ORIGEN_TELAS,
  ...ORIGEN_ALTA,
};
