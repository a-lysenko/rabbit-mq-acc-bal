(() => {
        $('#send-message')
            .click(() => {
                const messageInput = $('#message');
                const messageToSend = messageInput.val();

                if (messageToSend) {
                    $.get('/new-one', {
                        message: messageToSend
                    })
                        .done((response) => {
                            const receivedMsg = response.msg;
                            writeSentMessageToCollection(messageToSend);
                            writeReceivedMessageToCollection(receivedMsg);

                            messageInput.val('');
                        });
                }
            });

        function writeSentMessageToCollection(msg) {
            writeMessageToCollection('#sent-messages-collection', msg);
        }

        function writeReceivedMessageToCollection(msg) {
            writeMessageToCollection('#received-messages-collection', msg);
        }

        function writeMessageToCollection(idElem, msg) {
            $(idElem)
                .append('<li></li>')
                .find('li:last-child')
                .text(msg);
        }


    })();