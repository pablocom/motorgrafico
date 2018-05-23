var gl; // contexto programa
var vsHandle, fsHandle, programHandle; // Manipulador de vertice shader, fragmento shader y programa
var camaraActiva = null;
var luzActiva = null;

var pMatrix = mat4.create(); // Matriz de proyeccion
var nMatrix = mat4.create(); // Matriz normal

var InitDemo = function() //Funciona para inicial el motor
{
    //Funciones callback para los archivos vertice shader fragmento shader y luego empieza a ejecutar el motor
    loadTextResource('./shader.vs.glsl', function(vsErr, vsText) {
        if (vsErr) {
            alert('Fatal error getting vertex shader (see console)');
            console.error(vsErr);
        } else {
            loadTextResource('./shader.fs.glsl', function(fsErr, fsText) {
                if (fsErr) {
                    alert('Fatal error getting fragment shader (see console)');
                    console.error(fsErr);
                } else {
                    loadTextResource('./sombra.vs.glsl', function(svsErr, svsText) {
                        if (svsErr) {
                            alert('Fatal error getting shadow vertex shader (see console)');
                            console.error(svsErr);
                        } else {
                            loadTextResource('./sombra.fs.glsl', function(sfsErr, sfsText) {
                                if (sfsErr) {
                                    alert('Fatal error getting shadow fragment shader (see console)');
                                    console.error(sfsErr);
                                } else {
                                    loadTextResource('./mapaSombra.vs.glsl', function(mvsErr, mvsText) {
                                        if (mvsText) {
                                            alert('Fatal error getting shadow fragment shader (see console)');
                                            console.error(mvsText);
                                        } else {
                                            loadTextResource('./mapaSombra.fs.glsl', function(mfsErr, mfsText) {
                                                if (mfsErr) {
                                                    alert('Fatal error getting shadow fragment shader (see console)');
                                                    console.error(mfsErr);
                                                } else {
                                                    startWebGL(vsText, fsText, svsText, sfsText, mvsText, mfsText);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};


function startWebGL(vsText, fsText, svsText, sfsText, mvsText, mfsText) {
    //main al que se llama al iniciar el programa
    var canvas = document.getElementById("glcanvas");
    gl = initWebGL(canvas);
    //Setear shaders
    if (gl) { //Solo continuar en el caso de que el navegador pueda correr webGL
        setShaders(vsText, fsText, svsText, sfsText);
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
    }
}


function initWebGL(canvas) { //tomar contexto webgl en el canvas. 
    gl = null;
    try {
        // Tratar de tomar el contexto estandar. Si falla, retornar al experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        // gl.clearColor(0.75, 0.85, 0.8, 1.0);
        // gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    } catch (e) {}

    // Si no tenemos ningun contexto GL, date por vencido ahora
    if (!gl) {
        alert("Imposible inicializar WebGL. Tu navegador puede no soportarlo.");
        gl = null;
    }
    return gl;
}

function setShaders(vsText, fsText, svsText, sfsText) //Funcion para crear shader
{
    //CREANDO LOS SHADERS
    vsHandle = gl.createShader(gl.VERTEX_SHADER);
    fsHandle = gl.createShader(gl.FRAGMENT_SHADER);

    //CARGANDO LOS SHADERS
    // var myVertexShaderSrc = document.getElementById("vertex-shader").text;
    gl.shaderSource(vsHandle, vsText);

    // var myFragmentShaderSrc = document.getElementById("fragment-shader").text;
    gl.shaderSource(fsHandle, fsText);

    //COMPILANDO LOS SHADERS
    gl.compileShader(vsHandle);
    if (!gl.getShaderParameter(vsHandle, gl.COMPILE_STATUS)) {
        console.error('ERROR compilando vertice shader!');
        return;
    }
    gl.compileShader(fsHandle);
    if (!gl.getShaderParameter(fsHandle, gl.COMPILE_STATUS)) {
        console.error('ERROR compilando fragmento shader!', gl.getShaderInfoLog(fsHandle));
        return;
    }

    //Crear el programa
    programHandle = gl.createProgram();
    //Vincular shader y webgl
    gl.attachShader(programHandle, fsHandle);
    gl.attachShader(programHandle, vsHandle);
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

function crearArbolEjemplo() //Funcion para crear arbol
{
    //Declarar transformaciones
    transCamara = crearTransformacion(treeRoot);
    transLuz = crearTransformacion(treeRoot);
    trans1 = crearTransformacion(treeRoot);
    transTeatro = crearTransformacion(trans1);
    // transCojin = crearTransformacion(trans1);
    // transSilla = crearTransformacion(trans1);
    // transCojin1 = crearTransformacion(transCojin);
    // transSilla1 = crearTransformacion(transSilla);
    // transCojin2 = crearTransformacion(transCojin);
    // transSilla2 = crearTransformacion(transSilla);
    // transCojin3 = crearTransformacion(transCojin);
    // transSilla3 = crearTransformacion(transSilla);
    // transCojin4 = crearTransformacion(transCojin);
    // transSilla4 = crearTransformacion(transSilla);

    // transCojin5 = crearTransformacion(transCojin);
    // transSilla5 = crearTransformacion(transSilla);
    // transCojin6 = crearTransformacion(transCojin);
    // transSilla6 = crearTransformacion(transSilla);
    // transCojin7 = crearTransformacion(transCojin);
    // transSilla7 = crearTransformacion(transSilla);
    // transCojin8 = crearTransformacion(transCojin);
    // transSilla8 = crearTransformacion(transSilla);

    // transCojin9 = crearTransformacion(transCojin);
    // transSilla9 = crearTransformacion(transSilla);
    // transCojin10 = crearTransformacion(transCojin);
    // transSilla10 = crearTransformacion(transSilla);
    // transCojin11 = crearTransformacion(transCojin);
    // transSilla11 = crearTransformacion(transSilla);
    // transCojin12 = crearTransformacion(transCojin);
    // transSilla12 = crearTransformacion(transSilla);

    // transCojin13 = crearTransformacion(transCojin);
    // transSilla13 = crearTransformacion(transSilla);
    // transCojin14 = crearTransformacion(transCojin);
    // transSilla14 = crearTransformacion(transSilla);
    // transCojin15 = crearTransformacion(transCojin);
    // transSilla15 = crearTransformacion(transSilla);
    // transCojin16 = crearTransformacion(transCojin);
    // transSilla16 = crearTransformacion(transSilla);

    // transCojin17 = crearTransformacion(transCojin);
    // transSilla17 = crearTransformacion(transSilla);
    // transCojin18 = crearTransformacion(transCojin);
    // transSilla18 = crearTransformacion(transSilla);
    // transCojin19 = crearTransformacion(transCojin);
    // transSilla19 = crearTransformacion(transSilla);
    // transCojin20 = crearTransformacion(transCojin);
    // transSilla20 = crearTransformacion(transSilla);

    // transCojin21 = crearTransformacion(transCojin);
    // transSilla21 = crearTransformacion(transSilla);
    // transCojin22 = crearTransformacion(transCojin);
    // transSilla22 = crearTransformacion(transSilla);
    // transCojin23 = crearTransformacion(transCojin);
    // transSilla23 = crearTransformacion(transSilla);
    // transCojin24 = crearTransformacion(transCojin);
    // transSilla24 = crearTransformacion(transSilla);

    //Realizando transformaciones
    transCamara.entity.traslate([0, 2, -80]);
    transLuz.entity.rotationX(30);
    transLuz.entity.traslate([5, 15, 5]);
    trans1.entity.rotationX(-90);
    trans1.entity.rotationZ(90);
    trans1.entity.traslate([0,-22,-10])

    transTeatro.entity.rotationX(-180);
    transTeatro.entity.rotationZ(-180);
    transTeatro.entity.scalar([0.45,0.45,0.45]);
    transTeatro.entity.traslate([-15, 122, 15]);


    camara = crearCamara(transCamara);
    luz = crearLuz(transLuz, 0.85);



    sillas = crearMalla(trans1, "sillas.json", "madera_roble.jpg");
    teatro = crearMalla(transTeatro, "teatro.json", "madera_roble.jpg");

    // lucesBajo = crearMalla(trans1, "lucesBajo.json", "madera_roble.jpg");

    // cojines = crearMalla(transTeatro,"cojines.json", "tela-jacquard-geometrico-negra.jpg");
    // transCojin.entity.traslate([0, 0, 0.1]);

    // transCojin2.entity.traslate([0, 2.1, 0]);
    // transSilla2.entity.traslate([0, 2.1, 0]);
    // transCojin3.entity.traslate([0, 4.2, 0]);
    // transSilla3.entity.traslate([0, 4.2, 0]);
    // transCojin4.entity.traslate([0, 6.3, 0]);
    // transSilla4.entity.traslate([0, 6.3, 0]);

    // transCojin5.entity.traslate([0, -4.2, 0]);
    // transSilla5.entity.traslate([0, -4.2, 0]);
    // transCojin6.entity.traslate([0, -6.3, 0]);
    // transSilla6.entity.traslate([0, -6.3, 0]);
    // transCojin7.entity.traslate([0, -8.4, 0]);
    // transSilla7.entity.traslate([0, -8.4, 0]);
    // transCojin8.entity.traslate([0, -10.5, 0]);
    // transSilla8.entity.traslate([0, -10.5, 0]);

    // transCojin9.entity.traslate([4, 2.1, 0]);
    // transSilla9.entity.traslate([4, 2.1, 0]);
    // transCojin10.entity.traslate([4, 4.2, 0]);
    // transSilla10.entity.traslate([4, 4.2, 0]);
    // transCojin11.entity.traslate([4, 6.3, 0]);
    // transSilla11.entity.traslate([4, 6.3, 0]);

    // transCojin12.entity.traslate([4, -4.2, 0]);
    // transSilla12.entity.traslate([4, -4.2, 0]);
    // transCojin13.entity.traslate([4, -6.3, 0]);
    // transSilla13.entity.traslate([4, -6.3, 0]);
    // transCojin14.entity.traslate([4, -8.4, 0]);
    // transSilla14.entity.traslate([4, -8.4, 0]);
    // transCojin15.entity.traslate([4, -10.5, 0]);
    // transSilla15.entity.traslate([4, -10.5, 0]);
    // transCojin16.entity.traslate([4, 0, 0]);
    // transSilla16.entity.traslate([4, 0, 0]);

    // transCojin17.entity.traslate([8, 2.1, 0]);
    // transSilla17.entity.traslate([8, 2.1, 0]);
    // transCojin18.entity.traslate([8, 4.2, 0]);
    // transSilla18.entity.traslate([8, 4.2, 0]);
    // transCojin19.entity.traslate([8, 6.3, 0]);
    // transSilla19.entity.traslate([8, 6.3, 0]);

    // transCojin20.entity.traslate([8, -4.2, 0]);
    // transSilla20.entity.traslate([8, -4.2, 0]);
    // transCojin21.entity.traslate([8, -6.3, 0]);
    // transSilla21.entity.traslate([8, -6.3, 0]);
    // transCojin22.entity.traslate([8, -8.4, 0]);
    // transSilla22.entity.traslate([8, -8.4, 0]);
    // transCojin23.entity.traslate([8, -10.5, 0]);
    // transSilla23.entity.traslate([8, -10.5, 0]);
    // transCojin24.entity.traslate([8, 0, 0]);
    // transSilla24.entity.traslate([8, 0, 0]);


    // trans5.entity.traslate([5,0,0]);
    // malla1 = crearMalla(trans3  ,"Susan.json","SusanTexture.png");
    // malla2 = crearMalla(trans4  ,"Susan.json","SusanTexture.png");
    // malla3 = crearMalla(trans1 ,"Susan.json","SusanTexture.png");
    // malla1 = crearMalla(trans4, "extintor.json","SusanTexture.png");
    // malla2 = crearMalla(trans3, "lamparaA.json","SusanTexture.png");
    // malla1 = crearMalla(transCojin1, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla2 = crearMalla(transSilla1, "silla.json", "madera_roble.jpg");
    // malla3 = crearMalla(transCojin2, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla4 = crearMalla(transSilla2, "silla.json", "madera_roble.jpg");
    // malla5 = crearMalla(transCojin3, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla6 = crearMalla(transSilla3, "silla.json", "madera_roble.jpg");
    // malla7 = crearMalla(transCojin4, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla8 = crearMalla(transSilla4, "silla.json", "madera_roble.jpg");
    // malla9 = crearMalla(transCojin5, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla10 = crearMalla(transSilla5, "silla.json", "madera_roble.jpg");
    // malla11 = crearMalla(transCojin6, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla12 = crearMalla(transSilla6, "silla.json", "madera_roble.jpg");
    // malla13 = crearMalla(transCojin7, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla14 = crearMalla(transSilla7, "silla.json", "madera_roble.jpg");
    // malla15 = crearMalla(transCojin8, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla16 = crearMalla(transSilla8, "silla.json", "madera_roble.jpg");

    // malla17 = crearMalla(transCojin9, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla18 = crearMalla(transSilla9, "silla.json", "madera_roble.jpg");
    // malla19 = crearMalla(transCojin10, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla20 = crearMalla(transSilla10, "silla.json", "madera_roble.jpg");
    // malla21 = crearMalla(transCojin11, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla22 = crearMalla(transSilla11, "silla.json", "madera_roble.jpg");
    // malla23 = crearMalla(transCojin12, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla24 = crearMalla(transSilla12, "silla.json", "madera_roble.jpg");
    // malla25 = crearMalla(transCojin13, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla26 = crearMalla(transSilla13, "silla.json", "madera_roble.jpg");
    // malla27 = crearMalla(transCojin14, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla28 = crearMalla(transSilla14, "silla.json", "madera_roble.jpg");
    // malla29 = crearMalla(transCojin15, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla30 = crearMalla(transSilla15, "silla.json", "madera_roble.jpg");
    // malla31 = crearMalla(transCojin16, "cojinA.json", "tela-jacquard-geometrico-negra.jpg");
    // malla32 = crearMalla(transSilla16, "silla.json", "madera_roble.jpg");

    // malla33 = crearMalla(transCojin17, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla34 = crearMalla(transSilla17, "silla.json","madera_roble.jpg");
    // malla35 = crearMalla(transCojin18, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla36 = crearMalla(transSilla18, "silla.json","madera_roble.jpg");
    // malla37 = crearMalla(transCojin19, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla38 = crearMalla(transSilla19, "silla.json","madera_roble.jpg");
    // malla39 = crearMalla(transCojin20, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla40 = crearMalla(transSilla20, "silla.json","madera_roble.jpg");
    // malla41 = crearMalla(transCojin21, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla42 = crearMalla(transSilla21, "silla.json","madera_roble.jpg");
    // malla43 = crearMalla(transCojin22, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla44 = crearMalla(transSilla22, "silla.json","madera_roble.jpg");
    // malla45 = crearMalla(transCojin23, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla46 = crearMalla(transSilla23, "silla.json","madera_roble.jpg");
    // malla47 = crearMalla(transCojin24, "cojinA.json","tela-jacquard-geometrico-negra.jpg");
    // malla48 = crearMalla(transSilla24, "silla.json","madera_roble.jpg");
    // malla2 = crearMalla(trans3,"calle.json","calle.png");
    // malla2 = crearMalla(trans1, "icosphereMaterial.json");
    // dibujarEscana();


}

function moverCamara(direccion) {
    var salto = 0.6;
    var gradoDeRotacion = 1;
    switch (direccion) {
        case 'alante':
            trans1.entity.traslate([0.0, 0.0, salto]);

            break;
        case 'detras':
            trans1.entity.traslate([0.0, 0.0, -salto]);

            break;
        case 'izq':
            trans1.entity.traslate([salto, 0.0, 0.0]);

            break;
        case 'der':
            trans1.entity.traslate([-salto, 0.0, 0.0]);

            break;
        case 'arriba':
            trans1.entity.traslate([0.0, salto, 0.0]);

            break;
        case 'abajo':
            trans1.entity.traslate([0.0, -salto, 0.0]);

            break;
        case 'rotaX':
            trans1.entity.rotationX(gradoDeRotacion);
            break;
        case 'negrotaX':
            trans1.entity.rotationX(-Math.abs(gradoDeRotacion));
            break;
        case 'rotaY':
            trans1.entity.rotationY(gradoDeRotacion);
            break;
        case 'negrotaY':
            trans1.entity.rotationY(-Math.abs(gradoDeRotacion));
            break;
        case 'rotaZ':
            trans1.entity.rotationZ(gradoDeRotacion);
            break;
        case 'negrotaZ':
            trans1.entity.rotationZ(-Math.abs(gradoDeRotacion));
            break;
        default:
            console.log('Ha habido un error moviendo la camara');
    }
}

window.onkeypress = function(e) {
    if (e.key == 'a') {
        moverCamara('izq');
    }
    if (e.key == 'd') {
        moverCamara('der');
    }
    if (e.key == 'w') {
        moverCamara('alante');
    }
    if (e.key == 's') {
        moverCamara('detras');
    }
    if (e.key == 'e') {
        moverCamara('arriba');
    }
    if (e.key == 'q') {
        moverCamara('abajo');
    }
    //ROTACIONES
    if (e.key == 'i') {
        moverCamara('rotaX');
    }
    if (e.key == 'k') {
        moverCamara('negrotaX');
    }
    if (e.key == 'j') {
        moverCamara('negrotaY');
    }
    if (e.key == 'l') {
        moverCamara('rotaY');
    }
    if (e.key == 'o') {
        moverCamara('rotaZ');
    }
    if (e.key == 'u') {
        moverCamara('negrotaZ');
    }

}


// function animate()//Dibujar 10 veces al segundo
// {
//     // setInterval(function(){
//     //     treeRoot.draw();
//     // }, 100); 
//     treeRoot.draw();
// }

function renderLoop() {
    requestAnimFrame(renderLoop);
    treeRoot.draw();
}

function requestAnimeFrame(o) { //hacemos el bucle recursivo para que se ejecute el renderloop todo el tiempo
    requestAnimeFrame(o);
}