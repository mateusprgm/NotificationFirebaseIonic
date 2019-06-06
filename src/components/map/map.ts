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
  texto: any;
  texto1: any;


  

  constructor(public nav: NavController) {
    
  }

  
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
      mapTypeId: 'satellite',//google.maps.MapTypeId.NONE,
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
    
    // console.log(teste);
    let marker = this.objMarker();
    let updMarker = this.updMarker();
    let spinMap = this.spinMap;
    

    

    //Destruir obj anterior, para a não sobreposição de rotas
    if(this.displayObject){
      this.displayObject.setMap(null);
    }
    
    this.displayObject = directionsDisplay;
    this.displayObject.setMap(map);
    //
    let warnings = document.getElementById("texto");
    
    directionsService.route({
      origin: origin,
      destination: destination,
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
    function showSteps(directionResult) {
      // For each step, place a marker, and add the text to the marker's
      // info window. Also attach the marker to an array so we
      // can keep track of it and remove it when calculating new
      // routes.
      var myRoute = directionResult.routes[0].legs[0];
      let listMarkers = [];
      myRoute.steps.forEach(marker => {
        listMarkers.push({
            marker 
        });
      });
      
      for (var i = 0; i < myRoute.steps.length; i++) {
          
          var markerInstruct = new google.maps.Marker({
            position: myRoute.steps[i].start_point,
            map: map
          });
          // console.log(listMarkers[i].marker.maneuver);
          var markerInstruct = new google.maps.Marker({
            position: myRoute.steps[i].start_location,
            map: map
          });
     
         
          console.log(listMarkers[0].marker.start_location.lat().toString().substring([4],[5]));
          console.log(marker.position.lat().toString().substring([4],[5]));
          updMarker.subscribe(res=>{
            let n = 24;
            let coordOrientation: String = "";
            if(marker.position.lng() >= listMarkers[n].marker.start_location.lng()){
              console.log("to pro norte");
              coordOrientation += "2";
            }else{
              coordOrientation += "1";
            }

            if(marker.position.lat() <= listMarkers[n].marker.start_location.lat()){
              console.log("to pro leste");
              coordOrientation += "3";
              if(marker.position.lat().toString().substring([4],[5]) < listMarkers[n].marker.start_location.lat()){
                coordOrientation = "3";
              }
            }else{
              console.log("to pro oeste");
              coordOrientation += "4";
              console.log(marker.position.lat().toString().substring([4],[5]));
              if(marker.position.lat().toString().substring([4],[5]) > listMarkers[n].marker.start_location.lat()){
                coordOrientation = "4";
              }
            }
            
            switch(coordOrientation){
              case "14": spinMap(8);
                break;
              case "13": spinMap(7);
                break;
              case "24": spinMap(5);
                break;
              case "23": spinMap(6);
                break;
              case "3": spinMap(3);
                break;
              case "4": spinMap(4);
                break;
              default: console.log("Orientação não Definida!");  
                break;
            }
     

          
            // let panorama = new google.maps.StreetViewPanorama(
              
            //   document.getElementById('pano'), {
            //     position: marker.position,
            //     pov: {
            //       heading: -97.95832176013033,
            //       pitch: 10
            //     }
            //   });
                // let service = new google.maps.StreetViewService;
          
              
                // service.getPanoramaByLocation(marker.position, 90, function(panoData) {
                //   let point1 = marker.position;
                
                //   let heading = google.maps.geometry.spherical.computeHeading(point1,listMarkers[0].marker.start_location);
                //   console.log(heading);
                // })
              

              

                map.setCenter(listMarkers[n-1].marker.start_location);



          });
          
      }
      
    }
    
    
    return directionsDisplay;
  }

  
  route() {
    
   
    








  
  // var heading = google.maps.geometry.spherical.computeHeading(panoCenter, lookTo);



    //Definição para false para voltar traçar rotas
    this.pauseDirections = false;
    //Destino Estático para teste.
    let lat = -15.8098315;
    let lng = -48.143755299999995;
    let infoRoute;
    let locationMarker = new google.maps.LatLng(lat, lng);
    //
    let marker = this.objMarker();
    // let heading = google.maps.geometry.spherical.computeHeading(this.objMarker().getPosition, locationMarker);
    // this.spinMap(123);

    this.routesDirections(this.objMap(), locationMarker, this.objMarker().position);
    
      //Atualização de rota conforme posição de localização
      // this.updMarker().subscribe(res=>{
        
       
          
          // this.getCurrentLocation().subscribe(location=>{
          //   let setRoute = false;
          //   marker.setPosition(location);
          //   marker.setMap(this.objMap());
          //   this.texto = ("coords"+this.coords.lat().toString(),this.coords.lng().toString());
          //   this.texto1 = ("location"+location.lat().toString(), location.lng().toString());

          //   if(this.pauseDirections == false){
          //     if (this.coords.lat().toString().substring([0],[8]) > location.lat().toString().substring([0],[8]) 
          //      && this.coords.lng().toString().substring([0],[8]) > location.lng().toString().substring([0],[8])
          //     ){
          //       this.spinMap(5);//Nordeste
          //       setRoute = true;
          //     }else if (this.coords.lat().toString().substring([0],[8]) < location.lat().toString().substring([0],[8]) 
          //            && this.coords.lng().toString().substring([0],[8]) < location.lng().toString().substring([0],[8])
          //     ){
          //       this.spinMap(8);//Sudoeste
          //       setRoute = true;
          //     }else if (this.coords.lat().toString().substring([0],[8]) < location.lat().toString().substring([0],[8]) 
          //            && this.coords.lng().toString().substring([0],[8]) > location.lng().toString().substring([0],[8])
          //     ){
          //       this.spinMap(6);//Noroeste
          //       setRoute = true;
          //     }else if (this.coords.lat().toString().substring([0],[8]) > location.lat().toString().substring([0],[8]) 
          //           && this.coords.lng().toString().substring([0],[8]) < location.lng().toString().substring([0],[8])
          //     ){
          //       this.spinMap(7);//Sudeste
          //       setRoute = true;
          //     }else if (this.coords.lat().toString().substring([0],[8]) > location.lat().toString().substring([0],[8]) 
          //     ){
          //       this.spinMap(2);//Norte
          //       setRoute = true;
          //     }else if (this.coords.lat().toString().substring([0],[8]) < location.lat().toString().substring([0],[8]) 
          //     ){
          //       this.spinMap(1);//Sul
          //       setRoute = true;
          //     }else if (this.coords.lng().toString().substring([0],[8]) > location.lng().toString().substring([0],[8]) 
          //     ){
          //       this.spinMap(3);//Leste
          //       setRoute = true;
          //     }else if (this.coords.lng().toString().substring([0],[8]) < location.lng().toString().substring([0],[8]) 
          //     ){
          //       this.spinMap(4);//Oeste
          //       setRoute = true;
          //     }
          //     this.coords = location;
          //     this.labelRoute = "Em navegação";
          //     if(setRoute == true){
          //       this.objMap().setCenter(marker.position);
          //       this.routesDirections(this.objMap(), location, locationMarker);
          //     }
              
              this.objMap().setZoom(this.objMap().getZoom());
      //       }
      //     })
      // });
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
    let orientation = 90;
    switch(rose){
      case 1: //Sul
        orientation = -90;
        console.log("Sul");
        break;
      case 2: //Norte
        orientation = 90;
        console.log("Norte");
        break;
      case 3: //Leste
        orientation = 0;
        console.log("Leste");
        break;
      case 4: //Oeste
        orientation = 180;
        console.log("Oeste");
        break;
        ///
      case 5: //Nordeste
        orientation = 45;
        console.log("Nordeste");
        break;
      case 6: //Noroeste
        orientation = 135;
        console.log("Noroeste");
        break;
      case 7: //Sudeste
        orientation = 225;
        console.log("Sudeste");
        break;
      case 8: //Sudoeste
        orientation = 315;
        console.log("Sudoeste");
        break;
      default:
        orientation = 90;
        console.log("Não ta funfando");
        break;
    }
    console.log(orientation);

    let mapHtml: HTMLElement = document.getElementById('map');
    mapHtml.style.overflow = "inherit";
    mapHtml.style.transform = "rotate("+orientation+"deg)"; /* Standard syntax */
    
  }  
}