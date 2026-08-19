const menu = {

    desayuno: {

        platos: [
            'Tostadas',
            'Sanduches',
            'Bizcochos'
        ],

        acompanamientos: [
            'Fruta',
            'Yogurt',
            'Mermelada'
        ],

        bebidas: [
            'Café',
            'Agua',
            'Soda'
        ]

    },


    almuerzo: {

        platos: [
            'Seco de pollo',
            'Chuleta',
            'Tilapia'
        ],

        acompanamientos: [
            'Chifles',
            'Fruta',
            'Canguil'
        ],

        bebidas: [
            'Cerveza',
            'Agua',
            'Soda'
        ]

    },


    cena: {

        platos: [
            'Pechuga a la plancha',
            'Alitas',
            'Hamburguesas'
        ],

        acompanamientos: [
            'Papas salteadas',
            'Ensaladas',
            'Snacks'
        ],

        bebidas: [
            'Cerveza',
            'Agua',
            'Soda'
        ]

    }

};



const slides = document.querySelectorAll('.slide');

let indice = 0;


function mostrarSlide(posicion) {

    for (let i = 0; i < slides.length; i++) {

        slides[i].classList.remove('active');

    }

    slides[posicion].classList.add('active');

}


document.querySelector('.next').addEventListener('click', function() {

    indice++;

    if (indice >= slides.length) {

        indice = 0;

    }

    mostrarSlide(indice);

});


document.querySelector('.prev').addEventListener('click', function() {

    indice--;

    if (indice < 0) {

        indice = slides.length - 1;

    }

    mostrarSlide(indice);

});


mostrarSlide(indice);



function abrirModal() {

    document.getElementById('modalMenu').style.display = 'block';

}



function cerrarModal() {

    document.getElementById('modalMenu').style.display = 'none';

}



function mostrarOpciones() {

    const tipo = document.getElementById('tipoMenu').value;

    const div = document.getElementById('opcionesMenu');

    div.innerHTML = '';


    if (tipo == '') {

        return;

    }


    const opciones = menu[tipo];

    let html = '<h3>Plato principal</h3>';


    for (let i = 0; i < opciones.platos.length; i++) {

        html += '<label>';

        html += '<input type="radio" name="plato" value="' + opciones.platos[i] + '">';

        html += opciones.platos[i];

        html += '</label>';

        html += '<br>';

    }


    html += '<h3>Acompañamientos</h3>';


    for (let i = 0; i < opciones.acompanamientos.length; i++) {

        html += '<label>';

        html += '<input type="checkbox" name="acompanamiento" value="' + opciones.acompanamientos[i] + '">';

        html += opciones.acompanamientos[i];

        html += '</label>';

        html += '<br>';

    }


    html += '<h3>Bebidas</h3>';


    for (let i = 0; i < opciones.bebidas.length; i++) {

        html += '<label>';

        html += '<input type="radio" name="bebida" value="' + opciones.bebidas[i] + '">';

        html += opciones.bebidas[i];

        html += '</label>';

        html += '<br>';

    }


    div.innerHTML = html;

}



function confirmarPedido() {

    const plato = document.querySelector('input[name="plato"]:checked');

    const bebida = document.querySelector('input[name="bebida"]:checked');

    const acompanamientos = document.querySelectorAll('input[name="acompanamiento"]:checked');

    const resumen = document.getElementById('resumenPedido');


    if (plato == null || bebida == null) {

        resumen.innerHTML = '<p>Seleccione un plato y una bebida.</p>';

        return;

    }


    let textoAcompanamientos = '';


    for (let i = 0; i < acompanamientos.length; i++) {

        textoAcompanamientos += acompanamientos[i].value;


        if (i < acompanamientos.length - 1) {

            textoAcompanamientos += ', ';

        }

    }


    if (textoAcompanamientos == '') {

        textoAcompanamientos = 'Ninguno';

    }


    resumen.innerHTML =
        '<h3>Resumen del pedido</h3>' +
        '<p>Plato: ' + plato.value + '</p>' +
        '<p>Acompañamientos: ' + textoAcompanamientos + '</p>' +
        '<p>Bebida: ' + bebida.value + '</p>';

}