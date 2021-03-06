(function() {
    'use strict';
    var scene, renderer;
    var startpos = [ 625, 0, 125 ];
    var orbcontrols, orbcamera;

    function makefloor(){
        var floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1600, 600),
            new THREE.MeshPhongMaterial({color: 0x101010})
        );
        floor.rotation.x -= Math.PI/2;
        floor.position.y -= 100;
        return floor;
    }

    function makecamera(){
        var fieldOfView = 75; // humans: 150:210
        var aspectRatio = window.innerWidth/window.innerHeight;
        var nearPlane = 1;
        var farPlane = 2000;
        return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    }

    init();
    animate();

    function init() {

        scene = new THREE.Scene();
        scene.add(WALLS.mesh);
        scene.add(makefloor());
        scene.add(new THREE.AmbientLight(0xffffff, 2));

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('container').appendChild(renderer.domElement);

        orbcamera = makecamera();
        orbcontrols = new THREE.OrbitControls(orbcamera, renderer.domElement);
        orbcamera.position.set(...startpos);
        orbcontrols.enableZoom = true;
        orbcontrols.enableKeys = false;

        if ( FPS.available ) {
            FPS.setCamera(makecamera(), startpos);
            scene.add(FPS.cameraObj);
            LIGHTS.menu.add(FPS, 'enable').name('FPS Mode');
        }

        LIGHTS.menu.add({_:()=>LIGHTS.loadData(prompt('Path to data'),(d)=>FORM.fill(d))},'_').name('Load data');

        LIGHTS.menu.add(FORM, 'show').name('Editor');
        var code = LIGHTS.menu.addFolder('Code');

        LIGHTS.gui.remember(FORM.data);
        FORM.fields.map(i => code.add(FORM.data, i).listen());
        FORM.onSet((d) => LIGHTS.load('Editor', d, true));

        LIGHTS.loadData('nf/meteor');
        LIGHTS.loadData('nf/fireworks');
        LIGHTS.loadData('nf/glowworms');
        LIGHTS.loadData('examples/balls', (d) => FORM.fill(d));

        document.getElementById('gitbtn').addEventListener('click', function(e){
            window.open('https://github.com/randName/nightfest2017/');
        }, false);

        window.addEventListener('resize', function() {
            var camera = FPS.controls.enabled ? FPS.camera : orbcamera;
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        LIGHTS.update(WALLS);
        if ( FPS.controls.enabled ) {
            FPS.update();
            renderer.render(scene, FPS.camera);
        } else {
            orbcontrols.update();
            renderer.render(scene, orbcamera);
        }
    }
})();
