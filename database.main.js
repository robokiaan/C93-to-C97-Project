var firebaseConfig = {
    apiKey: "AIzaSyBEFA6a4BbFufvXu24-SFbhCffqs3pLYGE",
    authDomain: "class-test-e4f29.firebaseapp.com",
    databaseURL: "https://class-test-e4f29.firebaseio.com",
    projectId: "class-test-e4f29",
    storageBucket: "class-test-e4f29.appspot.com",
    messagingSenderId: "1083795062711",
    appId: "1:1083795062711:web:747789451f02afdee67232"
}
firebase.initializeApp(firebaseConfig)

var username = null
var group_names_array = []
var room_name = null;
var selected_roomname

$(document).ready(function () {
    $(`#username`).focus()
    hide_all_screens()
    $(`.login-screen`).show()
})

function add_User() {
    username = $(`#username`).val()
    hide_all_screens()
    $(`.select-room-screen`).show()
    $(`#greeting`).text(`Welcome ${username}!!!`)
    get_Data()
}

function hide_all_screens() {
    $(`.screen`).hide()
}

function add_room() {
    room_name = jQuery('#room_name').val()

    if (room_name.toString().includes('"')) {
        window.alert('room name cannot include the character "')
    } else {
        firebase.database().ref('/').child(room_name).update({
            purpose: 'unidentified'
        })

        hide_all_screens()
        jQuery('#room_screen').show()
    }
}

function get_Data() {
    firebase.database().ref('/').on('value', function (snapshot) { //on data change
        jQuery('.trending-rooms-list').html('')
        snapshot.forEach(function (childSnapshot) {
            var ROOMnAME = childSnapshot.key
            jQuery('.trending-rooms-list').append(`
                <li id="${ROOMnAME}" onclick="redriectToRoomName(this.id)">#${ROOMnAME}</li>
            `)
        })
    })
}

function redriectToRoomName(name) {
    selected_roomname = name
    hide_all_screens()
    jQuery('.kwitter_screen').show()
    getData()
}

function logout() {
    hide_all_screens()
    jQuery('.login-screen').show()
}

function sendMessage() {
    var msg = jQuery('#msg').val()
    firebase.database().ref(selected_roomname).push({
        name: username,
        message: msg,
        likes: 0,
        dislikes: 0,
    })
    jQuery('#msg').val('')
    getData()
}

function getData() {
    firebase.database().ref('/' + selected_roomname).on('value', function (snapshot) {
        jQuery('#messages-list').html('')
        snapshot.forEach(function (childSnapshot) {
            var childkey = childSnapshot.key
            var childData = childSnapshot.val()
            if (childkey != 'purpose') {
                var firebase_message_id = childkey
                var messageData = childData
                jQuery('#messages-list').append(`
                <li>
                    <div class='message'>
                        <h3>${messageData.name}</h3>
                        <h5>${messageData.message}</h5>
                        <button id='${firebase_message_id}like' onclick='like(this.id)' type='submit' class='btn btn-success btn-sm btn-block'>Likes: ${messageData.likes}</button>
                        <button id='${firebase_message_id}dislike' onclick='dislike(this.id)' type='submit' class='btn btn-success btn-sm btn-block'>Dislikes: ${messageData.dislikes}</button>
                    </div>
                </li>
            `)
            }
        })
    })
}

function like(username) {
    name = username.toString().substring(-4)
    var likes_text = jQuery('#' + name + 'like').text()
    var likes_total = likes_text.toString().substring(7)
    firebase.database().ref(selected_roomname).child(name).update({
        likes: Number(likes_total) + 1
    })
    jQuery('#' + name + 'like').text(likes_total)
}

function dislike(username) {
    name = username.toString().substring(-7)
    var dislikes_text = jQuery('#' + name + 'dislike').text()
    var dislikes_total = dislikes_text.toString().substring(10)
    firebase.database().ref(selected_roomname).child(name).update({
        dislikes: Number(dislikes_total) + 1
    })
    jQuery('#' + name + 'dislike').text(dislikes_total) 
}