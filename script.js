// Simple Three.js scene loading a single GLB model
let scene, camera, renderer, controls;

function init() {
    const canvas = document.getElementById('singleCanvas');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181818);

    // Set canvas to fill viewport for mobile
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';

    camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 10, 10);
    scene.add(dirLight);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 1, 0);

    // Load GLB model
    const loader = new THREE.GLTFLoader();
    loader.load('../hoodie.glb', function(gltf) {
        gltf.scene.traverse(function(child) {
            if (child.isMesh) {
                if (child.material) {
                    // Remove any alphaMap and set alphaTest to 0
                    child.material.alphaMap = null;
                    child.material.alphaTest = 0;
                    child.material.transparent = false;
                    child.material.opacity = 1.0;
                    child.material.side = THREE.DoubleSide;
                    child.material.depthWrite = true;
                    child.material.depthTest = true;
                    // Optionally, convert to MeshStandardMaterial if not already
                    if (!(child.material instanceof THREE.MeshStandardMaterial)) {
                        child.material = new THREE.MeshStandardMaterial({
                            map: child.material.map || null,
                            color: child.material.color || new THREE.Color(0xffffff),
                            metalness: 0.5,
                            roughness: 0.7,
                            side: THREE.DoubleSide,
                            depthWrite: true,
                            depthTest: true,
                            opacity: 1.0,
                            transparent: false,
                            alphaTest: 0
                        });
                    }
                }
            }
        });
        scene.add(gltf.scene);
    }, undefined, function(error) {
        console.error('Error loading model:', error);
    });

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('orientationchange', onWindowResize, false);
    animate();
}

function onWindowResize() {
    const canvas = document.getElementById('singleCanvas');
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
