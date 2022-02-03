import '../assets/styles/index.less';
import Common from '../assets/common/common';
const audio = new Audio();
audio.src = require('../assets/media/winner.mp3');
// console.log(audio);
document.querySelector('main').addEventListener('mousedown', evt => {
    audio.play();
    console.log('play music');
});


console.log('hello, I am from index.js');
Common.sayHello();
