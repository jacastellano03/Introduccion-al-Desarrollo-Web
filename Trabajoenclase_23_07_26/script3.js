function promedio(){
    let nota1= parseFloat (document.getElementById('nota1').value);
    let nota2= parseFloat (document.getElementById('nota2').value);
    let nota3= parseFloat (document.getElementById('nota3').value);

    if (isNaN(nota1)||isNaN (nota2)|| isNaN(nota3)){
        alert('Ingrese todos los datos: ');
        return;
    }

    if (nota1 & nota2 > 50){
        alert('La nota esta fuera de rango.');
        return;

    }

    if (nota1 & nota2 == 0){
        alert('La nota no puede ser 0.');
        return;
    
    }

    let promedio = (nota1 + nota2 + nota3)/3;
    let resultado = document.getElementById('promedio');

    if (promedio > 30){
        alert('Aprobado.');
        resultado.innerHTML = 'Promedio: ' + promedio.toFixed(2);
        resultado.className = 'Aprobado';
        return;
    
    }


    if (promedio < 30){
        alert('Reprobado.');
        resultado.innerHTML = 'Promedio: ' + promedio.toFixed(2);
        resultado.className = 'Reprobado';
        return;
    
    }
    

}

