import { Component, ViewChild } from '@angular/core';
import { CallService } from '../../service/call/call.service';
import { Call } from '../../model/call';
import { ModalController, NavParams } from '@ionic/angular';
import { AddressService } from '../../service/call/address.service';

declare var google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  providers: [CallService, AddressService],
})
export class GoogleMapComponent {

  @ViewChild("map") mapElement;
  map: any;
  latLng: any;

  address: string;
  date: string;
  description: string;
  type: string;
  showInput: boolean = false;

  constructor(
    private callService: CallService,
    private addressService: AddressService,
    public modalCtrl: ModalController
  ) { }

  public ngOnInit() {
    this.showMap();
    this.date = this.getDate();
  }

  public showMap() {
    let self = this;
    this.initMap().then(function (map) {
      self.map = map;

      self.getCalls("occurrence").then(function (result) {
        let calls = result as Array<Call>;
        self.setMarkers(calls);
      });

      self.getCalls("complaint").then(function (result) {
        let calls = result as Array<Call>;
        self.setMarkers(calls);
      });

      self.getAddress();

    });
  }

  public getAddress() {
    this.addressService.getAddress(this.latLng, this.latLng)
      .subscribe(res => {
        let response = res as any;
        this.address = String(response.address);
      }, err => {
        console.log(err);
      })
  }

  public getDate() {
    var d = new Date().toJSON().slice(0, 10).replace(/-/g, '/');;
    return String(d);
  }

  public getCalls(type: string) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.callService.getCall(type)
        .subscribe(res => {
          resolve(res);
        })
    })
  }

  public setMarkers(calls: Array<Call>) {
    if (calls != undefined) {
      for (let call of calls) {
        var myLatLng = {
          lat: parseFloat(call.lat),
          lng: parseFloat(call.lng)
        };

        let color = "";
        if (call.type == "complaint") {
          color = "red";
        } else {
          color = "orange";
        }

        var icon = {
          url: 'http://maps.google.com/mapfiles/ms/icons/' + color + '.png',
          labelOrigin: new google.maps.Point(15, 10),
          scaledSize: new google.maps.Size(50, 50), // scaled size
          anchor: new google.maps.Point(0, 0) // anchor
        };

        let marker = new google.maps.Marker({
          map: this.map,
          size: new google.maps.Size(20, 32),
          icon: icon,
          animation: google.maps.Animation.DROP,
        });

        marker.setPosition(myLatLng);
      }
    }
  }

  public getLocation() {
    return new Promise(function (resolve, reject) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var crd = position.coords;

          let latLng = {
            lat: crd.latitude,
            lng: crd.longitude
          }

          resolve(latLng);
        });
      }
    });
  }

  public initMap() {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.getLocation().then(function (latLng) {
        resolve(self.createMap(latLng));
      });
    });
  }


  public createMap(latLng) {
    let self = this;
    return new Promise(function (resolve, reject) {
      let mapOptions: google.maps.MapOptions = {
        center: latLng,
        zoom: 12,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      self.latLng = latLng;
      self.map = new google.maps.Map(self.mapElement.nativeElement, mapOptions)
      resolve(self.map);
    });
  }

  public openModal() {
    return this.showInput = !this.showInput;
  }

  public sendInput() {
    let params = {
      type: this.type,
      address: this.address,
      date: this.date,
      lat: this.latLng.lat,
      lng: this.latLng.lng,
      description: this.description,
      status: "PENDING",
      veracity: "",
      important: "",
    }

    this.callService.insertCall(params)
      .subscribe(res => {
        alert("Inserido com sucesso!");
        this.showMap();
      }, err => {
        console.log(err);
      })

  }

}



