function onDocumentReady() {
    //setInterval(updateM, 1000);
    document
      .getElementById('pangram')
      .addEventListener('pointerover', onHourPointerOver);
  }
  
  function onHourPointerOver(e) {
    console.log('Animate M');
  
    // Two keyframes: start and stop
    const keyframes = [
      { fontVariationSettings: '\'wght\' 0' },
      { fontVariationSettings: '\'wght\' 200' }
    ];
    // Set up some options so anim loops continuously
    const options = {
      iterations: Infinity,
      delay: 0,
      direction: 'alternate',
      duration: 4000,
      easing: 'ease-in-out'
    };
  
    let el = e.target;
  
    // Animate!
    let player = el.animate(keyframes, options);
  
    // Use this helper function to stop the animation
    handleStop(el, player);
  }
  /* 
  function onMinutePointerOver(e) {
    console.log('Animate M');
    const keyframes = [
      { fontVariationSettings: '\'wdth\' 200' },
      { fontVariationSettings: '\'wdth\' 1000' }
    ];
    const options = {
      duration: 200,
      easing: 'ease-in-out',
      fill: 'forwards' //  this makes keeps the last keyframe active when anim stops. See: https://developer.mozilla.org/en-US/docs/Web/API/EffectTiming/fill
    };
    let el = e.target;
    let player = el.animate(keyframes, options);
  }
  
  function onSecondPointerOver(e) {
    console.log('Animate second');
    const keyframes = [
      { fontVariationSettings: '\'wdth\' 200, \'wght\' 200' },
      { fontVariationSettings: '\'wdth\' 1000, \'wght\' 1000' }
    ];
    const options = {
      iterations: Infinity,
      delay: 100,
      direction: 'alternate',
      duration: 700,
      easing: 'ease-in-out'
    };
    let el = e.target;
    let player = el.animate(keyframes, options);
    handleStop(el, player);
  } */
  
  // Reusable function to stop animation when 'pointerout' happens on an element
  function handleStop(el, player) {
    el.addEventListener(
      'pointerout',
      () => {
        console.log('Stopping animation');
        player.cancel();
      },
      { once: true }
    );
  }
  /* 
  function updateM() {
    const now = new Date();
    document.getElementById('hour').innerText = now
      .getHours()
      .toString()
      .padStart(2, '0');
    document.getElementById('minute').innerText = now
      .getMinutes()
      .toString()
      .padStart(2, '0');
    document.getElementById('second').innerText = now
      .getSeconds()
      .toString()
      .padStart(2, '0');
  } */
  
  if (document.readyState != 'loading') {
    onDocumentReady();
  } else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
  }
  