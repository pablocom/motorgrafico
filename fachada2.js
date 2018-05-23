var numNombre = 0;
var numNombreMalla = 0; 
var numNombreLuz = 0;
var numNombreCamara = 0;
var numNombreTransform = 0;

var camaraActiva=null;



function generarNombre(){
	var nombre = "nodo" + numNombre;
	numNombre++;
	return nombre;
}

function generarNombreMalla(){
	var nombreMalla = "nodoMalla" + numNombreMalla;
	numNombreMalla++;
	return nombreMalla;
}

function generarNombreLuz(){
	var nombreLuz = "nodoLuz" + numNombreLuz;
	numNombreLuz++;
	return nombreLuz;
}

function generarNombreCamara(){
	var nombreCamara = "nodoCamara" + numNombreCamara;
	numNombreCamara++;
	return nombreCamara;
}

function generarNombreTransform(){
	var nombreTransform = "nodoTransformacion" + numNombreTransform;
	numNombreTransform++;
	return nombreTransform;
}

function crearMalla(father, fichero,textura)
{
	var nodoMalla = new Node( father , new Malla() , generarNombreMalla());
	nodoMalla.entity.cargarTextura(textura);
	nodoMalla.entity.cargarMalla(fichero);

	if(father != null)
	{
		nodoMalla.father.child.push(nodoMalla);
	}
	return nodoMalla;
}

function crearLuz(father, intensidad){
	var nodoLuz = new Node(father, new Luz(), generarNombreLuz());
	nodoLuz.entity.intensidad = intensidad;
	if(father != null){
		nodoLuz.father.child.push(nodoLuz);
	}
	return nodoLuz;

}

function crearCamara(father){
	var nodoCamara = new Node(father, new Camara(), generarNombreCamara());
	if(father != null){
		nodoCamara.father.child.push(nodoCamara);
	}
	return nodoCamara;
}

function crearTransformacion(father){
	var nodoTrans = new Node(father, new Transform(), generarNombreTransform());
	if(father != null){
		nodoTrans.father.child.push(nodoTrans);
	}
	return nodoTrans;
}

function eliminarNodo(Nodo){

	var fatherAux = Nodo.father;
	var eliminado = false;
	fatherAux.remChild(Nodo);
	delete Nodo;
	Nodo = null;
	return false;
}



