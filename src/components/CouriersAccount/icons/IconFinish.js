import L from 'leaflet';

import marker from '../images/iconFinish.png';
const IconFinish = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor:  [-0, -0],
    iconSize: [45,45],     
});

export default IconFinish;