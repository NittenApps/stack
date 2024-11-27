import { Component, Inject, ViewChild } from '@angular/core';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PlaceAutocompleteComponent } from '../place-autocomplete/place-autocomplete.component';

import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'nas-select-address',
  standalone: true,
  imports: [GoogleMapsModule, MatButtonModule, MatDialogModule, PlaceAutocompleteComponent],
  templateUrl: './select-address.component.html',
})
export class SelectAddressComponent {
  address?: string;
  center: any;
  mapOptions: google.maps.MapOptions;
  markerPosition?: google.maps.LatLng;
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = { gmpDraggable: true };
  place?: PlaceResult;
  zoom: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private geocoder: MapGeocoder) {
    this.mapOptions = { mapId: 'f4d18267dcc5eff7' };
    this.center = { lat: 23.634501, lng: -102.552784 };
    this.zoom = 5;
  }

  dragEnd($event: google.maps.MapMouseEvent): void {
    this.geocoder.geocode({ location: $event.latLng }).subscribe(({ results }) => {
      console.log(results);
      if (results.length > 0) {
        this.address = results[0].formatted_address;
        this.place = results[0];
      }
    });
  }

  locationSelected($event: any): void {
    this.center = $event;
    this.zoom = 17;
    this.markerPosition = $event;
  }

  placeSelected($event: PlaceResult): void {
    this.place = $event;
  }
}
