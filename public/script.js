(() => {
    // getHotels();
    showDefaultHotelCard();
    hideNewHotelForm(false);

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
        .click(getHotels);

    function getHotels() {
        const nameInput = $('#hotel-name');
        const descInput = $('#hotel-desc');
        const rateInput = $('#hotel-rate');

        const hotelFilter = {};
        updateFilter(hotelFilter, {
            name: 'name',
            value: nameInput.val()
        });
        updateFilter(hotelFilter, {
            name: 'description',
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

        $.get('/get_hotels', hotelFilter)
            .done(updateSearchresults)
            .done(getRates);

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

        function updateSearchresults({data: hotels}) {
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
                    item.attr('item', hotel._id);

                    fillHotelCard(item, hotel);

                    collection.append(item);
                });

                function fillHotelCard(hotelCard, hotel) {
                    const nameElem = hotelCard.find('[item-name]');
                    const descElem = hotelCard.find('[item-desc]');
                    const detailsBtnElem = hotelCard.find('[item-id]');

                    nameElem.text(hotel.name);
                    descElem.text(hotel.description);

                    detailsBtnElem.attr('item-id', hotel._id);
                    detailsBtnElem.click((event) => {
                        const itemId = $(event.target).attr('item-id');
                        getHotel(itemId);
                    });
                }
            }
        }

        function getRates({data: hotels}) {
            const hotelIdBatch = hotels.map((hotel) => {
                return hotel._id;
            });

            $.get('/get_rate', {
                idBatch: hotelIdBatch
            })
                .done(updateHotelRates);

            function updateHotelRates({data: rateMap}) {

                // // TODO - NOTE: test
                // if (rateMap.time) {
                //     console.info('rateMap.time', rateMap.time);
                //     delete rateMap.time;
                // }

                const collection = $('#hotel-searchresults-collection');
                Object.keys(rateMap)
                    .forEach((hotelId) => {
                        const rateElem = collection.find(`[item=${hotelId}] [item-rate]`);

                        fillRate(rateElem, rateMap[hotelId]);
                    });
            }
        }
    }

    function getHotel(id) {
        $.get(`/get_hotel/${id}`)
            .done(updateCard);

        function updateCard({data: hotel}) {
            if (hotel._id) {
                showHotelCard();
                showHotel(hotel);
            } else {
                showDefaultHotelCard();
            }

            function showHotel(hotel) {
                const hotelCard = $('#hotel-card-wrapper');

                const nameElem = hotelCard.find('[hotel-name]');
                const descElem = hotelCard.find('[hotel-desc]');
                const rateElem = hotelCard.find('[hotel-rate]');
                const idElem = hotelCard.find('[hotel-id]');

                nameElem.text(hotel.name);
                descElem.text(hotel.description);

                fillRate(rateElem, hotel.rate);

                idElem.text(hotel._id);
                idElem.attr('hotel-id', hotel._id);
            }
        }
    }

    function showDefaultHotelCard() {
        $('#hotel-card-wrapper').hide();
        $('#hotel-card-no-hotel').show();
    }

    function showHotelCard() {
        $('#hotel-card-wrapper').show();
        $('#hotel-card-no-hotel').hide();
    }

    function fillRate(elem, rate) {
        const rateElem = $(`#template-collection #template-rate [data-rate=${rate}]`);
        if (rateElem) {
            elem.empty();
            elem.append(rateElem.clone());
        }
    }

    $('#create-hotel-create-btn')
        .click(showNewHotelForm);

    $('#new-hotel-create-btn')
        .click(createNewHotel);

    $('#new-hotel-cancel-btn')
        .click(hideNewHotelForm);

    function hideNewHotelForm(animate = true) {
        if (animate) {
            $('#new-hotel-wrapper').slideUp();
        } else {
            $('#new-hotel-wrapper').hide();
        }
    }

    function showNewHotelForm() {
        $('#new-hotel-wrapper').slideDown();
    }

    function clearNewHotelForm() {
        $('#new-hotel-name').val('');
        $('#new-hotel-desc').val('');
    }

    function createNewHotel() {
        const name = $('#new-hotel-name').val();
        const description = $('#new-hotel-desc').val();
        const rate = 1;

        $.post('/add_hotel', {
            name,
            description,
            rate
        })
            .done(() => {
                hideNewHotelForm();
                clearNewHotelForm();
            });
    }
})();