let container;
let camera, scene, raycaster, renderer,root;
let life;
let mouse = new THREE.Vector2(), INTERSECTED, CLICKED;
let radius = 100, theta = 0;
let objectList=[];
let objLoader = null, jsonLoader = null;

let fract = 0;
let deltat = 1000;
let duration = 200000; // ms
let currentTime = Date.now();
let seconds=0;
let secondFinal=59;
let directionalLight = null;
let spotLight = null;
let ambientLight = null;
let pointLight = null;
let minutes=3
let timer=59
let gameOver=false;
let puntuacion=0;
let salud=50;

let now = new Date().getTime();
let objElefantlUrl = {obj:'../models/obj/elefante/elefante.obj', map:'../models/obj/elefante/Textures/elefantefull.png', normalMap:'../models/obj/elefante/Textures/elefantefull.png', specularMap: '../models/obj/elefante/Textures/elefantefull.png'};

let objModelUrl = {obj:'../models/obj/leon/12273_Lion_v1_l3.obj', map:'../models/obj/leon/12273_Lion_Diffuse.jpg',normalMap:'../models/obj/leon/12273_Lion_Diffuse.jpg', specularMap: '../models/obj/leon/12273_Lion_Diffuse.jpg'};

let floorUrl = "../images/checker_large.gif";

function promisifyLoader ( loader, onProgress ) 
{
    function promiseLoader ( url ) {
  
      return new Promise( ( resolve, reject ) => {
  
        loader.load( url, resolve, onProgress, reject );
  
      } );
    }
  
    return {
      originalLoader: loader,
      load: promiseLoader,
    };
}

async function loadJson(url, objectList)
{
    const jsonPromiseLoader = promisifyLoader(new THREE.ObjectLoader());
    
    try {
        const object = await jsonPromiseLoader.load(url);

        object.castShadow = true;
        object.receiveShadow = true;
        object.position.y = -1;
        object.position.x = 1.5;
        object.name = "jsonObject";
        objectList.push(object);
        scene.add(object);

    }
    catch (err) {
        return onError(err);
    }
}

async function loadElefante(objModelUrl,objectList)
{

    const objPromiseLoader = promisifyLoader(new THREE.OBJLoader());

    try {
        
        
        const object = await objPromiseLoader.load(objModelUrl.obj);
        
        let texture = objModelUrl.hasOwnProperty('map') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
            
            
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
                child.material.normalMap = normalMap;
            }
        });

        object.scale.set(8, 8, 8);
        
        object.position.set(20,10,-187);
        scene.add(object);
        

    }
    catch (err) {
        return onError(err);
    }
}

const onError = ( ( err ) => { console.error( err ); } );
async function loadObj(objModelUrl, objectList)
{
    const objPromiseLoader = promisifyLoader(new THREE.OBJLoader());

    try {
        let texture = objModelUrl.hasOwnProperty('map') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        
        for ( let i = 0; i < 6; i ++ )  {
            const object = await objPromiseLoader.load(objModelUrl.obj);
            
            
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                }
            });

            object.scale.set(8, 8, 8);
            object.name = 'elefante';
            //object.position.set(60,60,-183)
            //object.position.set(Math.floor(Math.random()*(90+90))-90, Math.floor(Math.random()*(100+90))-90, -183);
            object.position.set(window.innerWidth/9, Math.floor(Math.random()*(100+90))-90, -183);
            console.log(object.position)
            objectList.push(object);
            console.log()
            
            scene.add(object);
        }
       
       
        for ( let i = 0; i <5; i ++ )  {
            const object = await objPromiseLoader.load(objModelUrl.obj);
            
            
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                }
            });

            object.scale.set(8, 8, 8);
            object.name = 'elefante';
            //object.position.set(60,60,-183)
            //object.position.set(Math.floor(Math.random()*(90+90))-90, Math.floor(Math.random()*(100+90))-90, -183);
            object.position.set(Math.floor(Math.random()*(90+90))-90, -90, -183);
            console.log(object.position)
            objectList.push(object);
            console.log()
            
            scene.add(object);
        }
       
    }
    catch (err) {
        return onError(err);
    }
}
function animate() {

    let now = Date.now();
    //let deltat = now - currentTime;
    //currentTime = now;
    
    
    let fract = deltat / duration;
    let angle = Math.PI * fract;

    for(object of objectList){
        if(object.up){
            object.position.y += 0.1;

            if(object.position.y > -2.5){
                object.up = false;
            }

        }else{
            object.position.y -= 0.1;
            if(object.position.y < 2){
                object.up = true;
            }
        }

        
            object.rotation.y += angle ;

            if(object.position.x >=0){
                object.position.x-=0.1;

            }else if(object.position.x <0){
                object.position.x+=0.1;

            }else{

                if(object.position.x > 0){
                    object.position.x-=0.1;
                }else if(object.position.x <= 0){
                    object.position.x+=0.1;
                }
                

            }
            
             
            
            
            
        }
        for(object of objectList){
            if(object.position.x>=-3&&object.position.x<=3&&object.position.y>=-3&&object.position.y<=3){
                if(salud>=0.5){
                    salud-=0.001
                     $("#health").html("HEALTH: " + salud.toFixed(1) );
                     
                 }else{
                     gameOver = true;
                     
                    
                 }
            }
        }

}
function run() 
{
    requestAnimationFrame(function() { run(); });
    renderer.render( scene, camera );
    animate();

}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

   

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    
    scene = new THREE.Scene();
    scene.add(camera)
    let textureBuild = new THREE.TextureLoader().load( '../models/obj/leon/sabana-africana-del-paisaje-puesta-sol-el-lugar-para-texto-130883255.jpg');
    scene.background =textureBuild;
    
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    
    // floor

    let map = new THREE.TextureLoader().load(floorUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    let floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;
    scene.add( floor );

    let geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    
    /*for ( let i = 0; i < 10; i ++ ) 
    {
        //La característica del Lamber es que no tiene reflejo
        let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        
        object.name = 'Cube' + i;
        object.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, -200);
        
        scene.add( object );
    }*/
    //loadElefante(objElefantlUrl,objectList)
    loadObj(objElefantlUrl, objectList);
    raycaster = new THREE.Raycaster();
        
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mousedown', onDocumentMouseDown);
    
    window.addEventListener( 'resize', onWindowResize);
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) 
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );
    
    if ( intersects.length > 0 ) 
    {
        let closer = intersects.length - 1;

        if ( INTERSECTED != intersects[ closer ].object ) 
        {
            if ( INTERSECTED)
            {
                INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            }

            INTERSECTED = intersects[ closer ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
    } 
    else 
    {
        if ( INTERSECTED ) 
            INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;
    }
}

function onDocumentMouseDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children,true );

    //console.log("intersects", intersects);
    if ( intersects.length > 0 ) 
    {
        CLICKED = intersects[ intersects.length - 1 ].object;
        if(!gameOver&&  CLICKED.name=="mesh_0"){
        //CLICKED.material.emissive.setHex( 0x00ff00 );
        //console.log(CLICKED.name);
        CLICKED.parent.alive=false;

        CLICKED.parent.position.set(window.innerWidth/6, Math.floor(Math.random()*(100+90))-90, -183)
        puntuacion+=1
       
        $("#score").html("SCORE: " + puntuacion );}
    } 
    else 
    {
        if ( CLICKED ) 
            CLICKED.material.emissive.setHex( CLICKED.currentHex );

        CLICKED = null;
        
    }
}
//Función run correcta
function run() 
{
    if (gameOver){
     
     $("#reiniciar").html("<h4><A HREF='javascript:history.go(0)' style='color:BLACK'>REINICIAR</A></h4>"); 
     
    }else{
    requestAnimationFrame( run );
    render();
    animate()
    setTimeout(temporizador,100)
    }
}
function habilitarBoton(){
    let boton1 = document.getElementById("boton1"); 
    boton1.disabled = false;
}

function temporizador(){
    
        if(secondFinal==0){
            gameOver=true
        }
        /*if(minutes === 0 && timer < 0){
            //gameover = true;
        }else{
            if(timer<0){
                minutes -= 1;
                timer = 59
            }
            timer -= 0.1;
            
            $("#timer").html("<h1>0" + minutes +":"+
            ("0" + Math.floor(timer.toFixed(1))).slice(-2) + "</h1>" );
        }
        console.log(timer)*/
        else{
        seconds+=1/90
            if(seconds>=1){
                secondFinal-=1
                seconds=0
            }
            $("#timer").html("<h1>0 :"+
            ( " "+ secondFinal) + "</h1>" );}
     }

function render() 
{
    renderer.render( scene, camera );
}
