var numNombre = 0;
var numNombreMalla = 0;
var numNombreLuz = 0;
var numNombreCamara = 0;
var numNombreTransform = 0;

//para llamar a los nodos en y que no se repitan

var camaraActiva = null;



function generarNombre() {
	var nombre = "nodo" + numNombre;
	numNombre++;
	return nombre;
}

function generarNombreMalla() {
	var nombreMalla = "nodoMalla" + numNombreMalla;
	numNombreMalla++;
	return nombreMalla;
}

function generarNombreLuz() {
	var nombreLuz = "nodoLuz" + numNombreLuz;
	numNombreLuz++;
	return nombreLuz;
}

function generarNombreCamara() {
	var nombreCamara = "nodoCamara" + numNombreCamara;
	numNombreCamara++;
	return nombreCamara;
}

function generarNombreTransform() {
	var nombreTransform = "nodoTransformacion" + numNombreTransform;
	numNombreTransform++;
	return nombreTransform;
}

// crear malla pasandole la referencia del nodo padre, el fichero con la malla y el fichero con la textura
function crearMalla(father, fichero, textura) {
	// llama a malla que esta en codigo01.js que a su vez llama a TRMALLA de gestor de recursos
	var nodoMalla = new Node(father, new Malla(), generarNombreMalla());
	nodoMalla.entity.cargarTextura(textura);
	nodoMalla.entity.cargarMalla(fichero);
	// comprobamos que el padre no es null, y despues anadimos el nodo dentro del array de hijos del padre
	if (father != null){
		nodoMalla.father.child.push(nodoMalla);
	}
	return nodoMalla;
}

// crea la luz pasandole la referencia al nodo padre y la intensidad
function crearLuz(father, intensidad) {
	// creamos un nuevo nodo y en la entidad creamos una nueva luz
	// despues seteamos su intensidad a la pasada por los parametros de la funcion
	var nodoLuz = new Node(father, new Luz(), generarNombreLuz());
	nodoLuz.entity.intensidad = intensidad;
	// comprobamos que el padre no es null, y despues anadimos el nodo dentro del array de hijos del padre
	if (father != null) {
		nodoLuz.father.child.push(nodoLuz);
	}
	return nodoLuz;

}

// crea una camara pasandole la referencia al nodo padre
function crearCamara(father) {
	// creamos una camara pasandole el padre
	// seteamos la entidad a una nueva camara

	var nodoCamara = new Node(father, new Camara(), generarNombreCamara());

	// comprobamos que el padre no es null, y despues anadimos el nodo dentro del array de hijos del padre
	if (father != null) {
		nodoCamara.father.child.push(nodoCamara);
	}
	return nodoCamara;
}

// crea una transformacion pasandole el nodo padre
function crearTransformacion(father) {
	// crea un nodo y la entidad es una nueva transformacion
	// que se inicializa como la identidad
	var nodoTrans = new Node(father, new Transform(), generarNombreTransform());
	// coprobamos que el padre es distinto de null y le insertamos el nuevo nodo en el array de hijos del father 
	if (father != null) {
		nodoTrans.father.child.push(nodoTrans);
	}
	// hacemos un return del nuevo nodo creado
	return nodoTrans;
}


// elimina el nodo que s epasacomo parametro
function eliminarNodo(Nodo) {

	var fatherAux = Nodo.father;
	var eliminado = false;
	fatherAux.remChild(Nodo);
	delete Nodo;
	Nodo = null;
	return false;
}