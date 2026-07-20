/**
 * Transcripción CRUDA de las 56 fichas técnicas del cliente (PNG en Telas_PW/).
 *
 * ⚠️ NO CONSUMIR DESDE LAS PÁGINAS TODAVÍA. Este archivo es la materia prima
 * verificable, no el dato publicable. Hay erratas de origen y duplicados sin
 * resolver — ver `incidencias` al final. Cuando el cliente valide, de aquí sale
 * el dato limpio hacia `taxonomy.ts`.
 *
 * Los valores se conservan EXACTAMENTE como aparecen impresos, incluido el
 * separador decimal (unas fichas usan coma y otras punto). No se normalizan
 * aquí a propósito: normalizar antes de validar borra la evidencia de que
 * existen dos plantillas distintas.
 *
 * Identificación: las imágenes NO contienen el nombre de la tela. El único
 * vínculo ficha→tela es el nombre del archivo. Ver incidencia `sin-nombre-interno`.
 *
 * ALCANCE (confirmado por el cliente): manda el Excel, es decir `taxonomy.ts`.
 * Las telas que figuran ahí son las que están a la venta y son las únicas que se
 * publican. El resto de la base es producción A PEDIDO y NO debe verse en el
 * sitio. Por eso una ficha con `slug: null` no es un hueco por llenar: es un
 * producto deliberadamente fuera del catálogo público, y sus incidencias no
 * bloquean nada. Usar `fichasEnVenta` para todo lo que vaya a pantalla.
 */

/** Las tres calidades que el cliente mide por tela. */
export type Calidad = "lci" | "lc" | "lcd";

export type Terna = Record<Calidad, string | null>;

/**
 * Las fichas vienen en dos plantillas distintas. No es cosmético: cambian la
 * norma declarada para el ancho tubular y la tabla de sublimación.
 */
export type Plantilla = "A" | "B";

export interface FichaRaw {
  /** Ruta del PNG de origen, para poder re-verificar cualquier valor. */
  archivo: string;
  /** Slug de la subcategoría en taxonomy.ts, o null si no hay correspondencia. */
  slug: string | null;
  composicion: string;
  /** m, ±0,01 */
  anchoTubular: Terna;
  /** g/m², ±5% */
  pesoPorArea: Terna;
  /** m/kg, ±5% */
  rendimiento: Terna;
  usoConfeccion: string;
  plantilla: Plantilla;
  /** Claves de `incidencias` que afectan a esta ficha. */
  flags?: string[];
}

/** Normas declaradas, por plantilla. */
export const NORMAS = {
  A: {
    composicion: "AATCC 20A",
    anchoTubular: "ASTM D3774",
    pesoPorArea: "ASTM D3776",
    rendimiento: "ASTM D3776",
  },
  B: {
    composicion: "AATCC 20A",
    anchoTubular: "ASTM D3776",
    pesoPorArea: "ASTM D3776",
    rendimiento: "ASTM D3776",
  },
} as const;

/**
 * Tabla de sublimación, por plantilla. Idéntica en las 56 fichas salvo la fila
 * 150-200, que en la plantilla B repite el tiempo de la fila anterior.
 */
export const SUBLIMACION = {
  A: [
    { gramaje: "100 - 150 g/m", temperatura: "200° +/- 10°C", tiempo: "25 - 29 seg." },
    { gramaje: "150 - 200 g/m", temperatura: "200° +/- 10°C", tiempo: "28 - 32 seg." },
    { gramaje: "200 - 250 g/m", temperatura: "200° +/- 10°C", tiempo: "31 - 35 seg." },
  ],
  B: [
    { gramaje: "100 - 150 g/m", temperatura: "200° +/- 10°C", tiempo: "25 - 29 seg." },
    { gramaje: "150 - 200 g/m", temperatura: "200° +/- 10°C", tiempo: "25 - 29 seg." },
    { gramaje: "200 - 250 g/m", temperatura: "200° +/- 10°C", tiempo: "31 - 35 seg." },
  ],
} as const;

/** Cuidados. Idénticos en 54 de 56 fichas; Cira y Denis difieren (ver flags). */
export const CUIDADOS_ESTANDAR = [
  "Lavado a maquina o manual. No dejar en remojo",
  "Secar en temperatura normal",
  "Planchar a temperatura media",
] as const;

export const CUIDADOS_DELICADO = [
  "Lavado a maquina ciclo delicado. Remojo horizontal",
  "Secar en temperatura normal",
  "Planchar a temperatura baja",
] as const;

const t = (lci: string | null, lc: string | null, lcd: string | null): Terna => ({
  lci,
  lc,
  lcd,
});

const USO_DEPORTIVO = "Confección de inumentaria deportivas, complementos deportivos.";
const USO_CASUAL = "Confección de camisetas casuales y escolares.";
const USO_ALTO_DESEMPENO_1 =
  "Prendas deportivas orientadas al alto desempeño de la actividad física/Complemento para prendas exteriores";
const USO_ALTO_DESEMPENO_2 =
  "Prendas deportivas orientadas al alto desempeño de la actividad física. Prendas exteriores/interiores.";
const USO_COMPLEMENTOS = "Complementos deportivos y exteriores";

export const fichasMicrofibra: FichaRaw[] = [
  /**
   * Aston Plus, no Aston. El ancho tubular los separa: en las 6 parejas
   * base/Plus del catálogo la base mide 0,90 y la Plus 1,20, sin excepción.
   * Esta mide 1,20. `Aston.png` (0,90) es la base, que no está en el Excel.
   */
  { archivo: "Telas_PW/Microfibras/Aston Plus.png", slug: "aston-plus", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("125,85", "132,47", "139,09"), rendimiento: t("2,99", "3,15", "3,31"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Aston.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("150,62", "158,55", "166,48"), rendimiento: t("3,33", "3,50", "3,68"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Microfibras/Athletic.png", slug: "athletic", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("152,57", "160,60", "168,63"), rendimiento: t("3,29", "3,46", "3,63"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Atlanta.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1.19", "1.20", "1.21"), pesoPorArea: t("127.30", "134.00", "140.70"), rendimiento: t("2.94", "3.10", "3.26"), usoConfeccion: USO_ALTO_DESEMPENO_1, plantilla: "B", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Microfibras/Boston Plus.png", slug: "boston-plus", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("123,69", "130,20", "136,71"), rendimiento: t("3,04", "3,20", "3,36"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Boston.png", slug: "boston", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("122,74", "129,20", "135,66"), rendimiento: t("4,09", "4,30", "4,52"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Chelsea Plus.png", slug: "chelsea-plus", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("141,36", "148,80", "156,24"), rendimiento: t("2,66", "2,80", "2,94"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["dup-chelseaplus-napoles"] },
  { archivo: "Telas_PW/Microfibras/Chelsea.png", slug: "chelsea", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("159,93", "168,35", "176,77"), rendimiento: t("3,14", "3,30", "3,47"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["dup-chelsea-dortmund-melina"] },
  { archivo: "Telas_PW/Microfibras/Dinamo.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,68", "1,70", "1,72"), pesoPorArea: t("138,04", "145,30", "152,57"), rendimiento: t("3,85", "4,05", "4,25"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  /** El Excel lo escribe "Dobleface Plus" (junto); el PNG, "Doble Face Plus". */
  { archivo: "Telas_PW/Microfibras/Doble Face Plus.png", slug: "dobleface-plus", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("132,05", "139,00", "145,95"), rendimiento: t("2,85", "3,00", "3,15"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Doble Face.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("146,60", "154,32", "162,04"), rendimiento: t("3,42", "3,60", "3,78"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia", "dup-dobleface-gaby"] },
  { archivo: "Telas_PW/Microfibras/Dortmund Plus.png", slug: "dortmund-plus", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("127,69", "134,41", "141,13"), rendimiento: t("2,95", "3,10", "3,26"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["contradice-taxonomia"] },
  { archivo: "Telas_PW/Microfibras/Dortmund.png", slug: "dortmund", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("159,93", "168,35", "176,77"), rendimiento: t("3,14", "3,30", "3,47"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["dup-chelsea-dortmund-melina"] },
  { archivo: "Telas_PW/Microfibras/Dunga.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,68", "1,70", "1,72"), pesoPorArea: t("115,48", "121,56", "127,64"), rendimiento: t("4,60", "4,84", "5,08"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Microfibras/Fiorentina.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("125.66", "132,27", "138,88"), rendimiento: t("3,99", "4,20", "4,41"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia", "decimal-mixto"] },
  { archivo: "Telas_PW/Microfibras/Juventus.png", slug: "juventus", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("119,95", "126,26", "132,57"), rendimiento: t("3,14", "3,30", "3,47"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Kansas.png", slug: "kansas", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("123,86", "130,38", "136,90"), rendimiento: t("3,04", "3,20", "3,36"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Kappa.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("142,98", "150,50", "158,03"), rendimiento: t("3,52", "3,70", "3,89"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Microfibras/Polux.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("199,73", "210,24", "220,75"), rendimiento: t("2,51", "2,64", "2,77"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Microfibras/Porto.png", slug: null, composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("122,82", "129,28", "135,74"), rendimiento: t("4,08", "4,30", "4,51"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Microfibras/Sevilla Plus.png", slug: "sevilla-plus", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("111,46", "117,33", "123,20"), rendimiento: t("3,37", "3,55", "3,73"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Sevilla.png", slug: "sevilla", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("135,19", "142,30", "149,42"), rendimiento: t("3,71", "3,90", "4,10"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/Microfibras/Titanium.png", slug: "titanium", composicion: "POLIESTER MICROFIBRA", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("245.73", "258.66", "271.59"), rendimiento: t("2.04", "2.15", "2.26"), usoConfeccion: "Prendas deportivas orientadas al alto desempeño de la actividad física", plantilla: "B" },
];

export const fichasPolialgodon: FichaRaw[] = [
  { archivo: "Telas_PW/Polialgodón/AUSTRIA.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("184,84", "196,57", "204,30"), rendimiento: t("2,03", "2,14", "2,25"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Polialgodón/Aruba.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("165,30", "174,00", "182,70"), rendimiento: t("2,28", "2,40", "2,52"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Polialgodón/Austria Premium.png", slug: "austria-premium-18", composicion: "POLIESTER/ALGODÓN", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("188,10", "198,00", "207,90"), rendimiento: t("2,00", "2,10", "2,21"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["dup-austriapremium-piqueares"] },
  { archivo: "Telas_PW/Polialgodón/Cira.png", slug: null, composicion: "POLIALGODON PEINADO 65/35", anchoTubular: t("1.14", "1.15", "1.16"), pesoPorArea: t("185.56", "195.33", "205.10"), rendimiento: t("2.12", "2.23", "2.34"), usoConfeccion: "Versátil e ideal para prendas de vestir para público masculino, femenino o infantil.", plantilla: "B", flags: ["fuera-de-taxonomia", "cuidados-delicado"] },
  { archivo: "Telas_PW/Polialgodón/Danna.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("0,86", "0,87", "0,88"), pesoPorArea: t("204,35", "215,00", null), rendimiento: t("2,54", "2,67", "2,80"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia", "errata-danna-lcd"] },
  { archivo: "Telas_PW/Polialgodón/Denis.png", slug: "denis-20", composicion: "POLIALGODON PEINADO 65/35", anchoTubular: t("0.85", "0.86", "0.87"), pesoPorArea: t("190.46", "200.48", "210.50"), rendimiento: t("2.75", "2.90", "3.04"), usoConfeccion: "Complementos para prendas deportivas. Complementos prendas exteriores/interiores.", plantilla: "B" },
  { archivo: "Telas_PW/Polialgodón/HUNGRIA.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("1,14", "1,15", "1,16"), pesoPorArea: t("171,00", "180,00", "189,00"), rendimiento: t("2,30", "2,42", "2,54"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Polialgodón/Lacoast Kratos.png", slug: "lacoast-kratos-22", composicion: "POLIALGODON PEINADO 65/35", anchoTubular: t("1.19", "1.20", "1.21"), pesoPorArea: t("197.91", "208.33", "218.75"), rendimiento: t("1.90", "2.00", "2.10"), usoConfeccion: "Confección de camisetas polos y escolares.", plantilla: "B", flags: ["dup-lacoast1-kratos"] },
  { archivo: "Telas_PW/Polialgodón/Lacoast Polo.png", slug: "lacoast-polo-20", composicion: "POLIESTER/ALGODÓN", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("219,91", "231,41", "243,05"), rendimiento: t("1,71", "1,80", "1,89"), usoConfeccion: USO_CASUAL, plantilla: "A" },
  { archivo: "Telas_PW/Polialgodón/Lacoast1.png", slug: "lacoast-20", composicion: "POLIESTER/ALGODÓN", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("197,91", "208,33", "218,75"), rendimiento: t("1,90", "2,00", "2,10"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["dup-lacoast1-kratos"] },
  { archivo: "Telas_PW/Polialgodón/MELINA.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("159,93", "168,35", "176,77"), rendimiento: t("3,14", "3,30", "3,47"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia", "dup-chelsea-dortmund-melina"] },
  { archivo: "Telas_PW/Polialgodón/PIQUE ARES.png", slug: "pique-ares-24", composicion: "POLIESTER/ALGODÓN", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("188,10", "198,00", "207,90"), rendimiento: t("2,00", "2,10", "2,21"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["dup-austriapremium-piqueares"] },
  { archivo: "Telas_PW/Polialgodón/Ribb.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("0,59", "0,60", "0,61"), pesoPorArea: t("247,40", "260,42", "273,44"), rendimiento: t("3,04", "3,20", "3,36"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia", "gramaje-fuera-de-tabla"] },
  { archivo: "Telas_PW/Polialgodón/ZURICH.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("0,85", "0,86", "0,87"), pesoPorArea: t("184,10", "193,79", "203,48"), rendimiento: t("2,85", "3,00", "3,15"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Polialgodón/suiza.png", slug: null, composicion: "POLIESTER/ALGODÓN", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("175,92", "185,18", "194,44"), rendimiento: t("2,85", "3,00", "3,15"), usoConfeccion: USO_CASUAL, plantilla: "A", flags: ["fuera-de-taxonomia", "casi-dup-suiza-ribb150"] },
];

export const fichasSpun: FichaRaw[] = [
  { archivo: "Telas_PW/Spun/BUFF ROMINA.png", slug: "buff-romina-30", composicion: "POLIESTER SPUN", anchoTubular: t("0,24", "0,25", "0,26"), pesoPorArea: t("114,00", "120,00", "126,00"), rendimiento: t("15,83", "15,83", "17,50"), usoConfeccion: "Confección de buffs", plantilla: "A", flags: ["errata-buffromina-rendimiento", "titulo-sin-numero"] },
  { archivo: "Telas_PW/Spun/INTERLOCK.png", slug: "interlock-30", composicion: "POLIESTER SPUN", anchoTubular: t("1,09", "1,10", "1,11"), pesoPorArea: t("205,63", "216,45", "227,27"), rendimiento: t("2,00", "2,10", "2,21"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["titulo-sin-numero"] },
  { archivo: "Telas_PW/Spun/RIBB DELTA PLUS.png", slug: null, composicion: "POLIESTER SPUN", anchoTubular: t("0.89", "0.90", "0.91"), pesoPorArea: t("110.20", "116.00", "121.80"), rendimiento: t("4.55", "4.79", "5.03"), usoConfeccion: USO_ALTO_DESEMPENO_2, plantilla: "B", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Spun/RIBB DELTA SUPER PLUS.png", slug: null, composicion: "POLIESTER SPUN", anchoTubular: t("1,09", "1,10", "1,11"), pesoPorArea: t("95,95", "101,00", "106,05"), rendimiento: t("4,28", "4,50", "4,73"), usoConfeccion: USO_COMPLEMENTOS, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/Spun/RIBB SPUN.png", slug: null, composicion: "POLIESTER SPUN", anchoTubular: t("0,59", "0,60", "0,61"), pesoPorArea: t("197,91", "208,33", "218,75"), rendimiento: t("3,80", "4,00", "4,20"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["titulo-sin-numero", "dup-ribbspun-recurso98"] },
  { archivo: "Telas_PW/Spun/Recurso 98.png", slug: null, composicion: "POLIESTER SPUN", anchoTubular: t("0,59", "0,60", "0,61"), pesoPorArea: t("197,91", "208,33", "218,75"), rendimiento: t("3,80", "4,00", "4,20"), usoConfeccion: USO_COMPLEMENTOS, plantilla: "A", flags: ["sin-identificar", "dup-ribbspun-recurso98"] },
  { archivo: "Telas_PW/Spun/SIMONE.png", slug: null, composicion: "POLIESTER SPUN", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("173,43", "182,60", "191,73"), rendimiento: t("2,89", "3,04", "3,19"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
];

export const fichasTexturizado: FichaRaw[] = [
  { archivo: "Telas_PW/texturizado/GABY.png", slug: "gaby", composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("146,60", "154,32", "162,04"), rendimiento: t("3,42", "3,60", "3,78"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["dup-dobleface-gaby"] },
  { archivo: "Telas_PW/texturizado/JUVENTUS 0,90.png", slug: null, composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("109,95", "115,74", "121,53"), rendimiento: t("4,56", "4,80", "5,04"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/texturizado/KIANA.png", slug: "kiana", composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("0,89", "0,90", "0,91"), pesoPorArea: t("117,29", "123,46", "129,63"), rendimiento: t("4,28", "4,50", "4,73"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/texturizado/MEZI.png", slug: "mezi", composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("56,54", "59,52", "62,50"), rendimiento: t("6,65", "7,00", "7,35"), usoConfeccion: "Complementos  para prendas exteriores", plantilla: "A", flags: ["gramaje-fuera-de-tabla"] },
  { archivo: "Telas_PW/texturizado/NAPOLES.png", slug: "napoles", composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("1.19", "1.20", "1.21"), pesoPorArea: t("141.36", "148.80", "156.24"), rendimiento: t("2.66", "2.80", "2.94"), usoConfeccion: USO_ALTO_DESEMPENO_2, plantilla: "B", flags: ["dup-chelseaplus-napoles"] },
  { archivo: "Telas_PW/texturizado/NAPOLI PLUS.png", slug: null, composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("1,42", "1,43", "1,44"), pesoPorArea: t("123,03", "129,50", "135,98"), rendimiento: t("2,57", "2,70", "2,84"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/texturizado/NAPOLI.png", slug: "napoli", composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("131,95", "138,89", "145,83"), rendimiento: t("2,85", "3,00", "3,15"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
  { archivo: "Telas_PW/texturizado/POLICRON.png", slug: null, composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("1,14", "1,15", "1,16"), pesoPorArea: t("187,75", "197,63", "207,51"), rendimiento: t("2,09", "2,20", "2,31"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia"] },
  { archivo: "Telas_PW/texturizado/RIBB 150.png", slug: "ribb-150", composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("0,59", "0,60", "0,61"), pesoPorArea: t("175,93", "185,19", "194,45"), rendimiento: t("4,28", "4,50", "4,73"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["titulo-sin-numero", "casi-dup-suiza-ribb150"] },
  { archivo: "Telas_PW/texturizado/RIVER 1,12.png", slug: null, composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("1,11", "1,12", "1,13"), pesoPorArea: t("90,25", "95,00", "99,75"), rendimiento: t("4,47", "4,70", "4,94"), usoConfeccion: USO_DEPORTIVO, plantilla: "A", flags: ["fuera-de-taxonomia", "gramaje-fuera-de-tabla"] },
  { archivo: "Telas_PW/texturizado/RIVER.png", slug: "river", composicion: "POLIESTER TEXTURIZADO", anchoTubular: t("1,19", "1,20", "1,21"), pesoPorArea: t("104,17", "109,65", "115,13"), rendimiento: t("3,61", "3,80", "3,99"), usoConfeccion: USO_DEPORTIVO, plantilla: "A" },
];

export const todasLasFichas: FichaRaw[] = [
  ...fichasMicrofibra,
  ...fichasPolialgodon,
  ...fichasSpun,
  ...fichasTexturizado,
];

/**
 * `fuera-de-alcance` no significa "resuelta": la incidencia sigue ahí, pero solo
 * afecta a telas a pedido que no se publican. Se conserva por si alguna se
 * incorpora al catálogo más adelante.
 */
export type Severidad =
  | "bloqueante"
  | "revisar"
  | "cosmetico"
  | "fuera-de-alcance";

export interface Incidencia {
  clave: string;
  severidad: Severidad;
  descripcion: string;
  /** Qué hay que preguntarle al cliente para poder cerrarla. */
  preguntaAlCliente: string;
}

/**
 * Todo lo que impide publicar estos datos tal cual. Ninguna se resuelve
 * adivinando: las erratas son del origen y solo el cliente puede confirmarlas.
 */
export const incidencias: Incidencia[] = [
  {
    clave: "sin-nombre-interno",
    severidad: "bloqueante",
    descripcion:
      "Ninguna de las 56 imágenes contiene el nombre de la tela. El único vínculo ficha→tela es el nombre del archivo, y varios son poco fiables ('Recurso 98', 'dormunt', 'Lacoast' vs 'Lacoste'). Todo el mapeo descansa sobre esa suposición.",
    preguntaAlCliente:
      "¿Puede confirmar el listado archivo→tela, o entregar las fichas con el nombre impreso?",
  },
  {
    clave: "sin-identificar",
    severidad: "fuera-de-alcance",
    descripcion:
      "'Recurso 98.png' es una ficha válida y completa pero no se puede saber de qué tela es. Sus números coinciden con RIBB SPUN y su uso de confección con RIBB DELTA SUPER PLUS.",
    preguntaAlCliente: "¿A qué tela corresponde 'Recurso 98'?",
  },
  {
    clave: "errata-danna-lcd",
    severidad: "fuera-de-alcance",
    descripcion:
      "Danna: peso por área LCI 204,35 → LC 215,00 → LCD '22,75'. El LCD está fuera de escala por un orden de magnitud (debería rondar 225). Transcrito como null.",
    preguntaAlCliente: "¿Cuál es el peso por área LCD real de Danna?",
  },
  {
    clave: "errata-buffromina-rendimiento",
    severidad: "bloqueante",
    descripcion:
      "Buff Romina: rendimiento LCI y LC son ambos 15,83. Rompe la progresión LCI<LC<LCD que cumplen las otras 55 fichas.",
    preguntaAlCliente: "¿Cuál es el rendimiento LCI real de Buff Romina?",
  },
  {
    clave: "dup-chelsea-dortmund-melina",
    severidad: "bloqueante",
    descripcion:
      "Chelsea (microfibra), Dortmund (microfibra) y Melina (polialgodón) tienen ancho, peso y rendimiento IDÉNTICOS. Melina es a pedido, pero Chelsea y Dortmund SÍ se venden: quedarían publicadas como dos telas distintas con especificación idéntica.",
    preguntaAlCliente:
      "Chelsea y Dortmund figuran con los mismos valores. ¿Cuáles son los reales de cada una?",
  },
  {
    clave: "dup-chelseaplus-napoles",
    severidad: "bloqueante",
    descripcion:
      "Chelsea Plus (microfibra) y Napoles (texturizado) tienen las tres magnitudes idénticas, pese a ser de familias distintas y estar en plantillas distintas.",
    preguntaAlCliente: "¿Cuáles son los valores reales de cada una?",
  },
  {
    clave: "dup-dobleface-gaby",
    severidad: "revisar",
    descripcion:
      "Doble Face (microfibra) y Gaby (texturizado) tienen las tres magnitudes idénticas. Doble Face es a pedido, así que solo Gaby se publica: no hay contradicción visible en el sitio, pero los valores de Gaby quedan sin verificar.",
    preguntaAlCliente: "¿Los valores de Gaby son correctos?",
  },
  {
    clave: "dup-lacoast1-kratos",
    severidad: "bloqueante",
    descripcion:
      "Lacoast1 y Lacoast Kratos tienen valores idénticos, en plantillas distintas (A y B). AMBAS se venden ('lacoast-20' y 'lacoast-kratos-22' están en el Excel), así que se publicarían como dos productos distintos con la misma especificación. O una ficha está mal, o son la misma tela listada dos veces.",
    preguntaAlCliente:
      "¿Lacoast y Lacoast Kratos son la misma tela o dos productos distintos? Si son distintos, ¿cuáles son los valores de cada uno?",
  },
  {
    clave: "dup-austriapremium-piqueares",
    severidad: "bloqueante",
    descripcion:
      "Austria Premium y Pique Ares tienen las tres magnitudes idénticas. Con el catálogo definitivo AMBAS son de línea (antes se creía que Austria Premium no existía), así que se publicarían como dos productos distintos con la misma especificación.",
    preguntaAlCliente:
      "Austria Premium 18 y Pique Ares 24 figuran con los mismos valores. ¿Cuáles son los reales de cada uno?",
  },
  {
    clave: "ficha-sin-asignar",
    severidad: "bloqueante",
    descripcion:
      "Hay PNG que no se pueden atribuir a un producto concreto, y no se adivinan. (1) `MELINA.png`: 'Melisa 24 Pei' es DE LÍNEA y 'Melina 24 Pei' es A PEDIDO — una letra de diferencia, y los PNG no llevan el nombre dentro. (2) `Ribb.png` (polialgodón): un solo PNG para dos productos de línea, 'Ribb 18 Pei' y 'Ribb 20/24 Pei'. Las tres telas quedan sin ficha.",
    preguntaAlCliente:
      "¿`MELINA.png` es la ficha de Melisa o de Melina? ¿Y `Ribb.png` corresponde a Ribb 18 o a Ribb 20/24?",
  },
  {
    clave: "dup-ribbspun-recurso98",
    severidad: "fuera-de-alcance",
    descripcion:
      "Ribb Spun y Recurso 98 tienen valores idénticos y solo difieren en el uso de confección. Probablemente la misma ficha duplicada.",
    preguntaAlCliente: "¿Son la misma tela?",
  },
  {
    clave: "casi-dup-suiza-ribb150",
    severidad: "revisar",
    descripcion:
      "Suiza (polialgodón) 175,92/185,18/194,44 vs Ribb 150 (texturizado) 175,93/185,19/194,45 — difieren en 0,01 en las tres celdas. Demasiado cerca para ser casual.",
    preguntaAlCliente: "¿Los pesos de Suiza y Ribb 150 son correctos?",
  },
  {
    clave: "contradice-taxonomia",
    severidad: "revisar",
    descripcion:
      "La ficha de Dortmund Plus da rendimiento LCI 2,95; taxonomy.ts publica hoy '2.94 m/kg'. El gramaje (134,41) y el ancho (1,20) sí coinciden.",
    preguntaAlCliente: "Ninguna — corregir taxonomy.ts a 2,95 una vez validada la ficha.",
  },
  {
    clave: "gramaje-fuera-de-tabla",
    severidad: "revisar",
    descripcion:
      "Mezi (56-62 g/m²), River 1,12 (90-99 g/m²) y Ribb polialgodón (247-273 g/m²) quedan fuera del rango 100-250 g/m² que cubre su propia tabla de sublimación. La recomendación no alcanza al producto que describe.",
    preguntaAlCliente:
      "¿Qué temperatura y tiempo de sublimación aplican por debajo de 100 g/m² y por encima de 250?",
  },
  {
    clave: "fuera-de-taxonomia",
    severidad: "fuera-de-alcance",
    descripcion:
      "RESUELTA. 32 fichas no corresponden a ninguna subcategoría de taxonomy.ts (las de `slug: null`, ver `telasSinSlug`). El cliente confirmó que la base de producción es mayor que el catálogo de venta: esas telas son producción A PEDIDO y NO deben publicarse. El Excel manda.",
    preguntaAlCliente:
      "Resuelta. Pendiente menor: ¿alguna tela a pedido debe mostrarse igualmente, marcada como 'a pedido'? Si es así, hace falta un campo para distinguirlas.",
  },
  {
    clave: "titulo-sin-numero",
    severidad: "revisar",
    descripcion:
      "taxonomy.ts nombra las telas Spun con título (Ribb 20/30/40, Interlock 30, Buff Romina 30) pero las fichas no declaran ningún título. No hay forma de saber a qué título corresponde cada ficha. Además 'Ribb 150' no tiene ningún 150 en su tabla (ancho 0,60 m, peso 185,19 g/m²).",
    preguntaAlCliente:
      "¿A qué título corresponde cada ficha de Spun? ¿Qué significa el 150 de Ribb 150?",
  },
  {
    clave: "cuidados-delicado",
    severidad: "cosmetico",
    descripcion:
      "Cira declara cuidados distintos al resto: ciclo delicado, remojo horizontal y plancha a temperatura baja. Denis también difiere en el texto de uso.",
    preguntaAlCliente: "Ninguna — usar CUIDADOS_DELICADO para Cira.",
  },
  {
    clave: "decimal-mixto",
    severidad: "cosmetico",
    descripcion:
      "Fiorentina mezcla separadores dentro de la misma fila: peso LCI '125.66' con punto, LC '132,27' y LCD '138,88' con coma.",
    preguntaAlCliente: "Ninguna — normalizar a coma al publicar.",
  },
  {
    clave: "typo-inumentaria",
    severidad: "cosmetico",
    descripcion:
      "El uso de confección más frecuente dice 'inumentaria' en lugar de 'indumentaria'. Está así en el original, en decenas de fichas.",
    preguntaAlCliente: "Ninguna — corregir al publicar.",
  },
];

/**
 * Las únicas fichas publicables: las que corresponden a una tela del Excel.
 * Todo lo que vaya a pantalla debe salir de aquí, no de `todasLasFichas`.
 */
export const fichasEnVenta = todasLasFichas.filter((f) => f.slug !== null);

/** Fichas de telas a pedido — no se publican. */
export const telasSinSlug = todasLasFichas
  .filter((f) => f.slug === null)
  .map((f) => f.archivo);

/** Telas en venta afectadas por una incidencia dada. */
export function afectadasEnVenta(clave: string): string[] {
  return fichasEnVenta
    .filter((f) => (f.flags ?? []).includes(clave))
    .map((f) => f.slug as string);
}

const BLOQUEANTES = new Set(
  incidencias.filter((i) => i.severidad === "bloqueante").map((i) => i.clave),
);

/** Telas en venta que NO se pueden publicar todavía. */
export const enVentaBloqueadas = fichasEnVenta.filter((f) =>
  (f.flags ?? []).some((flag) => BLOQUEANTES.has(flag)),
);

/** Telas en venta listas para volcar a taxonomy.ts. */
export const enVentaPublicables = fichasEnVenta.filter(
  (f) => !(f.flags ?? []).some((flag) => BLOQUEANTES.has(flag)),
);

export const resumen = {
  fichas: todasLasFichas.length,
  enVenta: fichasEnVenta.length,
  aPedido: telasSinSlug.length,
  plantillaA: todasLasFichas.filter((f) => f.plantilla === "A").length,
  plantillaB: todasLasFichas.filter((f) => f.plantilla === "B").length,
  bloqueantes: BLOQUEANTES.size,
  publicablesYa: enVentaPublicables.length,
  bloqueadas: enVentaBloqueadas.length,
};
