window.THREE = require('./three');
window.Physijs = require('./physi');
require('./TrackballControls');

Physijs.scripts.worker = '/js/physijs_worker.min.js';
Physijs.scripts.ammo = '/js/ammo.min.js';

var initPhysicsScene, render, renderer, scene, camera, controls, ground;

var L = 20;
var N = 20;

var size = 4000;

var initPhysicsScene = function($el, width) {
	/* ------------------- init renderer ------------------- */

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( $el.width(), $el.height() );
		$el[0].appendChild( renderer.domElement );

	/* ------------------- init scene ------------------- */

		scene = new Physijs.Scene;
		scene.setGravity(new THREE.Vector3(0, -30, 0));

	/* ------------------- init light ------------------- */
		light = new THREE.DirectionalLight( 0xFFFFFF );
		light.position.set( 20, 40, -15 );
		light.target.position.copy( scene.position );
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 20;
		light.shadowCameraFar = 200;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .7;
		scene.add( light );

		var ambient = new THREE.AmbientLight( 0x555555 );
		scene.add(ambient);

	/* ------------------- init camera ------------------- */

		camera = new THREE.PerspectiveCamera( 35, $el.width() / $el.height(), 1, 1000 );
		camera.position.set( 60, 50, 60 );
		scene.add( camera );

	/* ------------------- init controls ------------------- */

		controls = new THREE.TrackballControls( camera, $el[0] );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;
		controls.keys = [ 65, 83, 68 ];
		controls.addEventListener( 'change', render );

	/* ------------------- init floor ------------------- */

		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({color: 'green'});   

		var size = 3000;
		var step = L;

		for ( var i = - size; i <= size; i += width){
			geometry.vertices.push(new THREE.Vector3( - size, 1, i ));
			geometry.vertices.push(new THREE.Vector3( size, 1, i ));
		}

		var lines = new THREE.Line( geometry, material, THREE.LinePieces);
	    scene.add(lines);

		ground = new Physijs.BoxMesh(
			new THREE.BoxGeometry(size, 2, size),
			new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0}),
			0 // mass
		);

		// ground.receiveShadow = true;
		scene.add( ground );
};

var initScene = function($el, width) {
	/* ------------------- init renderer ------------------- */

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( $el.width(), $el.height() );
		$el[0].appendChild( renderer.domElement );

	/* ------------------- init scene ------------------- */

		scene = new THREE.Scene;

	/* ------------------- init light ------------------- */
		light = new THREE.DirectionalLight( 0xFFFFFF );
		light.position.set( 20, 40, -15 );
		light.target.position.copy( scene.position );
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 20;
		light.shadowCameraFar = 200;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .7;
		scene.add( light );

		var ambient = new THREE.AmbientLight( 0x555555 );
		scene.add(ambient);

	/* ------------------- init camera ------------------- */

		camera = new THREE.PerspectiveCamera( 35, $el.width() / $el.height(), 1, 1000 );
		camera.position.set( 60, 50, 60 );
		scene.add( camera );

	/* ------------------- init controls ------------------- */

		controls = new THREE.TrackballControls( camera, $el[0] );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;
		controls.keys = [ 65, 83, 68 ];
		controls.addEventListener( 'change', render );

	/* ------------------- init floor ------------------- */

		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({color: 'green'});   

		var size = 3000;
		for ( var i = 0; i <= size; i += width){
			geometry.vertices.push(new THREE.Vector3( - size, 1, i ));
			geometry.vertices.push(new THREE.Vector3( size, 1, i ));

			geometry.vertices.push(new THREE.Vector3( - size, 1, -i ));
			geometry.vertices.push(new THREE.Vector3( size, 1, -i ));
		}

		var lines = new THREE.Line( geometry, material, THREE.LinePieces);
	    scene.add(lines);

		ground = new Physijs.BoxMesh(
			new THREE.BoxGeometry(size, 2, size),
			new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0}),
			0 // mass
		);

		// ground.receiveShadow = true;
		scene.add( ground );
};

var animatePhysics = function() {
	scene.simulate();
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame( animatePhysics );
};

var animate = function() {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame( animate );
};

var render = function() {
	renderer.render( scene, camera); // render the scene
};

var freeze = function(shape) {
	// console.log(shape);
	setTimeout(function() {
		shape.mass = 0;
	}, 10000)
};


function perpComponent(vec) {
	return vec.z;
}

function range_overlaps(z1, z2, width) {
	var segment_width = Math.abs(z1-z2);

	if (Math.min(z1, z2) < 0 && Math.max(z1, z2) > 0) {
		return true;
	}

	z1 = Math.abs(z1); z2 = Math.abs(z2);

	return (Math.min(z1, z2) % width) + segment_width >= width;
}

function intersects(shape, width) {
	// console.log(shape);
	var tip = new THREE.Vector3(0, shape.geometry.boundingBox.max.y, 0, 1);
	var back = new THREE.Vector3(0, shape.geometry.boundingBox.min.y, 0, 1);

	tip.applyEuler(shape.rotation).add(shape.position);
	back.applyEuler(shape.rotation).add(shape.position);

	return range_overlaps(tip.z, back.z, width);
}

var tally = function(shape, width) {
	if (intersects(shape, width)) {
		shape.material.color.b = 0;
		shape.material.color.r = 0;
	}
};

var addNeedlePhysics = function() {
	return function() {
		var shape,
		material = new THREE.MeshPhongMaterial( { emissive: 0x111111 } );

		shape = new Physijs.BoxMesh(
			new THREE.BoxGeometry( .2, .2, N), 
			material
		);

		shape.position.set(
			Math.random() * L * spread - L * spread / 2,
			height,
			Math.random() * L * spread - L * spread / 2
		);
		
		shape.rotation.set(
			Math.random() * Math.PI,
			Math.random() * Math.PI,
			Math.random() * Math.PI
		);

		scene.add( shape );
		freeze(shape);
	};
};
var addNeedle = function(spread, physics, height) {
	return function() {
		var shape,
			material = new THREE.MeshPhongMaterial( { emissive: 0x111111 } );

		shape = new Physijs.CylinderMesh(
			new THREE.CylinderGeometry( 0, .2, N, 10), 
			material
		);

		shape.position.set(
			Math.random() * L * spread - L * spread / 2,
			1,
			Math.random() * L * spread - L * spread / 2
		);
		
		shape.rotation.set(
			Math.PI/2,
			0,
			Math.random() * Math.PI
		);

		scene.add( shape );
		tally(shape, L);
	};
};

var nAfterM = function(fxn, num, timeout) {
	return function() {
		return setInterval(function() {
			for (var i = 0;  i < num; i++) {
				fxn();
			}
		}, timeout);
	};
};

initScene($("#buffon-demo"), L);
animate();

interval = nAfterM(addNeedle(50, false, 30), 100, 100)();

setTimeout(function() {
	clearInterval(interval);
}, 10000);




