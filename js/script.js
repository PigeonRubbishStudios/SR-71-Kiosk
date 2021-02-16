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

	scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.5);
	scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

	
	light.diffuse = new BABYLON.Color3(1, 1, 1);
	light.specular = new BABYLON.Color3(1, 1, 1);
	light.groundColor = new BABYLON.Color3(0, 0, 0);

	
	skyboxMaterial.backFaceCulling = false;
	skybox.material = skyboxMaterial;
	
	skybox.infiniteDistance = true;

	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('http://www.babylonjs-playground.com/textures/skybox', scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

	scene.activeCamera = camera;
	scene.activeCamera.attachControl(canvas);

    
    BABYLON.SceneLoader.ImportMeshAsync("", "./models/sr-71/", "sr-71.gltf");

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

initFunction().then(() => {
    sceneToRender = scene
    engine.runRenderLoop(function() {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize", function() {
    engine.resize();
});