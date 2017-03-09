// ANGULAR COMPONENTS
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';


@Component({
    selector: 'login',
    templateUrl: '../templates/login.component.html',
    styleUrls: ['../styles/login.component.css']
})
export class LoginComponent {
    tooltipPosition="below";
    tiles = [
        { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
        { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
        { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
        { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
    ];

    constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(
            'menu-icon',
            sanitizer.bypassSecurityTrustResourceUrl('public/icons/ic_menu_white_48px.svg'));
        iconRegistry.addSvgIcon(
            'account-icon',
            sanitizer.bypassSecurityTrustResourceUrl('public/icons/ic_account_circle_white_48px.svg'));
    }
}