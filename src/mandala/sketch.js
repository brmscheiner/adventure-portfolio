var umbrellas = [];
var growth_rate = 2; 
var slices = 10; // the number of symmetric slices in each mandala 
var bg = [0,0,0];
var steps = 0;

var total_shapes = 0;
var shape_limit = 2000/slices;
var umbrella_limit = 2;
var d_limit = 660;

function setup() {        
     createCanvas(window.innerWidth, window.innerHeight);  
     stroke(0); 
     strokeWeight(0);
     frameRate(50);
     background(bg);
     fill(100,100,100);  
     rectMode(CENTER);
}

function drawSlice(u) {
    u.shapes.forEach(function(shape) {
        push();
        rotate(shape.offset);
        shape.drawFn(u.d);
        pop();
        push();
        rotate(-shape.offset);
        shape.drawFn(u.d);
        pop();
    });
}

function drawUmbrella(u) {
    fill(u.c);
    ellipse(0, 0, u.d);
    for (i=0; i<=slices; i++) {
        push();
        rotate((i/slices) * 2 * PI);
        drawSlice(u);
        pop();
    }
}

function absmax(a, b) {
    return Math.abs(a) > Math.abs(b) ? a : b;
}

function mousePressed() {
    umbrellas.push({
        x: mouseX,
        y: mouseY,
        d: 0,
        c: randColor(),
        growth_rate: growth_rate,
        death_rate: null,
        shapes: [],
        rotation: absmax(random(-0.02, 0.02), random(-0.02, 0.02)),
        selected: true
    });
}

function mouseReleased() {
    umbrellas.forEach(function(u) {
        if (u.selected) {
            u.selected = false;
            u.shapes.forEach(function(shape) {
                shape.selected = false;
            });
        }
    });
}

function cleanup() {
    var pruned_umbrellas = []
    umbrellas.forEach(function(u, i) {
        if (u.death_rate) {
            u.d -= u.death_rate;
        }
        if (u.d > 0) {
            pruned_umbrellas.push(u);
        }
    });
    umbrellas = pruned_umbrellas;

    if (total_shapes > shape_limit) {
        var victim = _.sample(umbrellas);
        victim.shapes = _.drop(victim.shapes, total_shapes - shape_limit);
        total_shapes = shape_limit;
    };
    if (umbrellas.length > umbrella_limit) {
        umbrellas[0].death_rate = growth_rate;
        if (umbrellas[0].d < 0) {
            umbrellas = _.drop(umbrellas);
        };
    };
}

function draw() {
    //background(bg);
    var radians_per_slice = 2 * PI / slices;
    umbrellas.forEach(function(u) {
        if (u.selected) {
            var offset;
            if (random() > 0.5) {
                offset = random(radians_per_slice/2);
            } else {
                offset = 0;
            }
            if (u.d < d_limit) {
            	u.d += u.growth_rate;
            } else {
            	u.death_rate = u.growth_rate;
            }
            if (u.d % 4 === 0) {
                u.shapes.push(createCircle(u.d, offset));
                total_shapes += 1;
            }
            if (u.d % 7 === 0) {
                u.shapes.push(createRectangle(u.d, offset));
                total_shapes += 1;
            }
        }
        push();
            translate(u.x, u.y);
            rotate(frameCount * u.rotation);
            drawUmbrella(u);
        pop();
    });
    cleanup();
    steps += 1;
}














