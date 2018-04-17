
var gl; // contexto programa
var vsHandle, fsHandle, programHandle;
var camaraActiva = null;
var luzActiva = null;

var pMatrix = mat4.create(); // The projection matrix
var nMatrix = mat4.create(); // The normal matrix

var InitDemo = function () 
{
    
    loadTextResource('./shader.vs.glsl', function (vsErr, vsText) {
        if (vsErr) {
            alert('Fatal error getting vertex shader (see console)');
            console.error(vsErr);
        } else {

            loadTextResource('./shader.fs.glsl', function (fsErr, fsText) {
                if (fsErr) {
                    alert('Fatal error getting fragment shader (see console)');
                    console.error(fsErr);
                } else {
                    // loadJSONResource('./Susan.json', function (modelErr, modelObj) {
                    //     if (modelErr) {
                    //         alert('Fatal error getting Susan model (see console)');
                    //         console.error(fsErr);
                    //     } else {
                    //         loadImage('./SusanTexture.png', function (imgErr, img) {
                    //             if (imgErr) {
                    //                 alert('Fatal error getting Susan texture (see console)');
                    //                 console.error(imgErr);
                    //             } else { 
                    //                 // RunDemo(vsText, fsText, img, modelObj);
                    //                 startWebGL();
                    //             }
                    //         });
                    //     }
                    // });
                    startWebGL(vsText, fsText);
                }
            });
        }
    });
};


function startWebGL(vsText, fsText)
{ //main al que se llama al iniciar el programa

    var canvas = document.getElementById("glcanvas");
    gl = initWebGL(canvas);

    //Setear shaders

    if(gl)
    { //Solo continuar en el caso de que el navegador pueda correr webGL
        setShaders(vsText, fsText);
        crearArbolEjemplo();
        var positionAttribLocation = gl.getAttribLocation(programHandle, 'vertPosition');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(positionAttribLocation);

        var normalAttribLocation = gl.getAttribLocation(programHandle, 'vertNormal');
        gl.vertexAttribPointer(
            normalAttribLocation,
            3, gl.FLOAT,
            gl.TRUE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        gl.enableVertexAttribArray(normalAttribLocation);
        gl.useProgram(programHandle);

        // gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
        // var texCoordAttribLocation = gl.getAttribLocation(programHandle, 'vertTexCoord');
        // gl.vertexAttribPointer(
        //     texCoordAttribLocation, // Attribute location
        //     2, // Number of elements per attribute
        //     gl.FLOAT, // Type of elements
        //     gl.FALSE,
        //     2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        //     0
        // );
        //LINKAR VARIABLES DE LOS SHADERS
        //VERTEX SHADER
        // programHandle.aVertexPosition     = gl.getAttribLocation(programHandle, "aVertexPosition"); //devuelve el indice de la variable definida en el v-shader
        // programHandle.aVertexNormal       = gl.getAttribLocation(programHandle, "aVertexNormal");
        // programHandle.uMVMatrix           = gl.getUniformLocation(programHandle, "uMVMatrix"); // as
        // programHandle.uPMatrix            = gl.getUniformLocation(programHandle, "uPMatrix"); //
        // programHandle.uNMatrix            = gl.getUniformLocation(programHandle,"uNMatrix");
        // programHandle.uLightPosition      = gl.getUniformLocation(programHandle,"uLightPosition");
        
        // // FRAGMENT SHADER
        // programHandle.uLightAmbient       = gl.getUniformLocation(programHandle,"uLightAmbient");
        // programHandle.uMaterialSpecular   = gl.getUniformLocation(programHandle,"uMaterialSpecular");
        // programHandle.uMaterialDiffuse    = gl.getUniformLocation(programHandle,"uMaterialDiffuse");
        // programHandle.uShininess          = gl.getUniformLocation(programHandle,"uShininess");

        // Iniciar el valor de las luces en la escena
        // initLights();
        
        
        

    }
    
}


function initWebGL(canvas)
{ //tomar contexto webgl en el canvas. 
    gl = null;
    try 
    {
    // Tratar de tomar el contexto estandar. Si falla, retornar al experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        // gl.clearColor(0.75, 0.85, 0.8, 1.0);
        // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }
    catch(e) 
    {}

    // Si no tenemos ningun contexto GL, date por vencido ahora
    if (!gl) {
        alert("Imposible inicializar WebGL. Tu navegador puede no soportarlo.");
        gl = null;
    }
    return gl;
}
 


// PREGUNTAR RAFA: a esta funcion esta bien que se llame desde el metodo draw de Malla??

function cargarModelo(malla){ // funcion a la que se le pasa la malla ya con las TRANSFORMACIONES APLICADAS.(vertices, faces, normals)
    // IMPORTANTE! en nuestros json el array de indices se llama 'faces':
    // creamos un conjunto de buffer por cada objeto que vamos a renderizar en la escena
    // vertexBufferObject -> contendra toda la informacion de los vertices del objeto a renderizar

    var vertexBufferObject = gl.createBuffer(); // creamos el buffer de vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject); // liga el buffer al programa, cualq operacion de buffer se hara sobre este
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(malla.vertices), gl.STATIC_DRAW); // aqui pasamos su valor al programa

    var normalBufferObject = gl.createBuffer(); // lo mismo para las normales
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject); //lo asociamos
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(malla.normales), gl.STATIC_DRAW); //almacenamos los datos
    // utils nos permite calcular las normales de la malla para poder hacer la luz especular

    var indexBufferObject = gl.createBuffer(); //lo mismo para los indices(que le dicen a webgl como tiene que unir los vertices)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject); // lo asociamos
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(malla.faces), gl.STATIC_DRAW);

    // los anadimos al conjunto de buffers que luego vamos a dibujar
    vbo.push(vertexBufferObject);
    ibo.push(indexBufferObject);
    nbo.push(normalBufferObject);

    // le asociamos nulo para liberar memoria?
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    part.push(malla);
}

// por ultimo una funcion que permita dibujar la escena
function dibujarEscena(){

    gl.clearColor(0.1,0.1,0.1,1.0); // estableciendo el color de fondo
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);


}

function initLights(){

    gl.uniform3f(programHandle.uLightPosition, 31000, 14000, 24000); //asignar variables uniform que se encuentran (uniform vec3)
    gl.uniform3f(programHandle.uLightAmbient,0.1,0.1,0.1);
    gl.uniform3f(programHandle.uMaterialSpecular, 0.5,0.5,0.5);   
    gl.uniform3f(programHandle.uMaterialDiffuse, 0.8,0.8,0.8);
    gl.uniform1f(programHandle.uShininess, 24.0);

}
function setShaders(vsText, fsText)
{
    //CREANDO LOS SHADERS
    vsHandle = gl.createShader(gl.VERTEX_SHADER);
    fsHandle = gl.createShader (gl.FRAGMENT_SHADER);

    //CARGANDO LOS SHADERS
    // var myVertexShaderSrc = document.getElementById("vertex-shader").text;
    gl.shaderSource(vsHandle, vsText);

    // var myFragmentShaderSrc = document.getElementById("fragment-shader").text;
    gl.shaderSource(fsHandle, fsText);

    //COMPILANDO LOS SHADERS
    gl.compileShader(vsHandle);
    if (!gl.getShaderParameter(vsHandle, gl.COMPILE_STATUS)) 
    {
        console.error('ERROR compiling vertex shader!');
        return;
    }
    gl.compileShader(fsHandle);
    if (!gl.getShaderParameter(fsHandle, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fsHandle));
        return;
    }


    //Vincular shader y webgl
    programHandle = gl.createProgram();
    gl.attachShader(programHandle , fsHandle);
    gl.attachShader(programHandle , vsHandle);
    gl.linkProgram(programHandle);

    // gl.useProgram(programHandle);
    if (!gl.getProgramParameter(programHandle, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(programHandle));
        return;
    }
    gl.validateProgram(programHandle);
    if (!gl.getProgramParameter(programHandle, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(programHandle));
        return;
    }
    //AHORA YA ESTAN TODOS LOS SHADER VINCULADOS
}

function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
    return [
       0.5/ang, 0 , 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0 
    ];
 }

function cargarBuffers()
{
    malla1.entity.cargarBuffers();
}

function dibujarEscana()
{
    console.log("Dibujando la escana");
    treeRoot.draw();
}

function crearArbolEjemplo(callback)
{
    trans1 = crearTransformacion(treeRoot);
    trans2 = crearTransformacion(treeRoot);
    trans3 = crearTransformacion(treeRoot);
    trans4 = crearTransformacion(treeRoot);
    trans4.entity.traslate([1.5,1.5,1.5]);
    trans1.entity.traslate([0,1,-10]);

    trans2.entity.rotationX(30);
    trans2.entity.traslate([5 ,15,5]);
    camara = crearCamara(trans1);
    luz = crearLuz(trans2,1.0);
    // trans1.entity.rotationY(250);
    // trans1.entity.rotationZ(250);
    // trans1.entity.rotationX(150);
    // trans2.entity.rotationX(90);
    trans2.entity.traslate([1,1,1]);
    // trans3.entity.rotationZ(20);
    trans3.entity.traslate([0,0,0]);
    trans3.entity.rotationX(160);
    malla3 = crearMalla(trans3, "Vaso.json","Vaso.png");
    malla1 = crearMalla(trans4  ,"Susan.json","SusanTexture.png");
    // malla2 = crearMalla(trans3,"Parada.json","Parada.png");
    // malla2 = crearMalla(trans1, "icosphereMaterial.json");
     // dibujarEscana();
     
}