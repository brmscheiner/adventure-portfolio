
function randColor() {
    return color(random(255), random(255), random(255));
}

function createStandardObject(dist, offset) {
	return {
		age: 0,
		dist: dist,
		c: randColor(),
		offset: offset,
		selected: true
	};
}

function createCircle(dist, offset) {
	return _.extend(createStandardObject(dist, offset), {
        d: 15,
        drawFn: function(umbrella_diameter) {
	        fill(this.c);
	        this.age += 1;
	        ellipse(0.5 * (umbrella_diameter - this.dist), 0, this.d);
        }
	});
}

var calcRectDimension = function() {
    if (this.selected) {
        if (this.age < 300) {
            this.lastSize = 0;
            return 0;
        } else if (this.lastSize < 10) {
            this.lastSize = (this.age - 300)/20;
            return (this.age - 300)/20;
        } else {
            return this.lastSize;
        }
    } else {
        return this.lastSize;
    }
}

function createRectangle(dist, offset) {
	return _.extend(createStandardObject(dist, offset), {
        w: calcRectDimension,
        h: calcRectDimension,
        drawFn: function(umbrella_diameter) {
        	fill(this.c);
        	this.age += 1;
        	rect(0.5 * (umbrella_diameter - this.dist), 0, this.w(), this.h());
        }
    })
}

