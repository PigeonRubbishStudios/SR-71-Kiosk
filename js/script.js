// VARIABLES
var canvas = document.getElementById("renderCanvas");
var engine = null;
var scene = null;
var sceneToRender = null;
var engine;
var scene;
var createDefaultEngine = function() 
{
    return new BABYLON.Engine(canvas, true, 
    {
        preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false
    });
};

// FUNCTIONS
const createScene = () => 
{
    // VARIABLES
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
	var light = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0,0,0), scene);
    var skybox = BABYLON.Mesh.CreateBox('skybox', 1000.0, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial('skybox', scene);

    //Scene Options
	scene.clearColor = new BABYLON.Color3.Black();
	scene.ambientColor = new BABYLON.Color3.Black();
    scene.activeCamera = camera;
	scene.activeCamera.attachControl(canvas);
    camera.wheelPrecision = 200; //Mouse wheel speed

    //Light Options
    light.diffuse = new BABYLON.Color3(1, 1, 1);
	light.specular = new BABYLON.Color3(1, 1, 1);
	light.groundColor = new BABYLON.Color3(0, 0, 0);

    //Skybox Options
    skybox.infiniteDistance = true;
	skyboxMaterial.disableLighting = true;
	skyboxMaterial.backFaceCulling = false;
	skybox.material = skyboxMaterial;
	
    //Skybox Texture
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://raw.githubusercontent.com/PigeonRubbishStudios/SR-71-Kiosk/main/images/textures/night3/night", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    //http://wwwtyro.github.io/space-3d/#animationSpeed=0&fov=90&nebulae=true&pointStars=false&resolution=2048&seed=4g9a1vv0d3e0&stars=false&sun=true
    //Night1 - 5i240qjwjc40
    //Night2 - 2r9jdv6xc1q0
    //Night3 - 3fonam0qemu0
    //Night4 - 4g9a1vv0d3e0
    
    //Import Plane
    BABYLON.SceneLoader.ImportMesh("", "./models/sr-71/", "sr-71.gltf");

    return scene;
}

initFunction = async function() 
{
    var asyncEngineCreation = async function() 
    {
        try 
        {
            return createDefaultEngine();
        } 
        catch (e) 
        {
            console.log("the available createEngine function failed. Creating the default engine instead");

            return createDefaultEngine();
        }
    }

    engine = await asyncEngineCreation();

    if (!engine) throw 'engine should not be null.';

    scene = createScene();
};

initFunction().then(() => 
{
    sceneToRender = scene
    engine.runRenderLoop(function() 
    {
        if (sceneToRender && sceneToRender.activeCamera) 
        {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize", function() 
{
    engine.resize();
});