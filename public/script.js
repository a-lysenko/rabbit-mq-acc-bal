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


    // hotel searchbar
    $('#get-hotels')
        .click(() => {
            const nameInput = $('#hotel-name');
            const descInput = $('#hotel-desc');
            const rateInput = $('#hotel-rate');

            const hotelFilter = {};
            updateFilter(hotelFilter, {
                name: 'name',
                value: nameInput.val()
            });
            updateFilter(hotelFilter, {
                name: 'desc',
                value: descInput.val()
            }, {
                includes: true
            });
            updateFilter(hotelFilter, {
                name: 'rate',
                value: rateInput.val()
            }, {
                type: 'number'
            });

            $.get('/get_hotels', {
                filter: hotelFilter
            })
                .done(updateSearchresults);

            function updateFilter(filter, item, options) {
                options = options || {};
                options.includes = options.includes || false;

                let value = item.value;

                if (options.type === 'number') {
                    value = parseInt(value) || 0;
                }

                if (value || options.letEmpty) {
                    filter[item.name] = {
                        value: item.value,
                        includes: options.includes
                    }
                }
            }

            function updateSearchresults(hotels) {
                updatedSearchresultsHeader(hotels.length);

                updateSearchresultsCollection(hotels);

                function updatedSearchresultsHeader(amountOfHotels) {
                    const headerNoFound = 'Nothing found';
                    const searchresultsHeader = $('#hotel-searchresults-amount-of-found');

                    const plrTail = (amountOfHotels === 1) ? '' : 's';

                    if (amountOfHotels) {
                        searchresultsHeader.text(`Found ${amountOfHotels} hotel${plrTail}`);
                    } else {
                        searchresultsHeader.text(headerNoFound);
                    }
                }

                function updateSearchresultsCollection(hotels) {
                    const collection = $('#hotel-searchresults-collection');
                    const itemTemplate = $('#template-collection #template-hotel-searchresults-item');

                    collection.empty();
                    hotels.forEach((hotel) => {
                        const item = itemTemplate.clone();
                        item.removeAttr('id');

                        fillHotelCard(item, hotel);

                        collection.append(item);
                    });

                    function fillHotelCard(hotelCard, hotel) {
                        const nameElem = hotelCard.find('[item-name]');
                        const descElem = hotelCard.find('[item-desc]');
                        const rateElem = hotelCard.find('[item-rate]');

                        nameElem.text(hotel.name);
                        descElem.text(hotel.description);

                        fillRate(rateElem, hotel.rate);

                        function fillRate(elem, rate) {
                            const rateElem = $(`#template-collection #template-rate [data-rate=${rate}]`);
                            if (rateElem) {
                                elem.empty();
                                elem.append(rateElem.clone());
                            }
                        }
                    }
                }
            }
        });


})();