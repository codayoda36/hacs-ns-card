class SlideshowCard extends HTMLElement {
  set hass(hass) {
      this.entityId = this.config.entity;
      this.state = hass.states[this.entityId];
      this.testattributes = this.state.attributes;
      
      // Check if testattributes is defined before triggering a render
      if (this.testattributes) {
            this.render();
      }
  }

  constructor() {
    super();
    this.currentIndex = 0;
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  connectedCallback() {
    this.addEventListener('click', this.handleButtonClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleButtonClick);
  }

  // Render the slideshow
  render() {
    if (!this.testattributes) {
        this.innerHTML = '';
        return;
    }
    
    const lastUpdatedString = this.testattributes['last_updated'];
    const lastUpdatedTime = new Date(lastUpdatedString);
    const currentTime = new Date();

    const timeDifference = Math.floor((currentTime - lastUpdatedTime) / (1000 * 60));
    const updatedText = `${timeDifference} minutes ago`;
    
    const plannedDepartureTime = this.testattributes[`departure_time_planned_trip_${this.currentIndex + 1}`];
    const departureDelay = this.testattributes[`departure_delay_trip_${this.currentIndex + 1}`];

    let delayText = ''; // Initialize an empty string

    if (departureDelay > 0) {
        delayText = `<i>+${departureDelay}</i>`;
    }

    this.innerHTML = `
      <style>
        :host {
          --arrow-size: 10px; /* Adjust the arrow size as needed */
        }

        .slideshow {
          position: relative;
        }

        .arrow-container {
          display: flex;
          justify-content: center;
          position: absolute;
          bottom: 10px;
          width: 100%;
        }

        .arrow {
          font-size: var(--arrow-size);
          cursor: pointer;
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 10px;
          border: none;
          margin: 5px;
        }

        #prevBtn {
          margin-right: 5px;
        }

        #nextBtn {
          margin-left: 5px;
        }

        img {
          max-width: 100%;
          height: auto;
        }
        
        .ns_card {
          background-color: #FEC919;
          background-image: url('/local/community/hacs-ns-card/ns_card_bg.jpg');
          background-size: cover;
          color: #000;
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
          display:block;
        }

        .ns_card_updated {
          position: absolute;
          bottom: 12px;
          font-size: 12px;
        }
        .ns_card_departure_trip {
          position: absolute;
          right: 15px;
          top: 75%;
        }
        
        .ns_card_departure_trip span {
          width: 100%;
          font-size: 10px;
          display: block;
        }
        
        .card {
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          transition: 0.3s;
          background-color: #FEC919;
          border-radius: 15px;
          padding: 20px 16px;
          background-image: url('/local/community/hacs-ns-card/ns_card_bg.jpg');
          background-size: cover;
        }
      </style>
      <div class="slideshow">
        <div class="card">
          <div class="ns_card_departure_time">
            <span>Vertrek tijd</span>
            <b>${plannedDepartureTime} ${delayText}</b>
          </div>
  
          <div class="ns_card_departure_platform">
            <span>Perron</span>
            <b>${this.testattributes[`departure_platform_planned_trip_${this.currentIndex + 1}`]}</b>
          </div>
  
          <div class="ns_card_route">
            <span>Enkele Reis</span>
            <b>${this.testattributes[`route_trip_${this.currentIndex + 1}`][0]}</b>
            <b>${this.testattributes[`route_trip_${this.currentIndex + 1}`][this.testattributes[`route_trip_${this.currentIndex + 1}`].length - 1]}</b>
          </div>
          <div class="ns_card_updated">
            <span>Updated ${updatedText}</span>
          </div>
          <div class="ns_card_trip">
            <span>Transfers ${this.testattributes[`transfers_trip_${this.currentIndex + 1}`]}</span>
          </div>
          <div class="ns_card_departure_trip">
            <span>Trip</span>
            <b>${this.currentIndex + 1}</b>
          </div>
          <br><br>
        </div>
        <div class="arrow-container">
          <button class="arrow" id="prevBtn">&#10094;</button>
          <button class="arrow" id="nextBtn">&#10095;</button>
        </div>
      </div>
    `;
  }

  // Set configuration for the slideshow
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
    this.entityId = this.config.entity;
    this.render();
  }

  // Handle button click events
  handleButtonClick(event) {
    const target = event.target;
    if (target.id === 'prevBtn') {
      console.log(this.testattributes);
      this.navigate(-1);
    } else if (target.id === 'nextBtn') {
      this.navigate(1);
    }
  }

  // Navigate to the next or previous slide
  navigate(direction) {
    this.currentIndex = (this.currentIndex + direction + this.testattributes[`trips_showen`]) % this.testattributes[`trips_showen`];
    this.render();  // Update the view
  }
}

customElements.define('slideshow-card', SlideshowCard);
