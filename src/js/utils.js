var circularArray = function(size) {
	this.bin = new Array(size);
	this.index = 0;
	this._size  = size;
}

circularArray.prototype.get = function(i) {
	return this.bin[ ( this.index - i - 1 ) % this._size ];
}

circularArray.prototype.size = function() {
	return Math.min(this._size, this.index);
}

circularArray.prototype.add = function(val) {
	this.bin[ this.index % this._size ] = val;
	this.index += 1;
}

circularArray.prototype.each = function(fxn) {
	var size = Math.min(this.index, this._size);

	for (var i = 0; i < size; i++) {
		fxn(this.bin[i])
	}
}

// call given function n times every n millis
var nAfterM = function(fxn, num, timeout) {
	return function() {
		return setInterval(function() {
			for (var i = 0;  i < num; i++) {
				fxn();
			}
		}, timeout);
	};
};

// call given function n times every n millis
var nTimes = function(fxn, num, timeout) {
	return function() {
		for (var i = 0;  i < num; i++) {
			fxn(i);
		}
	};
};

var liveChart = function(id, text, dataLength, step) {
	this.dps = [];
	this.xVal = 0;
	this.dataLength = dataLength;
	this.step = step | 1;
	this.chart = new CanvasJS.Chart(id, {
		title :{
			text: text
		},			
		data: [{
			type: "line",
			dataPoints: this.dps 
		}]
	});
	this.update();
};

liveChart.prototype.add = function(yVal) {
	this.dps.push({
		x: this.xVal,
		y: yVal
	});
	if (this.dps.length > this.dataLength) {
		this.dps.shift();
	}
	this.xVal = this.xVal + this.step;
	this.update();
};

liveChart.prototype.update = function() {
	this.chart.render();
};

var liveResizingChart = function(id, text, maxLen, step) {
	this.dps = [];
	this.sampleBuffer = [];
	this.xVal = 0;
	this.maxLen = maxLen;
	this.step = step | 1;
	this._multiplier = 1;
	this.id = id;
	this.text = text;

	this.makeChart();
	
	this.update();
};

liveResizingChart.prototype.makeChart = function(id, text) {
	this.chart = new CanvasJS.Chart(this.id, {
		title: {
			text: this.text
		},			
		data: [{
			type: "line",
			dataPoints: this.dps 
		}]
	});
}

liveResizingChart.prototype.add = function(yVal) {
	this.sampleBuffer.push({
		x: this.xVal,
		y: yVal
	});
	if (this.sampleBuffer.length === this._multiplier) {
		var newSample = { x: 0, y: 0 };

		for (var i = 0; i < this.sampleBuffer.length; i++) {
			newSample.x += this.sampleBuffer[i].x;
			newSample.y += this.sampleBuffer[i].y;
		}

		newSample.x = newSample.x / this._multiplier;
		newSample.y = newSample.y / this._multiplier;

		this.dps.push(newSample);
		this.sampleBuffer = [];
	}

	if (this.dps.length > this.maxLen && this.dps.length % 2 == 0) {
		this.downsample();
	}
	this.xVal = this.xVal + this.step;
	this.update();
};

liveResizingChart.prototype.downsample = function() {
	var newSamples = [];
	for (var i = 0; i < this.dps.length; i += 2) {
		var s1 = this.dps[i];
		var s2 = this.dps[i + 1];

		newSamples.push({
			x: (s1.x + s2.x) / 2,
			y: (s1.y + s2.y) / 2
		});
	};
	this.dps = newSamples;
	this._multiplier *= 2;
	this.makeChart();
};

liveResizingChart.prototype.update = function() {
	this.chart.render();
};


module.exports = {
	nAfterM: nAfterM,
	circularArray: circularArray,
	nTimes: nTimes,
	liveChart: liveChart,
	liveResizingChart: liveResizingChart
};