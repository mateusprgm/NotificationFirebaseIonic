import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@NgModule({
	declarations: [MapComponent],
	imports: [Geolocation],
	exports: [MapComponent],
	
})
export class ComponentsModule {}
