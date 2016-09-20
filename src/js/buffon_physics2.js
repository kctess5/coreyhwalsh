window.THREE = require('./three');

THREEx = require('./threex');

window.Physijs = require('./physi');
Physijs.scripts.worker = '/js/physijs_worker.min.js';
Physijs.scripts.ammo = '/js/ammo.min.js';

require('./TrackballControls');
require('./canvas');

var utils = require('./utils');
var Stats = require('./stats');

var render, renderer, scene, camera, controls, render_stats, needle_stats, crossMaterial, noCrossMaterial;

var L = 20;
var N = 20;

var DURATION = 100; // sec
var SPREAD = 30; // intervals
var BATCH_SIZE = 5;
var MAX_DISPLAY = 1000;

var size = 4000;

var initStats = function($el) {
	render_stats = new Stats("FPS");
	render_stats.domElement.style.position = 'absolute';
	render_stats.domElement.style.top = '0px';
	render_stats.domElement.style.zIndex = 100;
	$el[0].appendChild( render_stats.domElement );
	
	needle_stats = new Stats("NPS");
	needle_stats.domElement.style.position = 'absolute';
	needle_stats.domElement.style.top = '50px';
	needle_stats.domElement.style.zIndex = 100;
	$el[0].appendChild( needle_stats.domElement );
};

var initScene = function($el, width, physics) {
	/* ------------------- init renderer ------------------- */

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( $el.width(), $el.height() );
		$el[0].appendChild( renderer.domElement );

	/* ------------------- init scene ------------------- */

		if (physics) {
			scene = new Physijs.Scene;
			scene.setGravity(new THREE.Vector3(0, -30, 0));
		} else {
			scene = new THREE.Scene;
		}
		

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

		camera = new THREE.PerspectiveCamera( 35, $el.width() / $el.height(), 1, 50000 );
		camera.position.set( 60, 50, 60 );
		scene.add( camera );


		window.addEventListener( 'resize', onWindowResize, false );
		function onWindowResize(){
		    camera.aspect = $el.width() / $el.height();
		    camera.updateProjectionMatrix();
		    renderer.setSize( $el.width(), $el.height() );
		}

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

		$(document).keyup(function(e) {
		    if (e.keyCode == 27) { // escape key maps to keycode `27`
		 		$el.removeClass('fullscreen');
		    }
		    return false;
		});

		// // allow 'f' to go fullscreen where this feature is supported
		if (THREEx.FullScreen.available()) {
		    THREEx.FullScreen.bindKey({ element: $el[0], enter: function() {
		    	$el.addClass('fullscreen');
		    	console.log('enter fullscreen')
		    }, exit: function() {
		    	console.log('exit fullscreen')
		    	$el.removeClass('fullscreen');
		    } });
		} else {
		    document.getElementById('fullscreenDoc').style.display = "none";
		}

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

	    if (physics) {
	    	ground = new Physijs.BoxMesh(
				new THREE.BoxGeometry(size, 2, size),
				new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.0}),
				0 // mass
			);

			// ground.receiveShadow = true;
			scene.add( ground );
	    }

	    initStats($el);
};

var animate = function(physics) {
	if (physics) {
		scene.simulate();
	}
	controls.update();
	renderer.render(scene, camera);
	render_stats.update();
	requestAnimationFrame( function() {
		animate(physics);
	} );
};

var render = function() {
	renderer.render(scene, camera);
	render_stats.update();
};

// check if the given range overlaps parallel lines with the given interval
function range_overlaps(z1, z2, interval) {
	var segment_width = Math.abs(z1-z2);

	if (Math.min(z1, z2) < 0 && Math.max(z1, z2) > 0) {
		return true;
	}

	z1 = Math.abs(z1); z2 = Math.abs(z2);

	return (Math.min(z1, z2) % interval) + segment_width >= interval;
}

function intersects(shape, width) {
	var tip = new THREE.Vector3(0, shape.len / 2, 0, 1);
	var back = new THREE.Vector3(0, -1 * shape.len / 2, 0, 1);

	// console.log(shape.matrixWorld, shape.matrixWorld.elements)

	tip.applyEuler(shape.rotation).add(shape.position);
	back.applyEuler(shape.rotation).add(shape.position);

	return range_overlaps(tip.z, back.z, width);
}

function setMass(shape, mass) {
	// shape._physijs.mass = mass;
	// shape.mass = mass;
	// shape.mass(mass);
}

var addNeedle = function(spread, physics, height) {
	var buffer = new utils.circularArray(MAX_DISPLAY);
	crossMaterial = new THREE.MeshPhongMaterial( { emissive: 0x111111, color: 'green' } );
	noCrossMaterial = new THREE.MeshPhongMaterial( { emissive: 0x111111 } );
	var geometry = new THREE.CylinderGeometry( 0, .2, N, 7);

	var i = 0;
	return function() {
		var shape;
		if (buffer.size() < MAX_DISPLAY) {
			if (physics) {
				shape = new Physijs.BoxMesh(
					new THREE.BoxGeometry( .2, N, 0.2), 
					noCrossMaterial
				);
			} else {
				shape = new THREE.Mesh(geometry, noCrossMaterial);
			}

			shape.len = N;
			buffer.add(shape);

			// console.log(shape);
			
		} else {
			shape = buffer.get(i-1);
			scene.remove(shape);
		}

		setMass(shape, 0.8);
		// shape.mass = 0.8;
		shape.material = noCrossMaterial;

		if (physics) {
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
		} else {
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
		}

		scene.add(shape);

		if (physics) {
			tally(shape, L, true);
		} else {
			tally(shape, L, false);
		}

		needle_stats.update();
		
		i = (i + 1) % MAX_DISPLAY;
	};
};

var intersected = 0;
var total = 0;

var tally = function(shape, width, physics) {
	var delay = 100;

	var _tally = function() {
		total += 1;
		if (intersects(shape, width)) {
			shape.material = crossMaterial;
			intersected += 1;
			// shape.mass = 0;
			setMass(shape, 0);
		} else {
			shape.material = noCrossMaterial;
		}
	};

	var _shouldTally = function() {
		var lv = shape.getLinearVelocity();
		var av = shape.getAngularVelocity();
		var abs = Math.abs;
		return abs(shape.position.y) < 2.5 && 
			abs(lv.x) < 0.3 &&  abs(lv.y) < 0.3 &&  abs(lv.z) < 0.3 &&  
			abs(av.x) < 0.3 &&  abs(av.y) < 0.3 &&  abs(av.z) < 0.3;
	};

	var _shouldTallyNp = function() {
		return shape.position.y < 3;
	};

	if (physics && _shouldTally()) {
		var lv = shape.getLinearVelocity();
		var av = shape.getAngularVelocity();
		_tally();

		// console.log(shape);
	} else if (physics == false && _shouldTallyNp()) {
		_tally();
	} else {
		setTimeout(function() {
			tally(shape, width, physics);
		}, delay);
	}
};

var estimatePi = function() {
	return 2 / (intersected / total);
}

var updateDisplay = function() {
	if (total > 0) {
		document.getElementById( 'pi_estimate' ).textContent = estimatePi();
		document.getElementById( 'intersected_needles' ).textContent = intersected;
		document.getElementById( 'total_needles' ).textContent = total;
	}
};


var needleFxn;
var physics = false;

if (physics) {
	initScene($("#buffon-demo"), L, true);
	animate(true);
	needleFxn = utils.nTimes(addNeedle(SPREAD, true, 30), BATCH_SIZE);
} else {
	initScene($("#buffon-demo"), L, false);
	animate(false);
	needleFxn = utils.nTimes(addNeedle(SPREAD), BATCH_SIZE);
}

var chart = new utils.liveChart('chartContainer', 'Recent Error', 750, BATCH_SIZE);
var longChart = new utils.liveResizingChart('longChartContainer', 'Error', 500, BATCH_SIZE);


// needleFxn()
var adder = setInterval(function() {
	needleFxn();
	chart.add(estimatePi() - Math.PI);
	longChart.add(estimatePi() - Math.PI);
}, 100);

var updater = setInterval(function() {
	updateDisplay();
}, 100);


// setTimeout(function() {
// 	clearInterval(adder);
// 	clearInterval(updater);
// }, 1000);


// var lc = new utils.liveResizingChart('longChartContainer', 'error', 100, BATCH_SIZE);

// var x = 0;
// var i = setInterval(function() {
// 	lc.add(x*x);
// 	x += 1;
// }, 10);


// setTimeout(function() {
// 	clearInterval(i);
// }, 100000);
