// ANGULAR COMPONENTS
import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    @HostListener('window:orientationchange', ['$event']) onorientationchange(event: any) {
        location.reload();
    }

    @HostListener('window:load', ['$event']) onLoad(event: any) {
        window.scrollTo(0, 0);
    }
}