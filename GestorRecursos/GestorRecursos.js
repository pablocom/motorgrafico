"use strict";

let FicheroCargado=[];

//CLASE RECURSO DE LA QUE HEDERAN EL RESTO
class TRecurso
{
    constructor(a)
    {
    	this.nombre = a;
    }
    get GetRecursoNombre()
    {
    	return this.nombre;
    }
    SetNombre(a)
    {
    	this.nombre = a;
    }
}

//RECURSO MALLA
class TRecursoMalla extends TRecurso 
{
	constructor(a)
	{
    	super(a);
    	this.normales=[];
    	this.vertices=[]; //Un array con todas las posiciones  
    	this.uvs=[];
    	this.faces=[];
    	this.colors=[];    	
		this.metadata;
		this.fichero;
		this.vertexBufferObject;
		this.normalBufferObject;
		this.indexBufferObject;
		this.TexCoordVertexBufferObject;
    }  

    cargarFichero()
    {	
		let url = "./GestorRecursos/mallas/" + this.nombre;
		var that = this;
		
		loadTextResource(url, function (vsErr, vsText)//LLamada a recoger datos de malla
		{
			if (vsErr)
			{
	            alert('Fatal error getting vertex shader (see console)');
	            console.error(vsErr);
	        }
	        else 
	        {
	        	let ficheroEncontrado=false;
	        	for(let i=0;i<FicheroCargado.length;i++)
	        	{
	        		if(vsText==FicheroCargado[i])
	        		{
	        			ficheroEncontrado=true;
	        		}
	        	}
	        	if(ficheroEncontrado==false)
	        	{
	        		FicheroCargado.push(vsText);
	        		that.actualizarValores(JSON.parse(vsText));
	        	}
		    }
		});
		return this.fichero;
    } 

    actualizarValores(j)
    {
    	this.normales = j.meshes[0].normals;
        this.vertices = j.meshes[0].vertices;
        this.uvs	  = j.uvs;
    	this.faces    = [].concat.apply([], j.meshes[0].faces);
    	this.colors   = j.colors;
    	this.metadata = j.meshes[0].faces.length;
    	this.fichero  = j;
    	this.cargarBuffer();
    }

    cargarBuffer()//Cargar buffers a los objetos
    {
    	this.normalBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normales), gl.STATIC_DRAW);

        this.vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
		this.indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

 		this.TexCoordVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.TexCoordVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.fichero.meshes[0].texturecoords[0]), gl.STATIC_DRAW);
	    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

//RECURSO MATERIAL
class TRecursoMaterial extends TRecurso 
{
	constructor(a)
	{
    	super(a);
 		this.colorSpecular=[0,0,0];
        this.shading="";
        this.doubleSided=false;
        this.depthTest=false;
        this.wireframe=false;
        this.vertexColors=false;
        this.DbgColor=0;
        this.colorEmissive=[0,0,0];
        this.blending=0;
        this.depthWrite=false;
        this.visible=false;
        this.specularCoef=0;
        this.opacity=0;
        this.DbgName="";
        this.DbgIndex=0;
        this.transparent=false;
        this.colorDiffuse=[0,0,0];
    }

    cargarFichero(){
		let url = "./GestorRecursos/materiales/" + this.nombre;
		var that = this;
		let p = new XMLHttpRequest();
			p.open('GET', url + '?please-dont-cache=' + Math.random(), true);
			p.responseType = 'text';

			p.onload = function () {
			    if (p.readyState === p.DONE) {
			        if (p.status === 200) {
			            that.actualizarValores(JSON.parse(p.responseText));			            
			        }
			    }
			};
			p.send(null);
    }

    actualizarValores(j){
		this.colorSpecular	= j.colorSpecular;
		this.shading		= j.shading;
		this.doubleSided	= j.doubleSided;
		this.depthTest		= j.depthTest;
		this.wireframe		= j.wireframe;
		this.vertexColors	= j.vertexColors;
		this.DbgColor		= j.DbgColor;
		this.colorEmissive	= j.colorEmissive;
		this.blending		= j.blending;
		this.depthWrite		= j.depthWrite;
		this.visible		= j.visible;
		this.specularCoef	= j.specularCoef;
		this.opacity		= j.opacity;
		this.DbgName		= j.DbgName;
		this.DbgIndex		= j.DbgIndex;
		this.transparent	= j.transparent;
		this.colorDiffuse	= j.colorDiffuse;
    }
}

//RECURSO TEXTURA
class TRecursoTextura extends TRecurso 
{
    constructor(a)
    {
    	super(a);
    	this.textura = new Image();
    }
    cargarFichero()//Cargar fichero de textura
    {
    	let url = "./GestorRecursos/texturas/" + this.nombre;
    	var that = this;
		loadImage(url, function (imgErr, img)
		{
			if (imgErr)
			{
	            alert('Fatal error getting texture (see console)');
	            console.error(imgErr);
	            return;
	        }
	        else 
	        {
	        	that.actualizarImg();

		    }
		});
		return this.textura;
    }
    actualizarImg()
    {
    	// this.textura.src = './GestorRecursos/texturas/'+this.nombre;
    	this.textura.src = './GestorRecursos/texturas/'+this.nombre;
    }
}



/************************/
//    CLASE PRINCIPAL
/************************/
class TGestorRecursos
{
	constructor () 
	{
		this.arrayRecursos = [];
		this.arrayIndice = [];
	}

	TRMalla(a)
	{
		//se busca en el indice de nombres si existe el recurso
		var p = this.arrayIndice.indexOf(a);
		var malla = this.arrayRecursos[p];

		//si existe se devuelve, si no se crea
		if(malla == null || malla == undefined)
		{
			//se verifica que sea un string y el formato correcto
			if(this.verificarFormato(a,1))
			{

				//Creamos el recurso y hacemos push
				malla = new TRecursoMalla(a);
				malla.cargarFichero();
				this.arrayRecursos.push(malla);
				this.arrayIndice.push(a);													
			}
		}
		return malla;
	}

	TRMaterial(a){
		var p = this.arrayIndice.indexOf(a);
		var material = this.arrayRecursos[p];
		if(material == null || material == undefined){
			if(this.verificarFormato(a,1)){
				material = new TRecursoMaterial(a);
				material.cargarFichero();
				this.arrayRecursos.push(material);
				this.arrayIndice.push(a);												
			}
		}
		return material;		
	}

	TRTextura(a){
		var p = this.arrayIndice.indexOf(a);
		var textura = this.arrayRecursos[p];
		var result;
			if(this.verificarFormato(a,2))
			{
				textura = new TRecursoTextura(a);
				result=textura.cargarFichero();
				this.arrayRecursos.push(textura);
				this.arrayIndice.push(a);											
			}
		return result;
	}

	//comprueba que el nombre sea string y que el formato es el correcto
	verificarFormato(a,i){
		var res = false;    	
    	if(typeof(a) == 'string'){    		
    		var f = a.split('.');
    		if(i==1 && (f[f.length-1]).toLowerCase() == "json"){ res = true; }
    		else if(i==2 && (
    			(f[f.length-1]).toLowerCase() == "jpg" ||
    			(f[f.length-1]).toLowerCase() == "jpeg" ||
    			(f[f.length-1]).toLowerCase() == "png"
    			)){ res = true; }
    		else {
    			console.log("Error: El formato no es correcto (OBJ para objetos 3D, MTL para materiales, JPG para texturas.");
    		}
    	}
    	else{
    		console.log("Error: El nombre pasado no es un String.");
    	}
    	return res;
	}

	//elimina un recurso del arrayRecursos
	eliminarRecurso(a){
		var res = false;
		var p = this.arrayIndice.indexOf(a);
		if(p > -1){
			this.arrayRecursos.splice(p);
			this.arrayIndice.splice(p);
			res = true;
		} 
		return res;
	}

	//Mostrar todos los recursos para probar codigo 
	//TODO: eliminar cuando no se necesite
	recursos(){
		for(var i = 0; i<this.arrayRecursos.length; i++){
			console.log("Recurso " + i + ":");
			console.log(this.arrayRecursos[i]);
		}		
	}
}

var Gestor = new TGestorRecursos();
