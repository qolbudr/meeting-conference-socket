const youtubeId = findGetParameter('youtubeId');
const zoomLink = findGetParameter('zoomLink');
document.querySelector('body').style.backgroundImage = `url('page/${roomId}.jpg')`
document.querySelector('iframe').src = 'https://youtube.com/embed/' + youtubeId;


document.querySelector('#joinzoom').href = zoomLink;

function toggleFullScreen() {
   var doc = window.document;
   var docEl = doc.documentElement;

   var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
   var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

   if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
       requestFullScreen.call(docEl);
   }
   else {
       cancelFullScreen.call(doc);
   }
}

const radioSession = document.querySelectorAll('[name=session-condition]');
const radioReason = document.querySelectorAll('[name=reason]');
const nextEventText = document.querySelector('#next-event-text') 
const btnNextReason = document.querySelector('#next-reason');
const btnNextEvent = document.querySelector('#next-event');
const btnFinish = document.querySelector('#finish-feedback');
var feedback = {};

radioSession.forEach((radio) => {
    radio.addEventListener('change', () => {
        for (var i = 0; i < radioSession.length; i++) {
          if (radioSession[i].checked) {
            btnNextReason.disabled = false
            break;
          }
        }
    })           
})

btnNextReason.addEventListener('click', () => {
    const radioSessionChecked = document.querySelector('[name=session-condition]:checked');
    feedback.first = radioSessionChecked.value;
    console.log(feedback);            
})

radioReason.forEach((radio) => {
    radio.addEventListener('change', () => {
        for (var i = 0; i < radioReason.length; i++) {
          if (radioReason[i].checked) {
            btnNextEvent.disabled = false
            break;
          }
        }
    })           
})

btnNextEvent.addEventListener('click', () => {
    const radioReasonChecked = document.querySelector('[name=reason]:checked');
    feedback.second = radioReasonChecked.value;
    console.log(feedback);            
})

nextEventText.addEventListener('keyup', () => {
    if(nextEventText.value) {
        btnFinish.disabled = false;
    } else {
        btnFinish.disabled = true;
    }
})

btnFinish.addEventListener('click', () => {
    feedback.third = nextEventText.value;
    const roomId = findGetParameter('roomId');
    const userId = findGetParameter('userId');

    const http = new XMLHttpRequest();
    const url = 'https://migrantfest.com/api/insert/feedback';
    const params = `userId=${userId}&roomId=${roomId}&first=${feedback.first}&second=${feedback.second}&third=${feedback.third}`;
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            window.location = 'https://migrantfest.com/frame'
        }
    }
    http.send(params);
})