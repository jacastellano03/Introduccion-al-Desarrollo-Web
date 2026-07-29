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

    const tipo=document.getElementById('tipoMenu').value;
    const div=document.getElementById('opcionesMenu');
    div.innerHTML='';
    
}