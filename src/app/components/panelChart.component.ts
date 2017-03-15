// ANGULAR COMPONENTS
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import {MdDialog} from '@angular/material';
// import {DialogOverviewExampleDialog} from '../components/dialogOverviewExampleDialog.component';


@Component({
    selector: 'panelChart',
    templateUrl: '../templates/panelChart.component.html',
    styleUrls: ['../styles/panelChart.component.css']
})
export class PanelChartComponent {

  selectedValue: string;

  dropChoices = [
    {value: 'choice-0', viewValue: 'Choice - 0'},
    {value: 'choice-1', viewValue: 'Choice - 1'},
    {value: 'choice-2', viewValue: 'Choice - 2'}
  ];


     checked = false;
  indeterminate = false;
  align = 'start';
  disabled = false;

      color: string;

  availableColors = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' }
  ];

     favoriteChoice: string;

  choices = [
    'Choice - 1',
    'Choice - 2',
    'Choice - 3',
    'Choice - 4',
  ];

    gateways = [
        {
            name: 'Gateway1',
            updated: new Date('1/1/16'),
        },
        {
            name: 'Gateway2',
            updated: new Date('1/17/16'),
        },
        {
            name: 'Gateway3',
            updated: new Date('1/28/16'),
        }
    ];
    channels = [
        {
            name: 'Channel1',
            updated: new Date('2/20/16'),
        },
        {
            name: 'Channel2',
            updated: new Date('1/18/16'),
        }
    ];

    tooltipPosition = "below";

    constructor(public dialog: MdDialog, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
    
        iconRegistry.addSvgIcon(
            'menu-icon',
            sanitizer.bypassSecurityTrustResourceUrl('public/icons/ic_menu_white_48px.svg'));
        iconRegistry.addSvgIcon(
            'account-icon',
            sanitizer.bypassSecurityTrustResourceUrl('public/icons/ic_account_circle_white_48px.svg'));
    }
        openDialog() {
    // this.dialog.open(DialogOverviewExampleDialog);
  }
}