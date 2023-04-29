$(document).ready(function(){
    document.getElementById("selectud").style.display = 'none';
    var user_id = document.getElementById("my-div").dataset.userId;
        $.ajax({
            url: `/api/v1/chats?chats_user__user_user__id=${user_id}`,
            method: "GET",
            success: function(data){
                if (data != ""){
                    document.getElementById("number_chat").innerText = "#" + data[0]["chats_id"];
                }
                else{
                    document.getElementById("selectud").style.display = 'block';
                }
            }
        });

    function get_messages(){
        $.ajax({
            url: `/api/v1/messages?messages_chat__chats_user__user_user__id=${user_id}`,
            method: "GET",
            success: function(data){
                var all_messages = "";
                data.forEach(element => {
                    if (document.getElementById(element["messages_id"])){

                    }
                    else{
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
                    }
                });
                $("#conversation").append(all_messages);
                document.getElementById("conversation").scrollTo(0, document.getElementById("conversation").scrollHeight);
            }
        });
    };
    
    setInterval(get_messages, 2000);

})

$(document).ready(function(){
    var send_but = document.getElementById("reply-send");
    /* $.ajax({
        url: `/api/v1/chats?chats_user__user_user__id=${user_id}`,
        method: "GET",
        success: function(data){
            chat = data;
            // alert(chat);
        }
    }) */
    
    var user_id = document.getElementById("my-div").dataset.userId;

    $.ajax({
        url: `/api/v1/user?user_user__id=${user_id}`,
        method: "GET",
        success: function(data){
            var users_id = data[0]["user_id"];
            document.getElementById("messages_user").value = String(users_id);
        }
    });

    send_but.addEventListener("click", function(){
        if(document.getElementById("selectud").value == "Выбор темы" && document.getElementById("number_chat").innerText == ""){
            new SnackBar({
                message: "Выберите тег проблемы выше",
                timeout: 5000,
                status: "error"
            });
        }
        else{
            if (document.getElementById("comment").value != ""){
                if (document.getElementById("comment").value.length > 500){
                    new SnackBar({
                        message: "Сообщение должно содержать не более 500 символов",
                        timeout: 5000,
                        status: "error"
                    });
                }
                document.getElementById("selectud").style.display = "none";
                $('#formas').submit();
            }
            else{
                new SnackBar({
                    message: "Введите сообщение перед отправкой",
                    timeout: 5000,
                    status: "error"
                });
            }
        }  
    })

    
    $("#formas").submit(function(event){
        event.preventDefault();
        var chat = document.getElementById("number_chat").innerText.substring(1);

        document.getElementById("messages_chat").value = chat;

        let cookie = document.cookie;
        let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

        if (chat == ""){
            $.ajax({
                url: `/api/v1/chats/`,
                method: "POST",
                headers: {
                    'X-CSRFToken': csrfToken
                },
                data: {
                    "chats_user": document.getElementById("messages_user").value,
                    "chats_teh": "873d4d1e-8168-43da-bac6-3ce784928b64",
                    "chats_tag": document.getElementById("selectud").value,
                },
                success: function(data){
                    var newTokenValue = data.csrf_token;
                    $('input[name="_csrf"]').val(newTokenValue);
                    document.getElementById("number_chat").innerText = "#" + data["chats_id"];
                    $('#formas').submit();
                    // window.location.replace("");
                }
            });
        }
        else{
            $.ajax({
                url: `/api/v1/messages/`,
                method: "POST",
                data: $(this).serialize(),
                success: function(data){
                    document.getElementById("comment").value = "";
                    // window.location.replace("");
                }
            });
        }
        

    });
});