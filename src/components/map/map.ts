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
  coords: any;
  mapObj: any;
  markerObj: any;
  displayObject: any;
  pauseDirections: Boolean = false;
  orientation = 90;
  labelRoute = 'Traçar rota';

  

  constructor(public nav: NavController) {
    
  }

  

  async ngOnInit(){
    this.map = await this.getCurrentLocation().subscribe(location=>{

      let lt = -15.810;//quando diminui vai pro norte//aumenta vai pro sul-15.8105316
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
    // let options = {
    //       enableHighAccuracy: true,
    //       timeout: 5000,
    //       maximumAge: 0
    //     };

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
      heading: 90,
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
        
       
          
          this.getCurrentLocation().subscribe(location=>{


            this.coords = location;
            
            marker.setPosition(location);
            marker.setMap(this.objMap());
            

            if(this.pauseDirections == false){
              if (this.coords.lat().toString().substring([0],[7]) > location.lat().toString().substring([0],[7]) 
               && this.coords.lng().toString().substring([0],[7]) > location.lng().toString().substring([0],[7])
              ){
                this.spinMap(5);//Nordeste
              }else if (this.coords.lat().toString().substring([0],[7]) < location.lat().toString().substring([0],[7]) 
                    && this.coords.lng().toString().substring([0],[7]) < location.lng().toString().substring([0],[7])
              ){
                this.spinMap(8);//Sudoeste
              }else if (this.coords.lat().toString().substring([0],[7]) < location.lat().toString().substring([0],[7]) 
                    && this.coords.lng().toString().substring([0],[7]) > location.lng().toString().substring([0],[7])
              ){
                this.spinMap(6);//Noroeste
              }else if (this.coords.lat().toString().substring([0],[7]) > location.lat().toString().substring([0],[7]) 
                    && this.coords.lng().toString().substring([0],[7]) < location.lng().toString().substring([0],[7])
              ){
                this.spinMap(7);//Sudeste
              }else if (this.coords.lat().toString().substring([0],[7]) > location.lat().toString().substring([0],[7]) 
              ){
                this.spinMap(2);//Norte
              }else if (this.coords.lat().toString().substring([0],[7]) < location.lat().toString().substring([0],[7]) 
              ){
                this.spinMap(1);//Sul
              }else if (this.coords.lng().toString().substring([0],[7]) > location.lng().toString().substring([0],[7]) 
              ){
                this.spinMap(3);//Leste
              }else if (this.coords.lng().toString().substring([0],[7]) < location.lng().toString().substring([0],[7]) 
              ){
                this.spinMap(4);//Oeste
              }
              this.labelRoute = "Em navegação";
              this.objMap().setCenter(marker.position);
              this.routesDirections(this.objMap(), location, locationMarker);
              this.objMap().setZoom(this.objMap().getZoom());
            }
          })
      });
  }
  //Relógio
  updMarker(){
    return Observable.interval(2000);
  }
  //Pausar criação de rota dinamica
  pauseDirection() {
    if(this.pauseDirections == true){
      this.labelRoute = "Traçar Rota";
    }
    this.pauseDirections = true;

    let mapHtml: HTMLElement = document.getElementById('map');
    
    mapHtml.style.transform = "rotate(90deg)";
  }
  //Girar o mapa
  spinMap(rose) {
    // this.orientation = 90;
    switch(rose){
      case 1: //Sul
        this.orientation = -90;
        break;
      case 2: //Norte
        this.orientation = 90;
        break;
      case 3: //Leste
        this.orientation = 0;
        break;
      case 4: //Oeste
        this.orientation = 180;
        break;
        ///
      case 5: //Nordeste
        this.orientation = 45;
        break;
      case 6: //Noroeste
        this.orientation = 135;
        break;
      case 7: //Sudeste
        this.orientation = 225;
        break;
      case 8: //Sudoeste
        this.orientation = 315;
        break;
      default:
        this.orientation = 90;
        break;
    }
    console.log(this.orientation);

    let mapHtml: HTMLElement = document.getElementById('map');
    mapHtml.style.overflow = "inherit";
    mapHtml.style.transform = "rotate("+this.orientation+"deg)"; /* Standard syntax */
    
  }
}