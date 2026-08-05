const menu ={
    desayuno: {
        platos:['Tostadas', 'sanduches', 'Biscochos'
        ],
        acompanamientos:['Fruta', 'Yogurt', 'Mermelada'
        ],
        bebidas:['Cafe', 'Agua', 'Soda'
        ],

    },

    almuerzo: {
        platos:['Seco de pollo', 'Chuleta', 'Tilapia'
        ],
        acompanamientos:['Chifles', 'Fruta', 'Canguil'
        ],
        bebidas:['Cerveza', 'Agua', 'Soda'
        ],
        
    },

    cena: {
        platos:['Pechuga a la plancha', 'Alitas', 'Hamburguesas'
        ],
        acompanamientos:['Papas salteadas', 'Ensaladas', 'Snacks'
        ],
        bebidas:['Cerveza', 'Agua', 'Soda'
        ],
        
    }


};

function abrirModal() {

    document.getElementById(modalMenu).style.display='block';
    
}

function cerrarModal() {

    document.getElementById(modalMenu).style.display='none';

}

function mostrarOpciones() {

    const tipo = document.getElementById('tipoMenu').value;
    const div = document.getElementById('opcionesMenu');

    div.innerHTML = '';

    if (!tipo) {

        return;

    }

    const opciones = menu[tipo];

    let html = `<h3>Plato principal</h3>`;

    opciones.platos.forEach((plato, posicion) => {

        html += `
            <label>
                <input
                    type="radio"
                    name="plato"
                    value="${plato}"
                    ${posicion === 0 ? 'checked' : ''}
                >
                ${plato}
            </label>
            <br>
        `;

    });


    html += `<h3>Acompañamientos</h3>`;

    opciones.acompanamientos.forEach((acompanamiento) => {

        html += `
            <label>
                <input
                    type="checkbox"
                    name="acompanamiento"
                    value="${acompanamiento}"
                >
                ${acompanamiento}
            </label>
            <br>
        `;

    });


    html += `<h3>Bebidas</h3>`;

    opciones.bebidas.forEach((bebida, posicion) => {

        html += `
            <label>
                <input
                    type="radio"
                    name="bebida"
                    value="${bebida}"
                    ${posicion === 0 ? 'checked' : ''}
                >
                ${bebida}
            </label>
            <br>
        `;

    });


    div.innerHTML = html;

}
