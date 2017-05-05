// ANGULAR COMPONENTS
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { MdDialog } from '@angular/material';
//Services
import { DbDataService } from '../services/db.data.service';


@Component({
    selector: 'panelControls',
    templateUrl: '../templates/panelControls.component.html',
    styleUrls: ['../styles/panelControls.component.css']
})

export class PanelControlsComponent implements OnInit {

    leftSlideValue: number = 0;
    rightSlideValue: number = 0;

    // initial 6 months
    lowerTimeLimitRadio: number = 15778476000;

    textSearch: string = null;

    leftYearValue: string;
    leftMonthValue: string;
    leftDayValue: string;
    leftHourValue: string;
    leftMinuteValue: string;
    leftSecondValue: string;
    leftMillisecondValue: string;

    rightYearValue: string;
    rightMonthValue: string;
    rightDayValue: string;
    rightHourValue: string;
    rightMinuteValue: string;
    rightSecondValue: string;
    rightMillisecondValue: string;

    leftValue = 0;
    rightValue = 0;

    invertRightSlider = true;

    private filter: any = {
        timeFilter: {
            startTime: null,
            endTime: null
        }
    };

    constructor(private DbDataService: DbDataService) { }

    ngOnInit() {
        this.initialiseData();
    }

    onTextSearchChange(event: any): void {
        console.log('onTextSearch event: ', event);
        console.log('this.textSearch: ', this.textSearch);
    }

    private initialiseData(): void {
        let lowerTimeMilliseconds: number;
        let currentTimeLimitDate: any = new Date();
        let currentDateMilliseconds: number = currentTimeLimitDate.getTime();
        lowerTimeMilliseconds = currentDateMilliseconds - this.lowerTimeLimitRadio;
        let lowerTimeLimitDate = new Date(lowerTimeMilliseconds);
        this.setTimeDetails('left', lowerTimeLimitDate);
        this.setTimeDetails('right', currentTimeLimitDate);
        this.DbDataService.sendRequest(this.filter);
    }

    private dateToString(dateToConvert: any): any {
        let yearNumber: number = dateToConvert.getFullYear();
        let yearString: string = yearNumber.toString();

        let monthNumber: number = dateToConvert.getMonth() + 1;
        let monthString: string = ("0" + monthNumber.toString()).slice(-2);

        let dayInMonthNumber: number = dateToConvert.getDate();
        let dayString: string = ("0" + dayInMonthNumber.toString()).slice(-2);

        let hourNumber = dateToConvert.getHours();
        let hourString = ("0" + hourNumber.toString()).slice(-2);

        let minuteNumber = dateToConvert.getMinutes();
        let minuteString = ("0" + minuteNumber.toString()).slice(-2);

        let secondNumber = dateToConvert.getSeconds();
        let secondString = ("0" + secondNumber.toString()).slice(-2);

        let millisecondNumber = dateToConvert.getMilliseconds();
        let millisecondString = ("00" + millisecondNumber.toString()).slice(-3);

        let fullDateString = yearString + '-' + monthString + '-' + dayString + 'T' + hourString + ':' + minuteString + ':' + secondString + '.' + millisecondString + 'Z';

        let objectToReturn: any = {
            yearString: yearString,
            monthString: monthString,
            dayString: dayString,
            hourString: hourString,
            minuteString: minuteString,
            secondString: secondString,
            millisecondString: millisecondString,
            fullDateString: fullDateString
        }
        return objectToReturn;
    }

    saveInput(event: any): void {
        console.log('old field value left minutes: ', event.target.value);
    }

    onInputChange(event: any) {
        // console.log('keyup event: ', event.target.value);
        setTimeout(function (par: number): void {
            console.log('value to write after time: ', par);
        }, 2000, this.leftMinuteValue);
    }

    private setTimeDetails(slider: string, selectedDate: any) {
        let timeSelectedFullDateObject = this.dateToString(selectedDate);
        switch (slider) {
            case 'left':
                {
                    this.filter.timeFilter.startTime = timeSelectedFullDateObject.fullDateString;
                    this.leftYearValue = timeSelectedFullDateObject.yearString;
                    this.leftMonthValue = timeSelectedFullDateObject.monthString;
                    this.leftDayValue = timeSelectedFullDateObject.dayString;
                    this.leftHourValue = timeSelectedFullDateObject.hourString;
                    this.leftMinuteValue = timeSelectedFullDateObject.minuteString;
                    this.leftSecondValue = timeSelectedFullDateObject.secondString;
                    this.leftMillisecondValue = timeSelectedFullDateObject.millisecondString;
                }
                break;
            case 'right':
                {
                    this.filter.timeFilter.endTime = timeSelectedFullDateObject.fullDateString;
                    this.rightYearValue = timeSelectedFullDateObject.yearString;
                    this.rightMonthValue = timeSelectedFullDateObject.monthString;
                    this.rightDayValue = timeSelectedFullDateObject.dayString;
                    this.rightHourValue = timeSelectedFullDateObject.hourString;
                    this.rightMinuteValue = timeSelectedFullDateObject.minuteString;
                    this.rightSecondValue = timeSelectedFullDateObject.secondString;
                    this.rightMillisecondValue = timeSelectedFullDateObject.millisecondString;
                }
                break;
            default:
                throw "error in slider case";
        }
    }

    private checkDate(percentage: number, slider: string): void {
        let minimumTimeMilliseconds: number;
        let currentTime = new Date();
        let currentDateMilliseconds = currentTime.getTime();
        minimumTimeMilliseconds = currentDateMilliseconds - this.lowerTimeLimitRadio;
        let differenceMilliseconds = currentDateMilliseconds - minimumTimeMilliseconds;
        let halfDifferenceTime = differenceMilliseconds / 2;
        let percentageTime = (halfDifferenceTime * percentage) / 100;
        let timeSelected: number;
        switch (slider) {
            case 'left':
                {
                    timeSelected = minimumTimeMilliseconds + Math.floor(percentageTime);
                }
                break;
            case 'right':
                {
                    timeSelected = currentDateMilliseconds - Math.floor(percentageTime);
                }
                break;
            default:
                throw "error in slider case";
        }
        let timeSelectedDate = new Date(timeSelected);
        this.setTimeDetails(slider, timeSelectedDate);
    }

    radioGroupOnChange(event: any): void {
        switch (event.value) {
            case '1':
                this.lowerTimeLimitRadio = 3600000;
                break;
            case '2':
                this.lowerTimeLimitRadio = 604800000;
                break;
            case '3':
                this.lowerTimeLimitRadio = 2629746000;
                break;
            case '4':
                this.lowerTimeLimitRadio = 15778476000;
                break;
            default:
                throw "radioGroupOnChange - wrong value to case"
        }
        this.modifyTimeWindow();
    }

    modifyTimeWindow(): void {
        if (this.leftSlideValue !== 0) {
            this.checkDate(this.leftSlideValue, 'left');
            if (this.rightValue !== 0) {
                this.checkDate(this.rightValue, 'right');
            }
        } else {
            this.resetTimeLimit('left');
        }
        console.log('filter: ', this.filter);
        this.DbDataService.sendRequest(this.filter);

    }

    private resetTimeLimit(slider: string): void {
        let currentTimeLimitDate: any = new Date();
        let dateToPass: any;
        switch (slider) {
            case 'left':
                let lowerTimeMilliseconds: number;
                let currentDateMilliseconds: number = currentTimeLimitDate.getTime();
                lowerTimeMilliseconds = currentDateMilliseconds - this.lowerTimeLimitRadio;
                let lowerTimeLimitDate = new Date(lowerTimeMilliseconds);
                dateToPass = lowerTimeLimitDate;
                break;
            case 'right':
                dateToPass = currentTimeLimitDate;
                break;
            default:
                throw "resetTimeLimit - wrong value to case"
        }
        this.setTimeDetails(slider, dateToPass);
    }

    moveLeftSlider(event: any) {
        this.leftSlideValue = event.value;
        if (event.value !== 0) {
            this.checkDate(event.value, 'left');
            if (this.rightValue !== 0) {
                this.checkDate(this.rightValue, 'right');
            }
        } else {
            this.resetTimeLimit('left');
        }
        console.log('filter: ', this.filter);
        this.DbDataService.sendRequest(this.filter);
    }

    moveRightSlider(event: any) {
        this.rightSlideValue = event.value;
        if (event.value !== 0) {
            this.checkDate(event.value, 'right');
            if (this.leftValue !== 0) {
                this.checkDate(this.leftValue, 'left');
            }
        } else {
            this.resetTimeLimit('right');
        }
        console.log('filter: ', this.filter);
        this.DbDataService.sendRequest(this.filter);
    }
}