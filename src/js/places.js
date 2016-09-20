console.log("Test");

var Detector = require('./detector');

console.log(Detector);
window.THREE = require('./three');
THREEx = require('./threex');
require('./TrackballControls');

// Created by Bjorn Sandvik - thematicmapping.org
(function ($el) {

	var webglEl = document.getElementById('places_container');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = $el.width(),
		height = $el.height();

	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 6;  

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x777777));

	var light = new THREE.DirectionalLight(0xffffff, .4);
	light.position.set(5,3,5);
	scene.add(light);

    var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation; 
	scene.add(sphere);

    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds);

	var stars = createStars(90, 64);
	scene.add(stars);

	var controls = new THREE.TrackballControls(camera,$el[0]);

	$el[0].appendChild( renderer.domElement );

	render();

	function render() {
		controls.update();
		sphere.rotation.y += 0.0005;
		clouds.rotation.y += 0.0005;		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('/assets/earth_images/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('/assets/earth_images/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('/assets/earth_images/water_4k.png'),
				specular:    new THREE.Color('grey')								
			})
		);
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('/assets/earth_images/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('/assets/earth_images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

	function createPin(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('/assets/earth_images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

}($("#places_container")));