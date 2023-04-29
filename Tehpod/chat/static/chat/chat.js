$(document).ready(function(){
    function get_chat(){
        $.ajax({
            url: `/api/v1/chats/`,
            method: "GET",
            success: function(data){
                var all_chats = "";
                var all_chat = [];
                data.forEach(element => {
                    if (document.getElementById(element["chats_id"])){
                        all_chat.push(parseInt(element["chats_id"]));
                    }
                    else{
                        all_chats += `<div class="row sideBar-body" id="${element['chats_id']}">`;
                        all_chats += `<div class="col-sm-9 col-xs-9 sideBar-main">`;
                        all_chats += `<div class="row">`;
                        all_chats += `<div class="col-sm-8 col-xs-8 sideBar-name">`;
                        all_chats += `<span class="name-meta">`;
                        all_chats += `#${element["chats_id"]}`;
                        all_chats += `</span>`;
                        all_chats += `<span id="tags-2">`;
                        all_chats += `${element["chats_tag"]}`;
                        all_chats += `</span>`;
                        all_chats += `<span class="label label-danger" id="number_read"></span>`;
                        all_chats += `</div>`;
                        all_chats += `</div>`;
                        all_chats += `</div>`;
                        all_chats += `</div>`;
                    }
                });
                $("#chats").append(all_chats);
                divs = document.querySelectorAll(".sideBar-body");
                divs.forEach(element => {
                    if (all_chat.indexOf(parseInt(element.id)) == -1){
                        element.addEventListener("click", function(event){
                            var chat_id = element.id;
                            history.pushState(null, null, `?chat_id=${chat_id}`);
                            window.dispatchEvent(new Event("popstate"));
                        });
                    }
                });
            }
        });
    };

    setInterval(get_chat, 2000);
});

$(document).ready(function(){
    function send_message(){
        let cookie = document.cookie
        let csrfToken = cookie.substring(cookie.indexOf('=') + 1)

        var number_chat = new URLSearchParams(window.location.search).get("chat_id");
        if (document.getElementById("comment").value !=  ""){
            if (document.getElementById("comment").value.length > 500){
                new SnackBar({
                    message: "Сообщение должно содержать не более 500 символов",
                    timeout: 5000,
                    status: "error"
                });
            }
            $.ajax({
                url: `/api/v1/messages/`,
                method: "POST",
                headers: {
                    'X-CSRFToken': csrfToken
                },
                data: {
                    "messages_text": document.getElementById("comment").value,
                    "messages_user": "78dcfda2-93c5-466b-a3b8-ee390d8bfbdf",
                    "messages_chat": number_chat, 
                },
                success: function(data){
                    document.getElementById("comment").value = "";
                    var newTokenValue = data.csrf_token;
                    $('input[name="_csrf"]').val(newTokenValue);
                }
            });
        }
        else{
            new SnackBar({
                message: "Введите сообщение перед отправкой",
                timeout: 5000,
                status: "error"
            });
        }
    };

    document.getElementById("send").addEventListener("click", function(){
        send_message();
    });

});

$(document).ready(function(){
    var user_id = document.getElementById("my-div").dataset.userId;
    function get_chat_messages(chat_id){
        var chats_id = chat_id.substring(0, chat_id.length-2);
        $.ajax({
            url: `/api/v1/messages/?messages_chat__chats_id=${chats_id}`,
            method: "GET",
            success: function(data){
                var all_messages = "";
                chat = document.getElementById(chats_id);
                chat.querySelector("#number_read").innerText = "";
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if (document.getElementById(element["messages_id"])){

                    }
                    else{
                        if (element["messages_read"] == false){
                            let cookie = document.cookie;
                            let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
                            $.ajax({
                                url: `/api/v1/messages/${element["messages_id"]}/`,
                                method: "PATCH",
                                headers: {
                                    'X-CSRFToken': csrfToken
                                },
                                data: {
                                    "messages_read": true,
                                },
                                success: function(data){
                                    var newTokenValue = data.csrf_token;
                                    $('input[name="_csrf"]').val(newTokenValue);
                                }
                            });
                        }
                        if (element["messages_user"]["user_user"]["id"] == user_id){
                            all_messages += `<div class="row message-body">`;
                            all_messages += `<div class="col-sm-12 message-main-sender">`;
                            all_messages += `<div class="sender">`;
                            all_messages += `<div class="message-text" id="${element['messages_id']}">`;
                            all_messages += `${element["messages_text"].replace(/\n/g, "<br>")}`;
                            all_messages += `</div>`;
                            all_messages += `</div>`;
                            all_messages += `</div>`;
                            all_messages += `</div>`;
                        }
                        else{
                            all_messages += `<div class="row message-body">`;
                            all_messages += `<div class="col-sm-12 message-main-receiver">`;
                            all_messages += `<div class="receiver">`;
                            all_messages += `<div class="message-text" id="${element['messages_id']}">`;
                            all_messages += `${element["messages_text"].replace(/\n/g, "<br>")}`;
                            all_messages += `</div>`;
                            all_messages += `</div>`;
                            all_messages += `</div>`;
                            all_messages += `</div>`;
                        }
                        /* if (index != data.length-1){
                            all_messages += `<br>`
                        } */
                    }
                };

                if (all_messages != ""){
                    $(`#${chat_id}`).append(all_messages);
                    if (document.getElementById(chat_id)){
                        document.getElementById(chat_id).scrollTo(0, document.getElementById(chat_id).scrollHeight);
                    }
                }
            }
        });
    };

    var chater;
    var chat_id_old = "conversation";
    window.addEventListener("popstate", function(){
        document.getElementById("chat-name").innerText = "#" + new URLSearchParams(window.location.search).get('chat_id');
        var chatsd = document.getElementById(new URLSearchParams(window.location.search).get('chat_id'));
        document.getElementById("tags-1").innerText = chatsd.querySelector("#tags-2").innerText;

        var chat_id = new URLSearchParams(window.location.search).get('chat_id') + "_1";
        if (!chater){
            $(`#${chat_id_old}`).attr("id", `${chat_id}`);
            chat_id_old = chat_id;
            chater = setInterval(get_chat_messages.bind(null, chat_id), 2000);
        }
        else{
            //this.alert(chater);
            clearInterval(chater);
            $(`#${chat_id_old}`).attr("id", `${chat_id}`);
            chat_id_old = chat_id;
            document.getElementById(`${chat_id}`).innerHTML = "";
            chater = setInterval(get_chat_messages.bind(null, chat_id), 2000);
        }
    });
});

$(document).ready(function(){
    function get_all_chat_messages(){
        $.ajax({
            url: `/api/v1/messages/?messages_read=false`,
            method: "GET",
            success: function(data){
                unread = {};
                data.forEach(element => {
                    if (unread.hasOwnProperty(element["messages_chat"]["chats_id"])){
                        unread[element["messages_chat"]["chats_id"]] = unread[element["messages_chat"]["chats_id"]] + 1;
                    }
                    else{
                        unread[element["messages_chat"]["chats_id"]] = 1;
                    }
                });
                for (var key in unread){
                    if (unread.hasOwnProperty(key)){
                        var num = unread[key];
                        var number_chat = new URLSearchParams(window.location.search).get("chat_id")
                        if (number_chat != key){
                            chat = document.getElementById(key);
                            chat.querySelector("#number_read").innerText = num;
                        }
                    }
                }
            }
        });
    }

    setInterval(get_all_chat_messages, 2000);
});

$(document).ready(function(){
    var search = document.getElementById("searchText");
    search.addEventListener("input", function(){
        var search_text = document.getElementById("searchText").value;
        var chat_filter = document.querySelectorAll(".sideBar-body");
        chat_filter.forEach(element => {
            if (element.querySelector("#tags-2").innerText.toLowerCase().startsWith(search_text.toLowerCase())){
                element.style.display = "block";
            }
            else{
                element.style.display = "none";
            }
        });
    });
});