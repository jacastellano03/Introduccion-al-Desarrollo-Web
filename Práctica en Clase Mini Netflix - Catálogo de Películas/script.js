const formulario = document.getElementById("formularioPeliculas");

const titulo = document.getElementById("titulo");
const genero = document.getElementById("genero");
const anio = document.getElementById("anio");
const imagen = document.getElementById("imagen");

const catalogo = document.getElementById("catalogo");
const mensaje = document.getElementById("mensaje");


let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];


function mostrarPeliculas() {

    catalogo.innerHTML = "";


    peliculas.forEach(function (pelicula, posicion) {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("tarjeta");


        if (pelicula.favorita === true) {

            tarjeta.classList.add("tarjeta-favorita");

        }


        const poster = document.createElement("img");

        poster.src = pelicula.imagen;
        poster.alt = "Póster de " + pelicula.titulo;


        const nombrePelicula = document.createElement("h3");

        nombrePelicula.classList.add("titulo-pelicula");
        nombrePelicula.textContent = pelicula.titulo;


        if (pelicula.favorita === true) {

            nombrePelicula.textContent =
                nombrePelicula.textContent + " ";

        }


        const textoGenero = document.createElement("p");

        textoGenero.textContent = "Género: " + pelicula.genero;


        const textoAnio = document.createElement("p");

        textoAnio.textContent = "Año: " + pelicula.anio;


        const botonFavorito = document.createElement("button");

        botonFavorito.classList.add("favorito");
        botonFavorito.textContent = " Favorito";


        const botonEliminar = document.createElement("button");

        botonEliminar.classList.add("eliminar");
        botonEliminar.textContent = "❌ Eliminar";


        botonFavorito.addEventListener("click", function () {

            peliculas[posicion].favorita =
                !peliculas[posicion].favorita;

            guardarPeliculas();

            mostrarPeliculas();

        });


        botonEliminar.addEventListener("click", function () {

            peliculas.splice(posicion, 1);

            guardarPeliculas();

            mostrarPeliculas();

        });


        tarjeta.appendChild(poster);
        tarjeta.appendChild(nombrePelicula);
        tarjeta.appendChild(textoGenero);
        tarjeta.appendChild(textoAnio);
        tarjeta.appendChild(botonFavorito);
        tarjeta.appendChild(botonEliminar);


        catalogo.appendChild(tarjeta);

    });

}


function guardarPeliculas() {

    localStorage.setItem(
        "peliculas",
        JSON.stringify(peliculas)
    );

}


formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();


    const anioActual = new Date().getFullYear();


    if (
        titulo.value === "" ||
        genero.value === "" ||
        anio.value === "" ||
        imagen.value === ""
    ) {

        mensaje.textContent =
            "Todos los campos son obligatorios.";

        return;

    }


    if (anio.value < 1900 || anio.value > anioActual) {

        mensaje.textContent =
            "El año debe estar entre 1900 y " + anioActual + ".";

        return;

    }


    const nuevaPelicula = {

        titulo: titulo.value,
        genero: genero.value,
        anio: anio.value,
        imagen: imagen.value,
        favorita: false

    };


    peliculas.push(nuevaPelicula);


    guardarPeliculas();

    mostrarPeliculas();

});


mostrarPeliculas();
