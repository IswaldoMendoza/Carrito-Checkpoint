const obtenerJuegos = async () => {
  const data = await fetch("/data/games.json");
  const games = await data.json();
  return games;
};

const listaContainer = document.getElementById("lista-juegos");
const divContainer = document.createElement("div");
divContainer.className = "newGames";

const platforms = ["PC", "PSX", "XBOX", "GAME CUBE", "NINTENDO SWITCH", "PS3", "PS2", "PS4", "PS5", "XBOX 360"];

const mostrarJuegos = (juegos) => {
  const elements = juegos
    .map(
      (game) => `
  <div class="newCard">
      <img src="${game.imagen}"
          class="imagen-juego u-full-width">
      <div class="info-card">
          <h4>${game.nombre}</h4>
          <p>${platforms[Math.floor(Math.random() * platforms.length)]}</p>
          <img id="detalles" src="img/estrellas.png">
          <p class="precio">$${
            game.precio
          } <span class="u-pull-right ">$${Math.round(
        game.precio * 0.9
      )}</span></p>
          <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${
            game.id
          }">Agregar
              Al Carrito</a>
      </div>
  </div>
  `
    )
    .join("");

  divContainer.innerHTML = elements;
  listaContainer.appendChild(divContainer);
};

window.addEventListener("load", async () => {
  const games = await obtenerJuegos();
  mostrarJuegos(games);
});

const input = document.getElementById("buscador");

input.addEventListener("beforeinput", async (e) => {
  console.log(e.target.value);

  const data = await fetch("/data/games.json");
  const games = await data.json();

  const juegosEncontrados = games.filter((game) =>
    game.nombre.toLowerCase().includes(e.target.value.toLowerCase())
  );

  mostrarJuegos(juegosEncontrados);
});

//                >>>>>>>>>>>>>>>>>>>>>>>>> CONSTANTES Y VARIABLES <<<<<<<<<<<<<<<<<<<<<<<<<
const carro = document.querySelector(`#carrito`);

const contenedorDelCarrito = document.querySelector(`#lista-carrito tbody`);
const vaciarCarritoBtn = document.querySelector(`#vaciar-carrito`);
const listaJuegos = document.querySelector(`#lista-juegos`);
let estanteria = [];

// Eliminar juegos del carrito
carro.addEventListener("click", eliminarJuego);

// Vacia el carrito
vaciarCarritoBtn.addEventListener("click", () => {
  estanteria = [];
  limpiarHTML();
});

//                >>>>>>>>>>>>>>>>>>>>>>>>> FUNCIONES <<<<<<<<<<<<<<<<<<<<<<<<<

cargarEventListeners();
function cargarEventListeners() {
  //agregar juego presionando "agregar al carrito"
  listaJuegos.addEventListener("click", agregarJuego);
}

function agregarJuego(e) {
  e.preventDefault();

  if (e.target.classList.contains("agregar-carrito")) {
    const juegoSeleccionado = e.target.parentElement.parentElement;
    leerDatosJuego(juegoSeleccionado);
  }
}

// Para eliminar un juego del carrito
function eliminarJuego(e) {
  if (e.target.classList.contains("borrar-juego")) {
    const juegoId = e.target.getAttribute("data-id");

    // Elimina del array de estanteria por el data-id
    estanteria = estanteria.filter((juego) => juego.id !== juegoId);

    estanteriaHTML();
  }
}

//Para leer los datos
function leerDatosJuego(juego) {
  // con esto se crea el objeto nuevo
  const infoJuego = {
    imagen: juego.querySelector("img").src,
    nombre: juego.querySelector("h4").textContent,
    precio: juego.querySelector("span").textContent,
    id: juego.querySelector("a").getAttribute(`data-id`),
    cantidad: 1,
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Libreria <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  Swal.fire({
    title: "Producto Añadido!",
    text: "Ve tus compras en el carrito",
    icon: "success",
    confirmButtonText: "Aceptar",
  });

  // Esto revisa la existencia del juego en el carrito
  const yaExiste = estanteria.some((juego) => juego.id === infoJuego.id);
  if (yaExiste) {
    const juegos = estanteria.map((juego) => {
      if (juego.id === infoJuego.id) {
        juego.cantidad++;
        return juego;
      } else {
        return juego;
      }
    });
    estanteria = [...juegos];
  } else {
    estanteria = [...estanteria, infoJuego];
  }

  console.log(estanteria);

  estanteriaHTML();
}

//Aqui se muestra el HTML que se va a inyectar al carrito

function estanteriaHTML() {
  //Limpiar el HTMl
  limpiarHTML();

  //Recorrer el HTML
  estanteria.forEach((juego) => {
    const { imagen, nombre, precio, cantidad, id } = juego;
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>
    <img src="${imagen}" width="150">
    </td>
    <td>
    ${nombre}
    </td>
    <td>
    ${precio}
    </td>
    <td>
    ${cantidad}
    </td>
    <td>
      <a href"#" class="borrar-juego" data-id="${id}"> X </a>
      </td>
      `;

    // agrega el HTML del carrito en el tbody
    contenedorDelCarrito.appendChild(row);
  });
}

// Eliminar los cursos del tbdoy
function limpiarHTML() {
  while (contenedorDelCarrito.firstChild) {
    contenedorDelCarrito.removeChild(contenedorDelCarrito.firstChild);
  }
}
