function rng (max) {
	return Array.apply(null, Array(max)).map(function (_, i) {return i;});
}

var OptimalLayout = function(numpanes, s) {
	this.n = numpanes;
	this.s = s;
};

OptimalLayout.prototype.min = function() {
	return this.n * this.s.minWidth;
};

OptimalLayout.prototype.max = function() {
	return this.n * this.s.maxWidth;
};

OptimalLayout.prototype.makeLayout = function(viewportWidth) {
	var small = (this.n - 1) * this.s.minWidth + this.s.targetWidth;
	var medium = this.n * this.s.targetWidth;
	if (viewportWidth.between(this.min(), small)) {
		var left = 0;
		return rng(this.n).map(function(i) {
			if (i == this.n - 1) {
				return {
					l: left,
					r: viewportWidth
				};
			}
			else {
				var bounds = {
					l: left,
					r: left + this.s.minWidth
				};
				left += this.s.minWidth;
				return bounds;
			}
		}.bind(this));
	} else if (viewportWidth.between(small, medium)) {
		var previewWidth = ( viewportWidth - this.s.targetWidth ) / (this.n-1);
		var left = 0;
		return rng(this.n).map(function(i) {
			if (i == this.n - 1) {
				return {
					l: left,
					r: viewportWidth
				};
			}
			else {
				var bounds = {
					l: left,
					r: left + previewWidth
				};
				left += previewWidth;
				return bounds;
			}
		}.bind(this));
	} else if (viewportWidth.between(medium, this.max())) {
		var previewWidth = ( viewportWidth - this.s.maxWidth ) / (this.n-1);
		var left = 0;
		return rng(this.n).map(function(i) {
			if (i == this.n - 1) {
				return {
					l: left,
					r: viewportWidth
				};
			}
			else {
				var bounds = {
					l: left,
					r: left + previewWidth
				};
				left += previewWidth;
				return bounds;
			}
		}.bind(this));
	} else if (viewportWidth > this.max()) {
		var left = 0;
		return rng(this.n).map(function(i) {
			var bounds = {
				l: left,
				r: left + this.s.maxWidth
			}
			if (i == this.n - 1) {
				bounds.r = viewportWidth;
			}
			left += this.s.maxWidth;
			return bounds;
		}.bind(this));
	}
	
	return null;
};

var FoldedLayout = function(numpanes, s) {
	this.n = numpanes;
	this.s = s;
};

FoldedLayout.prototype.min = function() {
	return (this.n-1) * this.s.minPreview + this.s.minWidth;
};

FoldedLayout.prototype.max = function() {
	return this.n * this.s.maxWidth;
};

FoldedLayout.prototype.makeLayout = function(viewportWidth) {
	var smallest = this.min();
	var small = (this.n-1) * this.s.minPreview + this.s.targetWidth;
	var large = (this.n-1) * this.s.minWidth + this.s.maxWidth;
	var largest = this.max();

	if (viewportWidth.between(smallest, small)) {
		var left = 0;
		return rng(this.n).map(function(i) {
			if (i == this.n - 1) {
				return {
					l: left,
					r: viewportWidth
				};
			}
			else {
				var bounds = {
					l: left,
					r: left + this.s.minWidth
				}
				left += this.s.minPreview;
				return bounds;
			}
		}.bind(this));
	} else if (viewportWidth.between(small, large)) {
		var previewWidth = ( viewportWidth - this.s.targetWidth ) / (this.n-1);
		var left = 0;
		return rng(this.n).map(function(i) {
			if (i == this.n - 1) {
				return {
					l: left,
					r: viewportWidth
				};
			}
			else {
				var bounds = {
					l: left,
					r: left + this.s.minWidth
				}
				left += previewWidth;
				return bounds;
			}
		}.bind(this));
	} else if (viewportWidth.between(large, largest)) {
		var previewWidth = ( viewportWidth - this.s.maxWidth ) / (this.n-1);
		var left = 0;
		return rng(this.n).map(function(i) {
			if (i == this.n - 1) {
				return {
					l: left,
					r: viewportWidth
				};
			}
			else {
				var bounds = {
					l: left,
					r: left + this.s.minWidth
				}
				left += previewWidth;
				return bounds;
			}
		}.bind(this));
	} 
	return null;
};

var MobileLayout = function(numpanes, s) {
	this.n = numpanes;
	this.s = s;
};

MobileLayout.prototype.min = function() {
	return this.s.minWidth;
};

MobileLayout.prototype.max = function() {
	return this.s.maxWidth;
};

MobileLayout.prototype.makeLayout = function(viewportWidth) {
	return rng(this.n).map(function(i) {
		return {
			l: 0,
			r: viewportWidth
		};
	}.bind(this));
};

module.exports = {
	Optimal: OptimalLayout,
	Folded: FoldedLayout,
	Mobile: MobileLayout,
}