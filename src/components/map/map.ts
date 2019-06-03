import { Component, OnInit, enableProdMode } from '@angular/core';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';





/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
declare var google;
enableProdMode()
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})


export class MapComponent implements OnInit {
  map: any;
  directions: any;
  mapObj: any;
  markerObj: any;
  displayObject: any;
  pauseDirections: Boolean = false;
  labelRoute = 'Traçar rota';

  

  constructor(public nav: NavController) {
    
    
    
  }
  

  async ngOnInit(){
    this.map = await this.getCurrentLocation().subscribe(location=>{

      this.mapObj = this.createMap(location);
      this.markerObj = this.addMarker(this.objMap(), location, '');

    });
  }

  texto ='';
  texto1 ='';
  async addMarker(map, location, title) {

    let objMap = this.objMap();
    let mapCenter = this.objMap().getCenter();
    // let marker : Observable<any>;
    
    
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: location,
      title: title,
    });
    let lt = -15.8098315;
    let lg = -48.143755299999995;

      
      // let locationMarker = new google.maps.LatLng(lt, lg);

     
      
      

    

    // let contentString = '<div id="content">'+
    //                         marker.title+
    //                         '<input type="button" onclick="this.route();" value="rotas">';

    // if(title != ''){
    //   let infowindow = new google.maps.InfoWindow({
    //     content: contentString
    //   });
    //   marker.addListener('click', function() {
    //     infowindow.open(map, marker);
    //     marker.setAnimation(google.maps.Animation.BOUNCE);
    //   });
    // }
    // marker.addListener('click', function() {
    //   return function(){
    //     console.log('oi');
    //   }  
    
    // });
  
  
    

    
    
    return marker;
  }
  
   



  getCurrentLocation() {
    let locationObs: Observable<any>;
    let options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

    if (navigator.geolocation) {

      locationObs = Observable.create(
        obs=>{
            navigator.geolocation.getCurrentPosition(function(position) {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;
            
              let location = new google.maps.LatLng(lat, lng);
              
              obs.next(location);
              obs.complete();
            }),function error(err) {
              console.warn('ERROR(' + err.code + '): ' + err.message);
            },options;
        }
      ) 

      return locationObs;
     }
  }

  //Criando Mapa com seus respectivos atributos
  async createMap(location){
    
    let mapOptions = {
      center: location,
      zoom: 21,
      mapTypeId: google.maps.MapTypeId.NONE,
      heading: 90,
      tilt: 45
      

    }

    let mapEL = document.getElementById('map');
    let map = new google.maps.Map(mapEL, mapOptions);
    
    let trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    return map;
  }
  
  //Return de objeto já criado com todos parâmetros necessários
  objMarker() {
    let marker = this.markerObj.__zone_symbol__value;
    return marker;
  }
  //
  //Return de objeto já criado com todos parâmetros necessários
  objMap() {
    let map = this.mapObj.__zone_symbol__value;
    return map;
  }
  //
  routesDirections(map, origin, destination) {
    
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer({ preserveViewport: true,  suppressMarkers: true });
    let directions;

    //Destruir obj anterior, para a não sobreposição de rotas
    if(this.displayObject){
      this.displayObject.setMap(null);
    }

    this.displayObject = directionsDisplay;
    this.displayObject.setMap(map);
    //

    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        directions = directionsDisplay;
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    return directions;
  }

  
  route() {
    //Definição para false para voltar traçar rotas
    this.pauseDirections = false;
    //Destino Estático para teste.
    let lat = -15.8098315;
    let lng = -48.143755299999995;
    let infoRoute;
    let locationMarker = new google.maps.LatLng(lat, lng);
    //
    let marker = this.objMarker();;
    
    
      //Atualização de rota conforme posição de localização
      this.updMarker().subscribe(res=>{
        if(this.pauseDirections == false){
          this.labelRoute = "Em navegação";
          this.getCurrentLocation().subscribe(location=>{

            this.texto1 = location;
            marker.setPosition(location);
            marker.setMap(this.objMap());
            
            this.objMap().setCenter(marker.position);
            this.routesDirections(this.objMap(), location, locationMarker);
            this.objMap().setZoom(20);
            
          })
        }
      });
  }

  

  //Relógio
  updMarker(){
    return Observable.interval(2000);
  }
  //

  pauseDirection() {
    if(this.pauseDirections == true){
      this.labelRoute = "Voltar para rota";
    }
    this.pauseDirections = true;
  }
}