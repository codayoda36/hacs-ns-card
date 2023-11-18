class NsStatusCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <div id="slider-container" class="slider-container"></div>
                <style>
                    .slider-container {
                        display: flex;
                        overflow-x: auto;
                        scrollbar-width: none;
                        -ms-overflow-style: none;
                        width: 100%;
                        scroll-snap-type: x mandatory;
                        white-space: nowrap;
                    }

                    .slider-container::-webkit-scrollbar {
                        display: none;
                    }

                    .ns_card {
                        flex: 0 0 auto;
                        margin-right: 8px;
                        background-color: #FEC919;
                        background-image: url('/local/community/hacs-ns-card/ns_card_bg.jpg');
                        background-size: cover;
                        color: #000;
                        scroll-snap-align: start;
                        width: 300px; /* Set the width of each card */
                    }

                    .ns_card_departure_platform {
                        position: absolute;
                        right: 10px;
                        top: 10px;
                    }

                    .ns_card_departure_platform span {
                        width: 100%;
                        font-size: 10px;
                        display: block;
                    }

                    .ns_card_departure_platform b {
                        font-size: 32px;
                        font-weight: 800;
                    }

                    .ns_card_departure_time span {
                        width: 100%;
                        font-size: 10px;
                        display: block;
                        line-height: 1.2;
                    }

                    .ns_card_departure_time b {
                        font-size: 18px;
                        font-weight: 700;
                    }

                    .ns_card_departure_time b i {
                        color: red;
                        font-style: normal;
                        font-weight: 800;
                    }

                    .ns_card_route {
                        margin-top: 4px;
                    }

                    .ns_card_route span {
                        width: 100%;
                        font-size: 10px;
                        display: block;
                        line-height: 1.2;
                    }

                    .ns_card_route b {
                        font-size: 18px;
                        font-weight: 700;
                        display: block;
                    }

                    .ns_card_transfers {
                        margin-top: 4px;
                    }

                    .ns_card_transfers span {
                        width: 100%;
                        font-size: 10px;
                        display: block;
                        line-height: 1.2;
                    }

                    .ns_card_transfers b {
                        font-size: 18px;
                        font-weight: 700;
                        display: block;
                    }

                    .ns_card_updated {
                        position: absolute;
                        bottom: 12px;
                        font-size: 12px;
                    }
                </style>
            `;
            this.content = this.querySelector('#slider-container');
        }

        const translations = {
            "en": {
                "depart": "Departs",
                "platform": "Platform",
                "route": "Route",
                "next": "Next",
                "updated": "Last updated at:",
                "minutes": "min",
                "seconds": "sec",
                "transfers": "Transfers"
            },
            "nl": {
                "depart": "Geldig op",
                "platform": "Perron",
                "route": "Enkele Reis",
                "next": "Volgende",
                "updated": "Laatst geüpdatet op:",
                "minutes": "minuten",
                "seconds": "seconden",
                "transfers": "Overstappen"
            }
        };

        const trips = Array.from({ length: 2 }, (_, i) => i + 1);

        this.content.innerHTML = trips.map((tripNumber) => {
            const tripAttributes = this.attributesForTrip(hass.states[this.config.entity].attributes, tripNumber);
            const delay = this.getDelay(tripAttributes);
            const translation = translations[hass.language] || translations["en"];

            return `
                <ha-card class="ns_card">
                    <div class="card-content">
                        <div class="ns_card_departure_time">
                            <span>${translation.depart} - Trip ${tripNumber}</span>
                            <b>${tripAttributes.departure_time_planned} <i>${delay}</i></b>
                        </div>

                        <div class="ns_card_departure_platform">
                            <span>${translation.platform}</span>
                            <b>${tripAttributes.departure_platform_actual}</b>
                        </div>

                        <div class="ns_card_route">
                            <span>${translation.route}</span>
                            <b>${tripAttributes.route[0]}</b>
                            <b>${tripAttributes.route[1]}</b>
                        </div>

                        <div class="ns_card_route">
                            <span>${translation.next} - ${tripAttributes.next_train}</span>
                        </div>
                        
                        <div class="ns_card_transfers">
                            <span>${translation.transfers} - ${tripAttributes.transfers}</span>
                        </div>

                        <div class="ns_card_updated">
                            <span>${translation.updated} ${tripAttributes.last_updated}</span>
                        </div>
                    </div>
                </ha-card>`;
        }).join('');

        this.content.style.scrollSnapType = 'x mandatory'; // Ensure correct slider behavior
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        this.config = config;
    }

    getCardSize() {
        return 3;
    }

    attributesForTrip(attributes, tripNumber) {
        return {
            departure_time_planned: attributes[`departure_time_planned_trip_${tripNumber}`],
            departure_platform_actual: attributes[`departure_platform_actual_trip_${tripNumber}`],
            route: attributes[`route_trip_${tripNumber}`],
            next_train: attributes[`next_train_trip_${tripNumber}`],
            transfers: attributes[`transfers_trip_${tripNumber}`],
            last_updated: attributes[`last_updated_trip_${tripNumber}`],
            departure_delay: attributes[`departure_delay_trip_${tripNumber}`]
        };
    }

    getDelay(attributes) {
        let delay = '';
        if (attributes.departure_delay == true) {
            const startTime = new Date('2013/10/09 ' + attributes.departure_time_planned);
            const endTime = new Date('2013/10/09 ' + attributes.departure_time_actual);
            const difference = endTime.getTime() - startTime.getTime();
            const delayTime = Math.round(difference / 60000);
            delay = '+' + delayTime;
        }
        return delay;
    }
}

customElements.define('ns-status-card', NsStatusCard);
