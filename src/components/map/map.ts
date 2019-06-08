import { Component, OnInit, enableProdMode } from '@angular/core';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs/Observable';
import { NavController } from 'ionic-angular';
import { DeviceOrientation, DeviceOrientationCompassHeading, DeviceOrientationCompassOptions } from '@ionic-native/device-orientation';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from 'ionic-angular';




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
  coords: any;
  mapObj: any;
  markerObj: any;
  displayObject: any;

  labelRoute = 'Traçar rota';



  

  constructor(
    public nav: NavController, 
    public deviceOrientation: DeviceOrientation, 
    private androidPermissions: AndroidPermissions, 
    public plt: Platform
  ) 
  {
    // this.permi();
  }

  
  permi(){
    if(this.plt.is('android')){
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      );
      
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.GET_ACCOUNTS])
    }else{
      console.log('Plataforma não suportada!');
      console.log(this.plt);
    }
    
  }
///LEMBRETE USAR POSIÇÃO ANTERIOR PARA REDEFINIR OU NAO ROTA
  async ngOnInit(){
    this.map = await this.getCurrentLocation().subscribe(location=>{

      let lat = -15.8098315;
      let lng = -48.143755299999995;
      let locationMarker = new google.maps.LatLng(lat, lng);


      this.mapObj = this.createMap(location);
      this.markerObj = this.addMarker(this.objMap(), location, 'principal');
      this.coords = location;

      
      this.addMarker(this.objMap(), locationMarker, '');

    });
  }

  

  async addMarker(map, location, classe) {

    
    let icon = null;
    if(classe == 'principal'){
      icon = '../../assets/imgs/hole.png';
    }
  
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: location,
      optimized: false,
      icon: icon
    });
   
    
    
    
    // markerHtml.style.transform = "rotate("+9+"deg)"; 
    

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
    

 
    //Destruir obj anterior, para a não sobreposição de rotas
    if(this.displayObject){
      this.displayObject.setMap(null);
    }
    
    this.displayObject = directionsDisplay;
    this.displayObject.setMap(map);
   
    
    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      optimizeWaypoints: true,
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

   
    return directionsDisplay;
  }

  
  route() {
    this.spinMap();
    //Destino Estático para teste.
    let lat = -15.8098315;
    let lng = -48.143755299999995;
    let locationMarker = new google.maps.LatLng(lat, lng);

    this.routesDirections(this.objMap(), this.objMarker().position, locationMarker);
       

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
  
  }
  //Girar o mapa
  spinMap() {    
    

    // Watch the device compass heading change
    let mapHtml: HTMLElement = document.getElementById('map');
    mapHtml.style.overflow = "inherit";
    let options : DeviceOrientationCompassOptions = {
      frequency: 4000
    }
    var subscription = this.deviceOrientation.watchHeading(options).subscribe(
      (data: DeviceOrientationCompassHeading) => {
        
          
          mapHtml.style.transform = "rotate("+(360-data.magneticHeading)+"deg)"; 
          let icon = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 8,
            rotation: data.magneticHeading,
          };
          this.objMarker().setIcon(icon);
          this.getCurrentLocation().subscribe(location=>{
            this.objMarker().position = location;
            this.objMap().setCenter(this.objMarker().position);
          });
          
      },
      (error: any) => console.log(error)
    );
    
  }  
}