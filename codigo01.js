//Libreria de glMatrix
//import * as glMatrix from "./toji-gl-matrix-7fc31d5/src/gl-matrix/mat4";

var rootCreated = false;
var treeRoot= new Node("null",testEntity,"raiz");
var pila = new Pila();
var model = mat4.create();

var worldMatrix = new Float32Array(16);
var viewMatrix = new Float32Array(16);
var projMatrix = new Float32Array(16);

var matWorldUniformLocation;
var matViewUniformLocation;
var matProjUniformLocation;
var matLightUniformLocation;
var matCameraUniformLocaton;

var positionAttribLocation;
var texCoordAttribLocation;
var normalAttribLocation;
var Texture;
var caras;

function Pila() //La pila para el arbol
{

    var elements = [];
 
    this.add = add;
    this.pop = pop;
    this.getTopElement = getTopElement;
    this.hasElements = hasElements;
    this.removeAll = removeAll;
    this.size = size;
 
    function add(element) {
        elements.push(element);
    }
 
    function pop() {
        return elements.pop();
    }
 
    function getTopElement() {
        return elements[elements.length - 1];
    }
 
    function hasElements() {
        return elements.length > 0;
    }
 
    function removeAll() {
        elements = [];
    }
 
    function size() {
        return elements.length;
    }
}

/*********************************
Gestor de  recurso
*********************************/
var Gestor = new TGestorRecursos();

/*********************************
Gestor de  recurso
*********************************/

//Hay que pasar el objeto nodo
Array.prototype.indexOf = function (val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

function Entity()//Clase interfaz
{
    //Metodo virtual
    this.beginDraw  = function()
    {

    }
    //Metodo virtual
    this.endDraw    = function()
    {

    }

}

function Luz()
{
    //Herencia
    Entity.call(this);
    this.intensidad;

    this.beginDraw  = function()
    {
        //Codigo aprendido desde https://www.youtube.com/watch?v=kB0ZVUrI4Aw&t=480s
        var ambientUniformLocation = gl.getUniformLocation(programHandle, 'ambientLightIntensity');
        var sunlightDirUniformLocation = gl.getUniformLocation(programHandle, 'sun.direction');
        var sunlightIntUniformLocation = gl.getUniformLocation(programHandle, 'sun.color');

        let LuzPosition=[model[12],model[13],model[14]];

        gl.uniform3f(ambientUniformLocation, 0.2, 0.2, 0.2);
        gl.uniform3f(sunlightDirUniformLocation, LuzPosition[0], LuzPosition[1], LuzPosition[2]);
        gl.uniform3f(sunlightIntUniformLocation, this.intensidad, this.intensidad, this.intensidad);
    }

    this.endDraw    = function()
    {

    }

    this.changeIntensity = function(inten)
    {
        this.intensidad=inten;
    }

}
function Camara()
{
    //Herencia
    Entity.call(this);
    let esPerspectiva=true;
    let cercano=0.1;
    let lejano=1000.0;

    this.beginDraw  = function()
    {
        var projMatrix = new Float32Array(16);
        let canvas = document.getElementById('glcanvas');
        if(esPerspectiva) //Si es perspectiva, creamos la matriz perspectiva
        {
            mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, cercano, lejano);
        }
        else //Creamos la matriz paralera
        {
            mat4.ortho(projMatrix, 0, canvas.width, 0, canvas.height, cercano, lejano);
        }

        matWorldUniformLocation = gl.getUniformLocation(programHandle, 'mWorld');
        matViewUniformLocation = gl.getUniformLocation(programHandle, 'mView');
        matProjUniformLocation = gl.getUniformLocation(programHandle, 'mProj');
        matCameraUniformLocaton = gl.getUniformLocation(programHandle,'mCameraLocation');


        mat4.identity(worldMatrix);
        
        let cameraPosition=[model[12],model[13],model[14],1];
        let focusPosition=[2, 2, 2];
        
        for(let i=0;i<16;i++)
        {
            viewMatrix[i]=model[i];
        }
        
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
        gl.uniform4fv(matCameraUniformLocaton, cameraPosition);

    }

    this.endDraw    = function()
    {

    }
}

var facesAux;
function Malla()
{
    //Herencia
    Entity.call(this);

    let malla=undefined;
    let textura=undefined;

    this.cargarMalla = function(fichero)
    {
        this.malla = Gestor.TRMalla(fichero);
    }
    this.cargarTextura = function(fichero)
    {
        this.textura = Gestor.TRTextura(fichero);
    }
    this.beginDraw  = function()
    {
        // dibujar
        gl.enable(gl.DEPTH_TEST);
        //Codigo aprendido desde https://www.youtube.com/watch?v=kB0ZVUrI4Aw&t=480s
        //Vincular vertice buffer a webgl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.malla.vertexBufferObject);
        positionAttribLocation = gl.getAttribLocation(programHandle, 'vertPosition');
        gl.vertexAttribPointer
        (
            positionAttribLocation, // Posicion de attribute 
            3, // Cantidad de elementos por atributo
            gl.FLOAT, // Tipo of elementos
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Tamaño de un vértice individual
            0 //Desplazamiento desde el comienzo de un solo vértice a este atributo
        );
        gl.enableVertexAttribArray(positionAttribLocation);
        //Vincular mapa de coordenada buffer a webgl
        gl.bindBuffer(gl.ARRAY_BUFFER, this.malla.TexCoordVertexBufferObject);
        texCoordAttribLocation = gl.getAttribLocation(programHandle, 'vertTexCoord');
        gl.vertexAttribPointer
        (
            texCoordAttribLocation, 
            2, 
            gl.FLOAT, 
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(texCoordAttribLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.malla.normalBufferObject);
        normalAttribLocation = gl.getAttribLocation(programHandle, 'vertNormal');
        gl.vertexAttribPointer(
            normalAttribLocation,
            3, gl.FLOAT,
            gl.TRUE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(normalAttribLocation);

        Texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, Texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D
        (
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.textura
        );
        gl.bindTexture(gl.TEXTURE_2D, null);

        // Indique a la máquina de estado webGL que programa debe estar activo.
        gl.useProgram(programHandle);

        caras=this.malla.faces.length;//Sacar cantidad de caras
        
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, model);

        gl.bindTexture(gl.TEXTURE_2D, Texture);
        gl.activeTexture(gl.TEXTURE0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.malla.indexBufferObject);

        gl.drawElements(gl.TRIANGLES, caras, gl.UNSIGNED_SHORT, 0);

    }

    this.endDraw  = function()
    {

    }

}

function Transform()
{
    //Herencia
    Entity.call(this);
    this.matriz = mat4.create();

    this.identidad = function()
    {
        return mat4.identity;
    }

    //Cambiar el valor de matriz
    this.cargar = function (array)
    {
        this.matriz=mat4.set(this.matriz,
                    array[0],
                    array[1],
                    array[2],
                    array[3],
                    array[4],
                    array[5],
                    array[6],
                    array[7],
                    array[8],
                    array[9],
                    array[10],
                    array[11],
                    array[12],
                    array[13],
                    array[14],
                    array[15]
                  );
    }

    this.traslate = function(vector)
    {
        this.matriz = mat4.scalar.translate(this.matriz,this.matriz,vector);
    }

    this.scalar = function(vector)
    {
        this.matriz = mat4.scalar.scale(this.matriz,this.matriz,vector);
    }

    this.rotationX = function(angulo)
    {
        let rad=angulo*Math.PI/180;
        this.matriz = mat4.scalar.rotateX(this.matriz,this.matriz,rad);
    }

    this.rotationY = function(angulo)
    {
        let rad=angulo*Math.PI/180;
        this.matriz = mat4.scalar.rotateY(this.matriz,this.matriz,rad);
    }

    this.rotationZ = function(angulo)
    {
        let rad=angulo*Math.PI/180;
        this.matriz = mat4.scalar.rotateZ(this.matriz,this.matriz,rad);
    }


    this.beginDraw = function()// apila el model actual
    {
        // crear una nueva para que no apunten a la misma zona de memoria
        var aux = new mat4.create();
        for(var i = 0; i<model.length; i++){
            aux[i]=model[i]
        }
        pila.add(aux);
        model = mat4.multiply(model, model, this.matriz);
        
    }

    this.endDraw   = function()// desapilla el ultimo metido en la pila
    {
        model=pila.pop();
    }
}

var testEntity = new Transform();

function Node( father , entity , name ) 
{
    this.father = father;
    this.name   = name;
    this.entity = entity;
    this.child  = [];
    

    this.addChild = function( hijo )
    {
        this.child.push(hijo);
    }

    this.remChild = function( hijo )
    {
        this.child.remove(hijo);
    }

    this.setEntity = function( entidad )
    {
        this.child.entity = entidad;
    }
    
/*********************************************
Metodo draw   
*********************************************/
    this.draw = function()
    {
        if(this.name!="raiz"){
            this.entity.beginDraw();
        }
        // else console.log("Estado de model en Raiz:", model);
        for(let i=0;i<this.child.length;i++)
        {
            // console.log("Estado de la pila:", pila);
            this.child[i].draw();
        }
        if(this.name!="raiz"){

            this.entity.endDraw(); 
        }
    }

}


function eliminarChild(name)
{
    let arbol = mostrarArbol(treeRoot);
    let nodo;
    nodo=encontrarNodo(treeRoot,name);

    eliminarTodosHijosNodo(nodo);
}

function encontrarNodo(raiz,name)
{
    for(let i=0;i<raiz.child.length;i++)
    {
        if(raiz.child[i].name==name)
        {
            return raiz.child[i];
        }
        else
        {
            raiz=encontrarNodo(nodo.child[i],arbol);
        }
        
    }
    return raiz;
}

function eliminarTodosHijosNodo(nodo){

    // console.log("Entrando a eliminar hijos, este es el NODO:" + nodo.name );

    if(nodo.child.length != 0){

        for(let i = 0; i<nodo.child.length; i++){

            eliminarTodosHijosNodo(nodo.child[i]);  
        }
    }
    //console.log("Entrar555 "+nodo.name);
    //para el padre del nodo tenemos que eliminarlo del array

    nodo.father.remChild(nodo);

    nodo=undefined;

    if(nodo!=null){
        console.log("El nodo " + nodo.name + " es muy jugueton y no se quiere eliminar");
    }
    return false;
}

function createNode(name,father)
{
    if(rootCreated)
    {
        //Sacamos todos los nodos
        let arbol = mostrarArbol(treeRoot);

        //Buscar si ya tiene un nodo con ese nombre
        let nombreExiste = false;
        for(let i=0;i<arbol.length;i++)
        {
            if(arbol[i].name==name)
                nombreExiste = true;
        }
        //Si el nombre no existe, añadimos el nodo
        if(!nombreExiste)
        {
            //Buscar padre
            let nodefather;
            for(let i=0;i<arbol.length;i++)
            {
                if(arbol[i].name==father)
                    nodefather=arbol[i];
            }

            //Crear nodo
            let node = new Node(nodefather,testEntity,name);
            
            //Añadir el nuevo hijo a padre
            nodefather.addChild(node);

            console.log('El nodo '+ name +' ha creado con existo');
        }
        else //Si el nombre existe ya, devolvemos un mensaje diciendo que el nombre ya existe
        {
            console.log('El nombre ya existe, introduce otro nombre');
        }
    }
    else
    {
        console.log("Please create root first.")
    }
}

function mostrarArbol(nodo)
{
    let arbol = [nodo];
    return mostrarArbolRecursivo(nodo,arbol);

}

function mostrarArbolRecursivo(nodo,arbol)
{
    for(let i=0;i<nodo.child.length;i++)
    {
        arbol.push(nodo.child[i]);
        arbol=mostrarArbolRecursivo(nodo.child[i],arbol);
    }
    return arbol;
}



function fatherChange(name,child) 
{
    let arbol = mostrarArbol(treeRoot);
    let fatherNode;

    for(let i=0;i<arbol.length;i++)
    {
        if(arbol[i].name==name)
            fatherNode=arbol[i];
    }
    child.father=fatherNode;
}


function consultFather(name)
{
    if(rootCreated)
    {
        let encontrado  = false;

        let arbol = mostrarArbol(treeRoot);

        for(let i=0;i<arbol.length && encontrado==false ;i++)
        {
            if(arbol[i].name==name)
            {
                let html='';
                if(arbol[i].father==null)
                {
                    console.log('El nodo ' + name + ' es la raiz, por lo tanto, no tiene padre');
                }
                else
                {
                    console.log('El padre del nodo ' + name + ' es '+ arbol[i].father.name);
                }
                encontrado = true;
            }
        }
        if(encontrado == false)
        {
            console.log('No ha encontrado el nodo');
        }
    }
    else
    {
        console.log("Please create root first.")
    }
}

function setNombre(name)
{
    let encontrado  = false;

    //Sacamos todos los nodos
    let arbol = mostrarArbol(treeRoot);

    //Buscar si ya tiene un nodo con ese nombre
    let nombreExiste = false;
    for(let i=0;i<arbol.length;i++)
    {
        if(arbol[i].name==name)
            nombreExiste = true;
    }
    //Si el nombre no existe, añadimos el nodo
    if(!nombreExiste)
    {
        for(let i=0;i<arbol.length && encontrado==false;i++)
        {
            if(arbol[i].name==name)
            {
                arbol[i].name=valor;
                encontrado=true;
            }
        }
        if(encontrado==true)
        {
                console.log('Ha modificado correctamente, ahora la entidad del nodo es: '+valor);
        }
    }
    else
    {
            console.log('El nombre existe ya, introduce otro nombre por favor');
    }


}





