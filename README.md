# NS Status Card for Home Assistant (HACS)
Custom Lovelace Card for showing status of Nederlandse Spoorwegen with ticket-like UI.

### Nederlandse Spoorwegen Sensor
You first have to install the desired sensor(s) from this integration:
https://github.com/codayoda36/Ns-home-assistant

### Install NS Card

#### Using HACS
0. Make sure you have HACS installed. If not, follow instructions: https://hacs.xyz/docs/setup/download/
1. Open HACS and click on Frontend
2. Click on the three dots in the right top corner, and click on Custom repositories
3. Use `https://github.com/codayoda36/hacs-ns-card/` as the Repository and choose Lovelace as category.
4. Install the ns-card.

#### Manual
1. Place the ns-status-card folder with its contents in the WWW/COMMUNITY folder of your home assistant. 
2. Add the folder to the dashboards/resources list. Folder path should look like: /hacsfiles/ns-status-card/ns-status-card.js
3. Refresh the browser, now you should be able to use the card.

### YAML example:
```
type: custom:ns-status-card
entity: sensor.nijmegen_amsterdam
```

