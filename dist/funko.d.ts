/**
 * Enumerado para el tipo de Funko
 * @enum
 */
export declare enum Tipo {
    Pop = "Pop!",
    PopRides = "Pop! Rides",
    VinylSoda = "Vinyl Soda",
    VinylGold = "Vinyl Gold"
}
/**
 * Enumerado para el género del Funko
 * @enum
 */
export declare enum Genero {
    Animacion = "Animaci\u00F3n",
    PeliculasTV = "Pel\u00EDculas y TV",
    Videojuegos = "Videojuegos",
    Deportes = "Deportes",
    Musica = "M\u00FAsica",
    Anime = "\u00C1nime"
}
/**
 * Interface para representar el Funko
 * @interface
 */
export interface Funko {
    id: string;
    nombre: string;
    descripcion: string;
    tipo: Tipo;
    genero: Genero;
    franquicia: string;
    numero: number;
    exclusivo: boolean;
    caracteristicasEspeciales: string;
    valorDeMercado: number;
}
