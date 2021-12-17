const youtubeId = findGetParameter('youtubeId');
const zoomLink = findGetParameter('zoomLink');
document.querySelector('body').style.backgroundImage = `url('page/${roomId}.jpg')`
document.querySelector('iframe').src = 'https://youtube.com/embed/' + youtubeId;


document.querySelector('#joinzoom').href = zoomLink;