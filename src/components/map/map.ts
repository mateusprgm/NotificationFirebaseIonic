import { Component, OnInit, enableProdMode } from '@angular/core';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';





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
  coords: any;
  mapObj: any;
  markerObj: any;
  displayObject: any;
  pauseDirections: Boolean = false;
  orientation = 90;
  labelRoute = 'Traçar rota';
  texto: any;
  texto1: any;
  HeadingDevice: any;


  

  constructor(public nav: NavController, public deviceOrientation: DeviceOrientation) {}

  
///LEMBRETE USAR POSIÇÃO ANTERIOR PARA REDEFINIR OU NAO ROTA
  async ngOnInit(){
    this.map = await this.getCurrentLocation().subscribe(location=>{

      let lt = -15.8105;//quando diminui vai pro norte//aumenta vai pro sul-15.8105316
      let lg = -48.1437;//quando diminui vai pro leste//aumenta vai pra oste-48.143755299999995

      
      
      let locationMarker = new google.maps.LatLng(lt, lg);


      this.mapObj = this.createMap(location);
      this.markerObj = this.addMarker(this.objMap(), location, '');
      this.coords = location;

      
      this.addMarker(this.objMap(), locationMarker, '');

    });
  }

  

  async addMarker(map, location, title) {

    // let objMap = this.objMap();
    // let mapCenter = this.objMap().getCenter();
    // let marker : Observable<any>;
    
    
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: location,
      title: title,
      rotation: 90,
    });
    // let lt = -15.8098315;
    // let lg = -48.143755299999995;

      
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
            },{maximumAge:10000, timeout:5000, enableHighAccuracy: true};
        }
      ) 

      return locationObs;
     }
  }

  //Criando Mapa com seus respectivos atributos
  async createMap(location){
    
    let mapOptions = {
      center: location,
      zoom: 18,//21,
      mapTypeId: google.maps.MapTypeId.NONE,
      heading: 0,
      tilt: 45,
    }

    let mapEL = document.getElementById('map');
    let map = new google.maps.Map(mapEL, mapOptions);

    let styles = {
      default: null,
      hide: [
        {
          featureType: 'poi.business',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'transit',
          elementType: 'labels.icon',
          stylers: [{visibility: 'off'}]
        }
      ]
    };

    map.setOptions({styles: styles['hide']});
  
    

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
    
   
    let marker = this.objMarker();
    let updMarker = this.updMarker();
    let spinMap = this.spinMap;
    let getCurrentPosition = this.getCurrentLocation();
 
    //Destruir obj anterior, para a não sobreposição de rotas
    if(this.displayObject){
      this.displayObject.setMap(null);
    }
    
    this.displayObject = directionsDisplay;
    this.displayObject.setMap(map);
    //
    // let warnings = document.getElementById("texto");
    
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      optimizeWaypoints: true,
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        makeSteps(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    function makeSteps(directionResult) {

      let resultRoute = directionResult.routes[0].legs[0];
      let listMarkers = [];
      resultRoute.steps.forEach(marker => {
        listMarkers.push({
            marker 
        });
      });
      
      listMarkers.forEach(markers=>{
        // var markerInstruct = new google.maps.Marker({
        //   position: markers.marker.start_point,
        //   map: map
        // });
        // var markerInstruct = new google.maps.Marker({
        //   position: markers.marker.start_location,
        //   map: map
        // });
        // let chaveDirection = markers.marker.maneuver.split("-");
        // let graus = 90;
        // console.log(chaveDirection[1]);
        
    
          
          updMarker.subscribe(res=>{
            // let markerbefore = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

            
            getCurrentPosition.subscribe(realPosition=>{
              map.setCenter(realPosition);

            })
            
          });
      })
    }
    return directionsDisplay;
  }

  
  route() {
    this.spinMap();
    //Definição para false para voltar traçar rotas
    this.pauseDirections = false;
    //Destino Estático para teste.
    let lat = -15.8098315;
    let lng = -48.143755299999995;
    let locationMarker = new google.maps.LatLng(lat, lng);

    this.routesDirections(this.objMap(), locationMarker, this.objMarker().position);
       
    // this.objMap().setZoom(this.objMap().getZoom());
    // this.objMap().setZoom(17);
    let timer = setInterval(() => { 
      this.objMap().setZoom(17);  
      clearInterval(timer);
      }, 5000);

  }
  //Relógio
  updMarker(){
    return Observable.interval(2000);
  }
  //Pausar criação de rota dinamica
  pauseDirection() {
    // if(this.pauseDirections == true){
    //   this.labelRoute = "Traçar Rota";
    // }
    // this.pauseDirections = true;

    // let mapHtml: HTMLElement = document.getElementById('map');
    
    // mapHtml.style.transform = "rotate(90deg)";
  }
  //Girar o mapa
  spinMap() {    
    // Watch the device compass heading change
    let mapHtml: HTMLElement = document.getElementById('map');
    mapHtml.style.overflow = "inherit";
    var subscription = this.deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        mapHtml.style.transform = "rotate("+data.magneticHeading+"deg)"; 
      },
      (error: any) => console.log(error)
    );
  }  
}