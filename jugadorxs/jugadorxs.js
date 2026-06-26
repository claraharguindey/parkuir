const JUGADORXS = [
  // ── PARKUIR ──────────────────────────────────────────────────────────────
  {
    name: "Maria Laudes",
    alias: "Rayito McQueen",
    meta: "1992, Alzira · Ella / Elle",
    liga: "Gorda · Queer",
    desc: "Ha sobrevivido a maestros de educación física, clases de natación para bajar de peso, prescripciones médicas y la expulsión de las clases de Hip hop. Finalmente se convirtió en una de las más grandes atletas de Parkuir.",
  },
  {
    name: "Guiu Gimeno Bardis",
    alias: "Fazt Zopaz · David Meca Lieto",
    meta: "1996, Sant Vicenç dels Horts · Elle / El",
    liga: "Queer",
    desc: 'Una infancia "marimacho" con habilidades deportivas, pero a medida que fue transicionando hacia persona no binaria, espacios como la piscina se convirtieron en hostiles y no deseables.',
  },
  {
    name: "Costa Badia",
    meta: "Ella",
    liga: "Crip",
    desc: "",
    img: "",
  },
  {
    name: "Clara López",
    alias: "Mesa camilla",
    liga: "",
    desc: "",
    img: "",
  },
  {
    name: "Christian Fernández Mirón",
    liga: "",
    desc: "",
    img: "",
  },
  {
    name: "Norma Mor",
    liga: "",
    desc: "",
    img: "",
  },
  {
    name: "Jose Vaquerizo",
    alias: "VAKE",
    liga: "",
    desc: "",
    img: "",
  },

  // ── REFERENTES ───────────────────────────────────────────────────────────
  {
    name: "Katharina Brumbach",
    alias: "Katie Sandwina · Lady Hércules · La Sufragista",
    meta: "1884, Essen",
    liga: "Queer · Rarite",
    desc: 'Artista de circo y sufragista. En 1902 derrotó al "padre del culturismo" levantando 136 kg sobre su cabeza. Fundó la primera sociedad sufragista del mundo del circo: Suffragette Ladies of Barnum & Bailey, 800 mujeres.',
    img: "./../fotos/48.jpg",
  },
  {
    name: "Fred Lorz",
    alias: "The Practical Joker",
    meta: "1884, Nueva York · Él",
    liga: "",
    desc: 'Maratonista famoso por sus trampas en San Luis 1904. Subió al coche de su representante tras 14 km, volvió a correr cuando se averió y cruzó la meta en primera posición. "Era una broma."',
    img: "./../fotos/22.png",
  },
  {
    name: "Ana María Martínez Sagi",
    meta: "1907, Barcelona · Ella",
    liga: "",
    desc: "Atleta, poetisa, sindicalista, lesbiana, feminista y periodista. Primera mujer en la junta directiva del FCB. Intentó fundar el equipo femenino y la obligaron a dimitir. Corresponsal de guerra herida en el frente de Aragón.",
    img: "./../fotos/31.jpg",
  },
  {
    name: "Jesse Owens",
    alias: "The Buckeye Bullet · El antílope de ébano",
    meta: "1913, Oakville · Él",
    liga: "",
    desc: "Pulverizó el mito de la supremacía aria en Berlín 1936 con cuatro oros ante Hitler. Apoyó las movilizaciones antirracistas en México 1968, aunque fue criticado por el movimiento Black Power.",
    img: "./../fotos/46.jpg",
  },
  {
    name: "Las Gardenias de Tepito",
    meta: "1960, Tepito, Ciudad de México",
    liga: "",
    desc: "El equipo de fútbol trans/travesti más famoso de México. Cada 4 de octubre juegan contra equipos de hombres con outfits de fantasía, maquilladas, con lentejuelas y medias. Fundado por Doña Bárbara.",
    img: "./../fotos/50.jpg",
  },
  {
    name: "Passion D.I.",
    alias: "Grupo Passió · Aquassión",
    meta: "1977, Madrid",
    liga: "",
    desc: "Club deportivo que introdujo el arte en el deporte, poniendo lo competitivo en segundo plano. Fundado por ex-jugadores del Real Madrid y Estudiantes. Fueron multados por antideportividad.",
    img: "./../fotos/16.jpg",
  },
  {
    name: "John Bonello",
    alias: "Amigo mío",
    meta: "1958, Msida, Malta · Él",
    liga: "",
    desc: 'Portero que encajó 12 goles contra España en 1983. En 2006 protagonizó anuncios de Amstel parodiándose a sí mismo como "el amigo perfecto que hizo felices a muchos españoles."',
    img: "./../fotos/47.webp",
  },
  {
    name: "Florence Griffith",
    alias: "Flo-Jo",
    meta: "1959, Los Ángeles · Ella",
    liga: "",
    desc: "Récords mundiales de 100 y 200m en 1988, aún imbatibles. Uñas larguísimas, trajes de una sola pierna. Recibió una campaña de acoso racista, misógino y transfóbico que ponía en duda su mérito.",
    img: "./../fotos/60.jpeg",
  },
  {
    name: "Petra",
    meta: "1990, Barcelona",
    liga: "",
    desc: "Mascota paralímpica de Barcelona 92, creada por Javier Mariscal. Primera mascota paralímpica con discapacidad física visible. Inspirada en la artista Lorenza Böttner.",
    img: "./../fotos/35.jpg",
  },
  {
    name: "Lorenza Böttner",
    meta: "1959, Punta Arenas, Chile · Ella",
    liga: "",
    desc: "Pintora y performer activista trans, anticapacitista y de la lucha contra el VIH. Perdió ambos brazos a los ocho años. Pintaba con la boca y los pies. Se negó a usar prótesis como acto de resistencia.",
    img: "./../fotos/24.png",
  },
  {
    name: "James Miller",
    alias: "Fun Man",
    meta: "1963, Hagerstown · Él",
    liga: "",
    desc: "Paracaidista que aterrizó en el ring durante un combate por el título mundial. Irrumpió en la NFL, el Arsenal y el Palacio de Buckingham, donde se bajó los pantalones mostrando que estaba pintado de verde.",
    img: "./../fotos/20.png",
  },
  {
    name: "Mark Roberts",
    alias: "The Serial Streaker",
    meta: "1964, Liverpool · Él",
    liga: "",
    desc: "El espontáneo más prolífico de la historia: más de 500 eventos interrumpidos. Wimbledon, Super Bowl, Copa Mundial de Rugby. Se retiró en 2013 alegando que ya era demasiado viejo para correr delante de los guardias.",
    img: "./../fotos/23.png",
  },
  {
    name: "Daniel Plaza",
    meta: "1966, Barcelona · Él",
    liga: "",
    desc: "Oro en marcha atlética en Barcelona 92. Dio positivo en dopaje. Declaró que la nandrolona llegó a su cuerpo al practicar sexo oral con su mujer, que estaba embarazada.",
    img: "./../fotos/39.jpg",
  },
  {
    name: "Eric Moussambani",
    liga: "",
    desc: "Sidney 2000: completó los 100m en 1:52.72, más del doble del tiempo ganador. Aprendió a nadar 8 meses antes en una piscina de hotel de 12 metros.",
    img: "./../fotos/17.avif",
  },
  {
    name: "Zdeněk Koubek",
    meta: "1913",
    liga: "",
    desc: "Atleta de pista checo y trans.",
    img: "./../fotos/51.avif",
  },
  {
    name: "Mark Edward Louis Weston",
    meta: "1905",
    liga: "",
    desc: "Atleta trans.",
    img: "",
  },
  {
    name: "Jana Vašková",
    liga: "",
    desc: "Campeona del concurso de doblar sartenes.",
    img: "",
  },
  {
    name: "Kwon So-a",
    alias: "Soa Kwon",
    liga: "",
    desc: "Ganadora 2024 del concurso de no hacer nada. Locutora y presentadora independiente.",
    img: "",
  },
  {
    name: "Caster Semenya",
    liga: "",
    desc: "Atleta intersex que desde 2009 lucha contra World Athletics para competir sin medicarse. Ha llevado su caso hasta el Tribunal Europeo de Derechos Humanos.",
    img: "./../fotos/59.jpg",
  },
  {
    name: "Imane Khelif",
    liga: "",
    desc: "Boxeadora argelina, oro en París 2024. Recibió una campaña de odio transfóbica siendo mujer cis. Entre los atacantes: Elon Musk y J.K. Rowling.",
    img: "./../fotos/44.jpg",
  },
  {
    name: "Valentía Berr",
    liga: "",
    desc: "Jugadora del Europa que se retiró del fútbol federado denunciando la presión psicológica de la vigilancia constante por ser una mujer trans.",
    img: "",
  },
  {
    name: "Carri Richardson",
    alias: "Mi carril es mi pasarela",
    liga: "",
    desc: "Descalificada de Tokio por dar positivo en marihuana. Acusó a la AMA de trato racista: única descalificada y la única negra entre las que dieron positivo.",
    img: "./../fotos/33.webp",
  },
  {
    name: "Jimmy Jump",
    liga: "",
    desc: 'Uno de los mayores espontáneos del estado, exiliado a Alemania para evitar pagar más de 350.000€. Regresó en 2026. "Yo los saltos me los preparaba como si fuera un examen de Selectividad."',
    img: "./../fotos/65.avif",
  },
  {
    name: "Walking Football Barcelona",
    meta: "2024",
    liga: "",
    desc: "El fútbol que se juega a otro ritmo. Donde no se corre, no se para, solo se disfruta.",
    img: "./../fotos/62.jpg",
  },
  {
    name: "Natalia Mayara",
    liga: "",
    desc: "Hace caballitos con su muñón.",
    img: "",
  },
  {
    name: "Senior Parkour",
    liga: "",
    desc: "",
    img: "./../fotos/40.jpg",
  },
  {
    name: "Nu Passión",
    liga: "",
    desc: "Homenaje al Grupo Passion, creado en 2009 por artistas y personas vinculadas con la cultura. Revisaron las jugadas de 1977, las entrenaron y las modificaron.",
    img: "./../fotos/34.jpg",
  },
  {
    name: "Teresa Almeida",
    liga: "",
    desc: 'Portera angoleña que en el Mundial de 2015 se autodenominó con orgullo "la abanderada de la grasa". Con casi 96 kilos desafió los cánones estéticos del deporte.',
    img: "./../fotos/38.jpg",
  },
  {
    name: "Aaron Tichenor",
    liga: "",
    desc: "",
    img: "./../fotos/53.jpg",
  },
];

// Mapeo de liga a clase CSS
const LIGA_CLASS = {
  queer: "card-liga--queer",
  gorda: "card-liga--gorda",
  crip: "card-liga--crip",
  rarite: "card-liga--rarite",
};

function ligaChips(ligaStr) {
  if (!ligaStr) return "";
  const chips = ligaStr
    .split("·")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const key = l.toLowerCase();
      const cls = LIGA_CLASS[key] || "";
      return `<span class="card-liga ${cls}">${l}</span>`;
    });
  return `<div class="card-ligas">${chips.join("")}</div>`;
}

const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

const grid = document.getElementById("jugadorxs-grid");

JUGADORXS.forEach((j) => {
  const wrap = document.createElement("div");
  wrap.className = "card-wrap";

  const imgSrc = j.img || "./../images/logo_parkuir.png";
  const front = `<div class="card-front"><img class="${j.img ? "" : "contain"}" src="${imgSrc}" alt="${j.name}"></div>`;

  const alias = j.alias ? `<div class="card-alias">${j.alias}</div>` : "";
  const meta = j.meta ? `<div class="card-meta">${j.meta}</div>` : "";
  const ligas = ligaChips(j.liga);
  const desc = j.desc ? `<div class="card-desc">${j.desc}</div>` : "";

  wrap.innerHTML = `
    <div class="card-inner">
      ${front}
      <div class="card-back">
        ${alias}
        <div class="card-name">${j.name}</div>
        ${meta}
        ${ligas}
        ${desc}
      </div>
    </div>`;

  wrap.addEventListener("click", () => {
    if (isTouchDevice()) wrap.classList.toggle("flipped");
  });

  grid.appendChild(wrap);
});
