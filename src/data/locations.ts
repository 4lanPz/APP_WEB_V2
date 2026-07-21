/**
 * Locales de Textil Padilla en Ecuador.
 *
 * COORDENADAS: reales, resueltas desde las fichas de Google Maps que entregó el
 * cliente (2026-07). Se toma el par `!3d/!4d` de la URL larga —la posición del
 * marcador—, no el `@lat,lng`, que es solo el centro del encuadre y cae unos
 * metros al lado. Los nombres de `googleName` son los que la propia ficha
 * publica.
 *
 * DIRECCIONES: siguen pendientes, y la regla del export de Claude Design sigue
 * en pie — no inventar. La ficha de Google da coordenada y nombre, no calle y
 * número, y la geocodificación inversa sobre esas coordenadas devuelve negocios
 * vecinos (una óptica, un parque), no la dirección del local. `sector` sí es
 * dato firme: coincide en la ficha de Google y en OpenStreetMap.
 *
 * OJO GUAYAQUIL: la ficha se llama "Punto de Distribución Guayaquil", pero la
 * coordenada cae en Samborondón (Vía Samborondón, provincia del Guayas), que es
 * cantón aparte. Está pendiente de confirmar con administración.
 */

export interface Location {
  ref: string;
  name: string;
  zone: string;
  isMatriz: boolean;
  /** [latitud, longitud] — posición del marcador en la ficha de Google. */
  coords: [number, number];
  /** Nombre con el que el local figura publicado en Google Maps. */
  googleName: string;
  /** Parroquia o sector. Confirmado por Google y OSM; no es la dirección. */
  sector: string;
}

export const locations: Location[] = [
  {
    ref: "01",
    name: "Matriz Alangasí",
    zone: "Valle de los Chillos · Producción",
    isMatriz: true,
    coords: [-0.2995491, -78.438071],
    googleName: "Textil Padilla Cía. Ltda.",
    sector: "San Pedro del Tingo, Alangasí",
  },
  {
    ref: "02",
    name: "La Marín",
    zone: "Quito · Centro",
    isMatriz: false,
    coords: [-0.2214375, -78.5094375],
    googleName: "Textil Padilla Cia. Ltda — Punto de Venta Centro Histórico",
    sector: "San Marcos, Centro Histórico",
  },
  {
    ref: "03",
    name: "Solanda",
    zone: "Quito · Sur",
    isMatriz: false,
    coords: [-0.2747116, -78.5364546],
    googleName: "Textil Padilla Cia. Ltda — Punto de Venta Sur de Quito",
    sector: "Turubamba, Solanda",
  },
  {
    ref: "04",
    name: "Sangolquí",
    zone: "Valle de los Chillos",
    isMatriz: false,
    coords: [-0.3255442, -78.4472473],
    googleName: "Textil Padilla Cia. Ltda — Punto de Venta Sangolquí",
    sector: "Avenida Luis Cordero, Sangolquí",
  },
  {
    ref: "05",
    name: "Guayaquil",
    zone: "Costa · Litoral",
    isMatriz: false,
    coords: [-2.0363066, -79.846961],
    googleName: "Textil Padilla Cia. Ltda — Punto de Distribución Guayaquil",
    sector: "Vía Samborondón, Samborondón (Guayas)",
  },
];

export const PENDING = "Pendiente de confirmar";

/**
 * Enlace de NAVEGACIÓN a Google Maps. Aquí Google es lo correcto: es para
 * llegar, no para mostrar —el mapa del sitio es Leaflet, ver `MapaLocales`—.
 * Usa la URL API documentada, que no necesita clave ni facturación.
 */
export function comoLlegar(location: Location): string {
  const [lat, lng] = location.coords;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
