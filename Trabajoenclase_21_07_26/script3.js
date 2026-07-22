function promedio(){
    let nota1= parseFloat (document.getElementById('nota1').value);
    let nota2= parseFloat (document.getElementById('nota2').value);
    let nota3= parseFloat (document.getElementById('nota3').value);

    if (isNaN(nota1)||isNaN (nota2)|| isNaN(nota3)){
        alert('Ingrese todos los datos: ');
        return;
    }

}