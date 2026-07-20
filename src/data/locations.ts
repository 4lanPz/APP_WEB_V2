/**
 * Locales de Textil Padilla en Ecuador.
 *
 * Regla de negocio confirmada en el export de Claude Design (Contacto.dc.html):
 * NO inventar direcciones ni teléfonos reales. Nombre, zona y referencia sí
 * son estructura real; dirección/teléfono/horario quedan "pendiente de
 * confirmar" hasta que administración los entregue.
 */

export interface Location {
  ref: string;
  name: string;
  zone: string;
  isMatriz: boolean;
  /** Posición aproximada en el mapa esquemático, en % (left/top). */
  position: { left: number; top: number };
}

export const locations: Location[] = [
  {
    ref: "01",
    name: "Matriz Alangasí",
    zone: "Valle de los Chillos · Producción",
    isMatriz: true,
    position: { left: 58, top: 62 },
  },
  {
    ref: "02",
    name: "La Marín",
    zone: "Quito · Centro",
    isMatriz: false,
    position: { left: 50, top: 48 },
  },
  {
    ref: "03",
    name: "Solanda",
    zone: "Quito · Sur",
    isMatriz: false,
    position: { left: 47, top: 55 },
  },
  {
    ref: "04",
    name: "Sangolquí",
    zone: "Valle de los Chillos",
    isMatriz: false,
    position: { left: 60, top: 66 },
  },
  {
    ref: "05",
    name: "Guayaquil",
    zone: "Costa · Litoral",
    isMatriz: false,
    position: { left: 24, top: 78 },
  },
];

export const PENDING = "Pendiente de confirmar";
