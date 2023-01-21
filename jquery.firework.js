// varibles change in process
var max_rockets = 3;
var target_data = [0.25, 0.1, 0.75, 0.4];
var randomDirection = false;
var randomExplode = true;
var startCoorditionXratio = [0.6, 0.7]
var rocketsPer1Target = 12;
var countExistedRockets = 0;
var timeToShine = 500;

// varibles change with devices (for responsive)
var startVelocityY = 8;
var particleLightRadio = 8;
var rocketLightRadio = 30;
var plusParticles = 60;
var particleSpeedRatio = 20;
var particleGravity = 0.15;

function setTimeToShine(ms){
    timeToShine = ms;
}

function setParticleSpeed(n){
    particleSpeedRatio = n;
}

function setPlusParticles(n){
    plusParticles = n;
}

function offLauchRockets(){
    max_rockets = 0;
}

function onLauchRockets(n){
    max_rockets = n;
}

function setTartgetData(x1, y1, x2, y2){
    target_data[0] = x1;
    target_data[1] = y1;
    target_data[2] = x2;
    target_data[3] = y2;
}

function setStartX(xMin, xMax){
    startCoorditionXratio = [xMin, xMax];
}

function setRocketsPer1Target(n){
    rocketsPer1Target = n;
}

function resetCountRockets(){
    countExistedRockets = 0;
}

function checkLastRocketLaunch(){
    if (countExistedRockets >= rocketsPer1Target) {
        return true;
    }
    return false;
}

function setStartVelocity(n){
    startVelocityY = n;
}

function setLightRatio(n) {
    particleLightRadio = n;
}


//------------------------------------------------------------------
(function( $ ) {
    var MAX_ROCKETS = max_rockets,
        MAX_PARTICLES = 250;

    var FUNCTIONS = {
        'init': function(element) {
            var jqe = $(element);

            // Check this element isn't already inited
            if (jqe.data('fireworks_data') !== undefined) {
                console.log('Looks like this element is already inited!');
                return;
            }

            // Setup fireworks on this element
            var canvas = document.createElement('canvas'),
                canvas_buffer = document.createElement('canvas'),
                canvas_light = document.createElement('canvas'),
                data = {
                    'element': element,
                    'canvas': canvas,
                    'context': canvas.getContext('2d'),
                    'canvas_buffer': canvas_buffer,
                    'canvas_light': canvas_light,
                    'context_light': canvas_light.getContext('2d'),
                    'context_buffer': canvas_buffer.getContext('2d'),
                    'particles': [],
                    'rockets': [],
                    'lastLaunchTime': Date.now(),
                    'lastExploreTime': Date.now(),
                    'explodeNumber': 0,
                };

            // Add & position the canvas
            if (jqe.css('position') === 'static') {
                element.style.position = 'relative';
            }
            element.appendChild(canvas);
            canvas.style.position = 'absolute';
            canvas.style.top = '0px';
            canvas.style.bottom = '0px';
            canvas.style.left = '0px';
            canvas.style.right = '0px';
            canvas.style.zIndex = '3';

            // append light
            element.appendChild(canvas_light);
            canvas_light.style.position = 'absolute';
            canvas_light.style.top = '0px';
            canvas_light.style.bottom = '0px';
            canvas_light.style.left = '0px';
            canvas_light.style.right = '0px';
            canvas_light.style.zIndex = '1';
            // canvas_light.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; // test

            // Kickoff the loops
            data.interval = setInterval(loop.bind(this, data), 1000 / 50);

            // Save the data for later
            jqe.data('fireworks_data', data);
        },
        'destroy': function(element) {
            var jqe = $(element);

            // Check this element isn't already inited
            if (jqe.data('fireworks_data') === undefined) {
                console.log('Looks like this element is not yet inited!');
                return;
            }
            var data = jqe.data('fireworks_data');
            jqe.removeData('fireworks_data');

            // Stop the interval
            clearInterval(data.interval);

            // Remove the canvas
            data.canvas.remove();
            data.canvas_light.remove()

            // Reset the elements positioning
            data.element.style.position = '';
        }
    };

    $.fn.fireworks = function(action) {
        // Assume no action means we want to init
        if (!action) {
            action = 'init';
        }

        // Process each element
        this.each(function() {
            FUNCTIONS[action](this);
        });

        // Chaining ftw :)
        return this;
    };

    function launch(data) {
        if (data.rockets.length >= MAX_ROCKETS) {
            return;
        }

        if ((Date.now() - data.lastLaunchTime) < 400) {
            return;
        }

        var rocket = new Rocket(data);
            data.rockets.push(rocket);
            countExistedRockets += 1;
            data.lastLaunchTime = Date.now();

        if (countExistedRockets >= rocketsPer1Target) {
            offLauchRockets();
        }
    }

    function loop(data) {
        // Launch a new rocket
        MAX_ROCKETS = max_rockets;
        launch(data);

        // Update screen size
        if (data.canvas_width != data.element.offsetWidth) {
            data.canvas_width = data.canvas.width = data.canvas_buffer.width = data.canvas_light.width = data.element.offsetWidth;
        }
        if (data.canvas_height != data.element.offsetHeight) {
            data.canvas_height = data.canvas.height = data.canvas_buffer.height = data.canvas_light.height = data.element.offsetHeight;
        }

        // Fade the background out slowly
        data.context_buffer.clearRect(0, 0, data.canvas.width, data.canvas.height);
        data.context_buffer.globalAlpha = 0.9;
        data.context_buffer.drawImage(data.canvas, 0, 0);
        data.context.clearRect(0, 0, data.canvas.width, data.canvas.height);
        data.context.drawImage(data.canvas_buffer, 0, 0);
        data.context_light.clearRect(0, 0, data.canvas.width, data.canvas.height);

        // Update the rockets
        var existingRockets = [];
        data.rockets.forEach(function(rocket) {
            // update and render
            rocket.update();
            rocket.render(data.context, data.context_light);

            let checkOutOfX = ((rocket.pos.x < target_data[0]*data.canvas.width) || (rocket.pos.x > target_data[2]*data.canvas.width));
            if (!checkOutOfX) {rocket.didInOfX = true;}
            if (rocket.pos.y < data.canvas.height * rocket.randomExplodeY || rocket.vel.y >= 0 || (checkOutOfX && rocket.didInOfX)) {
                rocket.explode(data);
                
                document.getElementById('fireworkSound'+(data.explodeNumber%6)).play();
                data.explodeNumber += 1;

                data.element.style.backgroundColor = "hsla(" + rocket.explosionColor + ", 100%, 12%, 0.5)";
                data.lastExploreTime = Date.now();
            } else {
                existingRockets.push(rocket);
            }
        });
        data.rockets = existingRockets;

        // Update the particles
        var existingParticles = [];
        if (Date.now() - data.lastExploreTime > timeToShine) {
            data.element.style.backgroundColor = 'black';
        }
        data.particles.forEach(function(particle) {
            particle.update();

            // render and save particles that can be rendered
            if (particle.exists()) {
                particle.render(data.context, data.context_light);
                existingParticles.push(particle);
            }
        });
        data.particles = existingParticles;

        while (data.particles.length > MAX_PARTICLES) {
            data.particles.shift();
        }
    }

    function Particle(pos) {
        this.pos = {
            x: pos ? pos.x : 0,
            y: pos ? pos.y : 0
        };
        this.vel = {
            x: 0,
            y: 0
        };
        this.shrink = .97;
        this.size = 2;

        this.resistance = 1;
        this.gravity = 0;

        this.flick = false;

        this.alpha = 1;
        this.fade = 0;
        this.color = 0;
    }

    Particle.prototype.update = function() {
        // apply resistance
        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;

        // gravity down
        this.vel.y += this.gravity;

        // update position based on speed
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // shrink
        this.size *= this.shrink;

        // fade out
        this.alpha -= this.fade;
    };

    Particle.prototype.render = function(c, light) {
        if (!this.exists()) {
            return;
        }

        c.save();
        light.save()

        c.globalCompositeOperation = 'lighter';
        light.globalCompositeOperation = 'lighter';

        var x = this.pos.x,
            y = this.pos.y,
            r = this.size / 2;

        // c
        var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
        gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
        gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
        gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0)");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();

        //light
        var gradient_light = light.createRadialGradient(x, y, 0.1, x, y, r*particleLightRadio);
        gradient_light.addColorStop(0.1, "hsla(" + this.color + ", 100%, 50%, " + (this.alpha - 0.2) + ")");
        gradient_light.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + (this.alpha - 0.5) + ")");
        gradient_light.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0)");
        light.fillStyle = gradient_light;

        light.beginPath();
        light.arc(this.pos.x, this.pos.y, this.size*particleLightRadio, 0, Math.PI*2, true);
        light.closePath();
        light.fill();

        c.restore();
        light.restore();
    };

    Particle.prototype.exists = function() {
        return this.alpha >= 0.1 && this.size >= 1;
    };

    function Rocket(data) {
        let x_start_ratio = startCoorditionXratio[0] + Math.random()*(startCoorditionXratio[1] - startCoorditionXratio[0]),
            y_start_ratio = 1;
        Particle.apply(
            this,
            [{
                x: x_start_ratio * data.canvas.width, //* 2 / 3 + data.canvas.width / 6,
                y: y_start_ratio * data.canvas.height
            }]
        );
        let minAngular = 0,
            maxAngular = 0,
            ratioW_H = data.canvas.width/data.canvas.height;

        if (x_start_ratio > target_data[2]) {
            minAngular = Math.atan(((x_start_ratio-target_data[0]) / (1-target_data[3])) * (ratioW_H))
            maxAngular = Math.atan(((x_start_ratio-target_data[2]) / (1-target_data[1])) * (ratioW_H))
        }
        if ((x_start_ratio <= target_data[2]) && (x_start_ratio > target_data[0])) {
            minAngular = Math.atan(((x_start_ratio-target_data[0]) / (1-target_data[3])) * (ratioW_H))
            maxAngular = Math.atan(((x_start_ratio-target_data[2]) / (1-target_data[3])) * (ratioW_H))
        }
        if (x_start_ratio <= target_data[0]) {
            minAngular = Math.atan(((x_start_ratio-target_data[0]) / (1-target_data[1])) * (ratioW_H))
            maxAngular = Math.atan(((x_start_ratio-target_data[2]) / (1-target_data[3])) * (ratioW_H))
        }

        angularStartRatio = randomDirection ? Math.random() : ((countExistedRockets%3 + 0.5)/3);
        randomAngularStart = minAngular + angularStartRatio * (maxAngular - minAngular);

        // thay đổi góc bắn và tốc độ nà - vel. là velocity á =))
        this.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
        this.vel.y = -startVelocityY;
        this.vel.x = this.vel.y * Math.tan(randomAngularStart);
        this.size = 2;
        this.shrink = 1;
        this.gravity = 0.01;
        this.randomExplodeY = target_data[1] - 0.015 + Math.random() * ( target_data[3] -  target_data[1] + 0.03);
        this.didInOfX = false;
    }

    Rocket.prototype = new Particle();
    Rocket.prototype.constructor = Rocket;

    Rocket.prototype.explode = function(data) {
        var count = Math.random() * 10 + plusParticles;

        for (var i = 0; i < count; i++) {
            var particle = new Particle(this.pos);
            var angle = Math.random() * Math.PI * 2;

            // emulate 3D effect by using cosine and put more particles in the middle
            var speed = Math.cos(Math.random() * Math.PI / 2) * particleSpeedRatio;

            particle.vel.x = Math.cos(angle) * speed;
            particle.vel.y = Math.sin(angle) * speed;

            particle.size = 10;

            particle.gravity = particleGravity;
            particle.resistance = 0.92;
            particle.shrink = Math.random() * 0.05 + 0.93;

            particle.flick = true;
            particle.color = this.explosionColor;

            data.particles.push(particle);
        }
    };

    Rocket.prototype.render = function(c, light) {
        if (!this.exists()) {
            return;
        }

        c.save();
        light.save()

        c.globalCompositeOperation = 'lighter';
        light.globalCompositeOperation = 'lighter';

        var x = this.pos.x,
            y = this.pos.y,
            r = this.size / 2;

        //c
        var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
        gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
        gradient.addColorStop(1, "rgba(255, 180, 0, " + this.alpha + ")");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();

        //light
        var gradient_light = light.createRadialGradient(x, y, 0.1, x, y, r*rocketLightRadio);
        gradient_light.addColorStop(0.4, "rgba(255, 180, 0, " + (this.alpha - 0.2) + ")");
        gradient_light.addColorStop(0.8, "rgba(255, 180, 0, " + (this.alpha - 0.5) + ")");
        gradient_light.addColorStop(1, "rgba(255, 180, 0, 0)");
        light.fillStyle = gradient_light;

        light.beginPath();
        light.arc(this.pos.x, this.pos.y, this.size*rocketLightRadio, 0, Math.PI*2, true);
        light.closePath();
        light.fill();

        c.restore();
        light.restore();
    };
}(jQuery));