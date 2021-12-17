const textMessage = document.querySelector("#text-message");
const sendMessage = document.querySelector("#send-message");
var interval;

const getMessage = (roomId) => {
	const url = 'https://migrantfest.com/api/get/chat/' + roomId;
	fetch(url).then(function(response) {
	  return response.json();
	}).then(function(data) {
	 	let html = ``;
	 	data.forEach((value) => {
	 		html += 	`<div class="w-100 d-flex align-items-start mb-2">
									<div class="user-image">
										<img class="rounded-circle" src="page/user.jpg" width="20">
									</div>
									<div class="message ml-3">
										<span class="font-weight-bold m-0 mr-2">${value.name}</span>
										<span class="text-muted m-0">${value.message}</span>
									</div>
								</div>`

	 	});

	 	const chatBody = document.querySelector('.chat-body');
	 	chatBody.innerHTML = html;
	 	chatBody.scrollTo(0, chatBody.scrollHeight);
	}).catch(function() {
	  throw("Failed to get data");
	});
}

const refreshMessage = () => {
	clearInterval(interval);
	interval = setInterval(() => getMessage(roomId), 2000);
}

const sendingMessage = (userId, roomId, message) => {
	const sendMessage = document.querySelector('#send-message');
	const http = new XMLHttpRequest();
	const url = 'https://migrantfest.com/api/send/chat';
	const params = `userId=${userId}&roomId=${roomId}&message=${message}`;
	http.open('POST', url, true);

	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(params);
	sendMessage.disabled = false;
	refreshMessage();
}

textMessage.addEventListener('focus', function() {
	if(textMessage.value == '') {
		sendMessage.disabled = true;
	} else {
		sendMessage.disabled = false;
	}
});

textMessage.addEventListener('keyup', function(e) {
	if(textMessage.value == '') {
		sendMessage.disabled = true;
	} else {
		sendMessage.disabled = false;
	}

	if(e.keyCode == 13 && textMessage.value != '') {
		const message = textMessage.value;
		const roomId = findGetParameter('roomId');
		const userId = findGetParameter('userId');
		sendingMessage(userId, roomId, message);
		textMessage.value = '';
	}
})

sendMessage.addEventListener('click', function() {
	const message = textMessage.value;
	const roomId = findGetParameter('roomId');
	const userId = findGetParameter('userId');
	sendingMessage(userId, roomId, message);
	textMessage.value = '';
})

var roomId = findGetParameter('roomId');
interval = setInterval(() => getMessage(roomId), 2000);