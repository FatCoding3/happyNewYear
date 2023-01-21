// construct timer
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// construct element with id
var elementGlass = document.getElementById('glass'),
    elementButtonBackground = document.getElementById('neon-button-background'),
    elementButton = document.getElementById('neon-button'),
    elementWishBackground = document.getElementById('wish-background'),
    elementLastWish = document.getElementById('lastWish'),
    elementSong = document.getElementById('song'),
    contents = new Array(3);

for (let i = 1; i < 4; i++){
    contents[i-1] = document.getElementById('content' + i);
}

var startPositions = [[0.7, 0.8], [0.3, 0.4], [0.65, 0.75]];
var timeout = [5000, 4000, 4000]

// needed varibles
var viewWidth = window.innerWidth,
    viewHeight = window.innerHeight;

setInterval(function() {
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;
}, 1000/50)

var rocketsResponsive = 9;
console.log(viewWidth, viewHeight)

// responsive varibles
var thisStartVelocity = 8,
    thisParticleSpeed = 20;
    thisPlusParticles = 60;

// responsive
if (viewWidth < 400) {
    thisStartVelocity = viewHeight/100;
    thisParticleSpeed = 15;
    thisPlusParticles = 40;
}

//start
async function startProcess(){
    // neon button animation start
    afterClick('neon-button', 'neon-button-background');
    document.getElementById('demoSound').play();

    await sleep(3000);
    elementSong.volume = 1;
    elementSong.play();
    await sleep(2900);
    
    elementButtonBackground.style.display = 'none';
    elementButton.style.animation = 'none';

    // start firework and show wishes
    elementGlass.style.display = 'block';
    
    await sleep(2000);
    setTimeout(function() {
        $('div#purdah').fireworks();
    });

    elementWishBackground.style.display = 'block';
    setRocketsPer1Target(rocketsResponsive);

    setStartVelocity(thisStartVelocity);
    setParticleSpeed(thisParticleSpeed);
    setPlusParticles(thisPlusParticles)

    for (let i = 0; i < 3; i++){
        setStartX(startPositions[i][0], startPositions[i][1]);
        shootTarget(contents[i]);
        while (!checkLastRocketLaunch()) {
            await sleep(100);
        }
        await sleep(timeout[i]);
        $('div#content'+(i+1)).fadeOut(400);
        await sleep(1000);
    }
    
    // last wish
    await sleep(1000);
    document.getElementById('lastWish').style.display = 'block';
    resetCountRockets();
    //set data of this fire
    setRocketsPer1Target(1);
    setStartX(0.5, 0.5);
    setTartgetData(0.5, 0.28, 0.5, 0.28);
    setStartVelocity(thisStartVelocity/1.5);
    setLightRatio(20);
    setParticleSpeed(thisParticleSpeed*1.5);
    setPlusParticles(thisPlusParticles*2);
    setTimeToShine(900);
    //launch
    onLauchRockets(1);

    await sleep(8000);
    //stop fire and reset data
    setLightRatio(8);
    setParticleSpeed(thisParticleSpeed);
    setStartVelocity(thisStartVelocity);
    setPlusParticles(plusParticles);
    setTimeToShine(500);
    document.getElementById('lastWish').style.display = 'none';
    $('div#purdah').fireworks('destroy');

    startText();
}
function shootTarget(target){
    target.style.display = 'block';

    let x1 = target.offsetLeft/viewWidth,
        y1 = target.offsetTop/viewHeight,
        x2 = x1 + target.offsetWidth/viewWidth,
        y2 = (viewWidth < 300) ? y1 - target.offsetHeight/viewHeight : y1 + target.offsetHeight/viewHeight;

    setTartgetData(x1, y1, x2, y2);
    resetCountRockets();   
    onLauchRockets(3);
}
