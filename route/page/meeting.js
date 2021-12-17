let localStream;
let socket = io();
let peerConnections = {}
localVideo = document.getElementById('video');

navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(function (stream) {
    localStream = stream;
    getOrCreateVideo(socket.id, stream, true)
    socket.emit("room", getRoomKey());
})

socket.on("startPeering", function (sockets) {
    for (let i = 0; i < sockets.length; i++) {
    		if(i < 100) {
    			const peerConnection = getOrCreatePeering(sockets[i]);
	        peerConnection.createOffer().then(function (description) {
	            peerConnection.setLocalDescription(description).then(function () {
	                socket.emit("sdp", sockets[i], peerConnection.localDescription);
	            });
	        });
    		}
    }
})

socket.on("deletePeering", function (socketId) {
    deletePeering(socketId)
    deleteVideo(socketId)
})

socket.on('sdp', function (fromSocket, data) {
    const peerConnection = getOrCreatePeering(fromSocket);
    peerConnection.setRemoteDescription(new RTCSessionDescription(data)).then(function () {
        if (data.type === "offer") {
            peerConnection.createAnswer().then(function (description) {
                peerConnection.setLocalDescription(description).then(function () {
                    socket.emit("sdp", fromSocket, peerConnection.localDescription)
                });
            });
        }
    })
});

socket.on('ice', function (fromSocket, data) {
    const peerConnection = getOrCreatePeering(fromSocket);
    peerConnection.addIceCandidate(new RTCIceCandidate(data));
});

function deletePeering(socketId) {
    delete peerConnections[socketId]
}

function getOrCreatePeering(socketId) {
    if (peerConnections[socketId] == null) {
        let peerConnection = peerConnections[socketId];
        if (peerConnection == null) {
            peerConnection = new RTCPeerConnection({'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]});
            peerConnection.addStream(localStream);
            peerConnection.ontrack = function (event) {
                getOrCreateVideo(socketId, event.streams[0], false)
            }
            peerConnection.onicecandidate = function (event) {
                if (event.candidate != null) {
                    socket.emit("ice", socketId, event.candidate);
                }
            };
            peerConnections[socketId] = peerConnection;
            return peerConnection;
        }
    } else {
        return peerConnections[socketId]
    }
}

function getRoomKey() {
    return new URLSearchParams(window.location.search).get("key");
}

function getOrCreateVideo(socketId, stream, isMuted) {
    let socketVideo = document.getElementById("video-" + socketId);
    if (socketVideo == null) {
        socketVideo = document.createElement("video");
        let videoContainer = document.getElementById("participant-container");
        let userThumbnailLength = document.querySelectorAll('.user-thumbnail').length;
        let videoItemLength = document.querySelectorAll('.user-thumbnail video').length;

        socketVideo.id = ("video-" + socketId)
        socketVideo.autoplay = true;
        socketVideo.muted = isMuted;
        socketVideo.className = 'w-100 h-100'
        //video div
        var videoItem = document.createElement("div");
        videoItem.className="user-thumbnail flex-fill";
        videoItem.appendChild(socketVideo);
        videoContainer.replaceChild(videoItem, videoContainer.childNodes[videoItemLength]);

        videoContainer.removeChild(videoContainer.childNodes[userThumbnailLength - 1])
        //video div
    }
    socketVideo.srcObject = stream;
}

function deleteVideo(socketId) {
    let socketVideo = document.getElementById("video-" + socketId);
    socketVideo.parentNode.removeChild(socketVideo);
    onVideoCountChange()
}