document.getElementById('demoSound').volume = 0;
document.getElementById('fireworkSound0').volume = 0.2;
document.getElementById('fireworkSound1').volume = 0.2;
document.getElementById('fireworkSound2').volume = 0.2;
document.getElementById('fireworkSound3').volume = 0.2;
document.getElementById('fireworkSound4').volume = 0.2;
document.getElementById('fireworkSound5').volume = 0.2;
document.getElementById('fireworkSound0').load();
document.getElementById('fireworkSound1').load();
document.getElementById('fireworkSound2').load();
document.getElementById('fireworkSound3').load();
document.getElementById('fireworkSound4').load();
document.getElementById('fireworkSound5').load();

var songVolume = 1;

async function startText(){
    let text1 = document.getElementById('text1'),
        text2 = document.getElementById('text2'),
        textBackground = document.getElementById('text-background');
    textBackground.style.zIndex = '10';

    textBackground.style.transition = '1s';
    textBackground.style.opacity = '1';
    text1.style.display = 'block';
    await sleep(1000);
    text1.style.animation = 'animateText 5s linear';
    
    await sleep(5100);
    textBackground.style.transition = '0';
    textBackground.style.opacity = '0';
    text1.style.display = 'none';
    text1.style.animation = 'none';

    var offSong = setInterval(function(){
        songVolume = songVolume - 0.01;
        console.log('sound');
        if (songVolume > 0) {
            document.getElementById('song').volume = songVolume;
        } else {
            document.getElementById('song').volume = 0;
            clearInterval(offSong);
        }
    }, 60)
    await sleep(1000);
    
    textBackground.style.transition = '1s';
    textBackground.style.opacity = '1';
    text2.style.display = 'block';
    await sleep(1000)
    text2.style.animation = 'animateText 5s linear';

    await sleep(5100);
    textBackground.style.transition = '0';
    textBackground.style.opacity = '0';
    text2.style.display = 'none';
    text2.style.animation = 'none';

    await sleep(2000);
    textBackground.style.zIndex = '0';
    $('div#neon-button-background').fadeIn(2000);
}