import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent {

  @ViewChild("map") mapElement;
  map: any;
  constructor() { }

  ngOnInit() {
    this.initMap();
  }
  initMap() {

    getLocation();

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
    }
    
    let mapOptions: google.maps.MapOptions = {
      center: {lat: 0, lng: 0},
      zoom: 8,
      streetViewControl: false,
      mapTypeId:google.maps.MapTypeId.ROADMAP
      
      // let coords = new google.maps.LatLng(latitude, longitude);
    }
    function showPosition(position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      mapOptions.center.lat = latitude;
      mapOptions.center.lng = longitude;
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)
  }
  

}
