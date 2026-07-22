function calcularEdad(){
    let nombre = (document.getElementById('nombre').value);
    let anio=parseInt(document.getElementById('anio').value);
    
    let actual= new Date().getFullYear();
    if(nombre==''){
        alert('Ingrese un nombre: ');
        return;
    }
    else if(anio < 1900 || anio > actual){
        alert('Ingrese un año valido: ');
        return;
    }

    let edad = actual - anio;

    document.getElementById('resultado').innerHTML ='Hola ' + nombre +', tienes ' + edad + ' años';

}