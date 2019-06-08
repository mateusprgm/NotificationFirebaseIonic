import { Component, OnInit, enableProdMode } from '@angular/core';
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
var displayObject: any;
var mapHtml: HTMLElement;
enableProdMode()
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})


export class MapComponent implements OnInit {
  map: any;
  mapObj: any;
  markerObj: any;
  displayObject: any;
  subscribeSpin:any;
  labelRoute = 'Iniciar Navegação';


  constructor(
    public nav: NavController, 
    public deviceOrientation: DeviceOrientation, 
    private androidPermissions: AndroidPermissions, 
    public plt: Platform
  ) 
  {
    // this.permissionAndroid();
  }

  
  permissionAndroid(){
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

  async ngOnInit(){
    this.map = await this.getCurrentLocation().subscribe(location=>{

      this.mapObj = this.createMap(location);
      this.markerObj = this.addMarker(this.objMap(), location, 'principal');
      
      for (let i = 0; i < 6; i++) {
        var lat = ("-15.8"+i+"9"+i+"315");
        var lng = ("-48.1"+i+"35"+i+"299999995");
       
        var locationMarker = new google.maps.LatLng(lat, lng);
        this.addMarker(this.objMap(), locationMarker, '');
      }

    });
  }

  

  async addMarker(map, location, classe) {
    
    let markerOrigin = this.getCurrentLocation();
    let icon = null;

    
  
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: location,
      optimized: false,
      icon: icon
    });

    if(classe == 'principal'){
      //icone inicial
      marker.setIcon('../../assets/imgs/hole.png');
    }else{
      //Criando rota com o marker selecionado
      marker.setIcon('../../assets/imgs/cargas.png');
      marker.addListener('click', function (){
        markerOrigin.subscribe(origin=>{
          makeRoute(origin);
        })
      });
    }
    
    //
    //Cria a rota
    function makeRoute(origin){
      
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer({ preserveViewport: true,  suppressMarkers: true });

        // //Destruir obj anterior, para não haver sobreposição de rotas
        if(displayObject){
          displayObject.setMap(null);
        }
        
        displayObject = directionsDisplay;
        displayObject.setMap(map);

        directionsDisplay.setMap(map);

        directionsService.route({
          origin: origin,
          destination: location,
          travelMode: 'DRIVING',
          optimizeWaypoints: true,
        }, function(response, status) {

              if (status === 'OK') {
                directionsDisplay.setDirections(response);
                showSteps(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
        
        function showSteps(response){
          response.routes[0].legs[0].steps.forEach(markers => {});
        }
        return directionsDisplay;
      }
      return marker;
  }
  //
  //Retorna a localização atual
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
  //Iniciar navegação
  route() {
    if(this.labelRoute == "Iniciar Navegação"){
      this.spinMap();
      this.labelRoute = "Cancelar Rota";
    }else{
      this.pauseDirection();
    }
    
    // console.log(this.objMap(), this.objMarker());
    let timer = setInterval(() => { 
      this.objMap().setZoom(17); 
      this.objMap().setCenter(this.objMarker().position);
      clearInterval(timer);
    }, 3000);
  }
  //
  //Relógio
  updMarker(){
    return Observable.interval(2000);
  }
  //
  //Pausar criação de rota dinamica
  pauseDirection() {
    if(this.labelRoute == "Cancelar Rota"){
      this.subscribeSpin.unsubscribe();
      this.labelRoute = "Iniciar Navegação";
      mapHtml.style.transform = "rotate("+(0)+"deg)"; 
      this.objMap().setZoom(15); 
    }
  }
  //
  //Girar o mapa e seta
  spinMap() {    
    
        // Watch the device compass heading change
        mapHtml = document.getElementById('map');
        mapHtml.style.overflow = "inherit";
        let options : DeviceOrientationCompassOptions = {
          frequency: 1000
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
        this.subscribeSpin = subscription;  
        return subscription;
  }  
}