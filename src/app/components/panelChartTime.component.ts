// ANGULAR COMPONENTS
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { MdDialog } from '@angular/material';
//Services
import { DbDataService } from '../services/db.data.service';
// Libraries
import * as d3 from 'd3';
import * as _ from "lodash";


@Component({
    selector: 'panelChartTime',
    templateUrl: '../templates/panelChartTime.component.html',
    styleUrls: ['../styles/panelChartTime.component.css']
})
export class PanelChartTimeComponent {
    @ViewChild('chart') private chartContainer: ElementRef;
    @ViewChild('svgChart') private svgChartContainer: ElementRef;

    private data: any = [
        [new Date("2017-02-01T14:58:38.000Z"), 300],
        [new Date("2017-02-04T14:58:38.000Z"), 200],
        [new Date("2017-02-08T14:58:38.000Z"), 520],
        [new Date("2017-02-09T14:58:38.000Z"), 490],
        [new Date("2017-02-10T14:58:38.000Z"), 875],
        [new Date("2017-02-15T14:58:38.000Z"), 350],
        [new Date("2017-02-17T14:58:38.000Z"), 220],
        [new Date("2017-02-18T14:58:38.000Z"), 440],
        [new Date("2017-03-01T14:58:38.000Z"), 700],
        [new Date("2017-03-13T14:58:38.000Z"), 630]
    ];

    private margin: any = { top: 10, bottom: 10, left: 20, right: 20 };
    private chart: any;
    private width: number;
    private height: number;
    // private parseDate = d3.timeFormat("%Y-%m-%d %H:%M:%S").parse;
    private xScale: any;
    private yScale: any;
    private colors: any;
    private xAxis: any;
    private yAxis: any;
    private svg: any;


    private elasticDBServiceListener: any;
    // private items: Array<any> = null;
    private items: Array<any> = [];

    constructor(private DbDataService: DbDataService, private renderer2: Renderer2) { }

    ngAfterViewInit() {

        // OLD!!! this.createChart();

        this.setChartContainerHeight();
        this.setChart();
        if (!_.isEmpty(this.items)) {
            console.log('this.items init: ', this.items);
            this.redraw();
        }
        this.checkElasticDbService();
    }

    ngOnDestroy(): void {
        this.elasticDBServiceListener.unsubscribe();
    }
    setChartContainerHeight(): void {
        let ratio: number = 0.6;
        let element = this.chartContainer.nativeElement;
        let elementWidth = element.offsetWidth;
        let BoxH: number = elementWidth * ratio;
        let BoxHString: string = BoxH + 'px';
        this.renderer2.setStyle(element, 'height', BoxHString);
    }
    private setChart(): void {
        let element = this.chartContainer.nativeElement;
        let svgElement = this.svgChartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        this.svg = d3.select(svgElement)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('border', '1px #b9b9b9 solid');


        // chart plot area
        this.chart = this.svg.append('g')
            .attr('class', 'bars')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // define X & Y domains
        // X domain creates an array with the element 0 of the original array (it takes the labels)
        // let xDomain = this.items.map(d => d[0]);
        let xDomain = [new Date(2017, 0, 1), new Date(2017, 5, 1)];
        let yDomain = [0, 1000];

        // create scales
        // this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
        this.xScale = d3.scaleTime().domain(xDomain).range([0, 2 * this.width]);
        this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

        // bar colors
        this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);

        // x & y axis

        this.xAxis = this.svg.append('g')
            .attr('class', 'axis axis-x')
            // .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .attr('transform', `translate(${this.margin.left}, ${this.height - 3 * this.margin.top})`)
            .call(d3.axisBottom(this.xScale));
        this.yAxis = this.svg.append('g')
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(${this.margin.left}, ${3 * this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        // let update = this.chart.selectAll('.bar').data(this.data);

        // update
        //     .enter()
        //     .append('rect')
        //     .attr('class', 'bar')
        //     .attr('x', (d: any) => this.xScale(d[0]))
        //     .attr('y', (d: any) => this.yScale(0))
        //     .attr('width', 5)
        //     .attr('height', 0)
        //     .style('fill', '#3f51b5')
        //     .transition()
        //     .delay((d: any, i: any) => i * 200)
        //     .attr('y', (d: any) => this.yScale(d[1]))
        //     .attr('height', (d: any) => this.height - this.yScale(d[1]))
        //     ;
    }
    private redraw(): void {

        let update = this.chart.selectAll('.bar').data(this.data);

        update
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => this.xScale(d[0]))
            .attr('y', (d: any) => this.yScale(0))
            .attr('width', 5)
            .attr('height', 0)
            // .attr('height', (d: any) => (d[1]))
            // .style('fill', (d: any, i: any) => this.colors(i))
            .style('fill', '#3f51b5')
            .transition()
            .delay((d: any, i: any) => i * 200)
            .attr('y', (d: any) => this.yScale(d[1]))
            .attr('height', (d: any) => this.height - this.yScale(d[1]))
            ;

    }

    createChart() {
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        let svg = d3.select(element).append('svg')
            .attr('width', element.offsetWidth)
            .attr('height', element.offsetHeight);

        // chart plot area
        this.chart = svg.append('g')
            .attr('class', 'bars')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        // define X & Y domains
        // X domain creates an array with the element 0 of the original array (it takes the labels)
        // let xDomain = this.items.map(d => d[0]);
        let xDomain = [new Date(2017, 0, 1), new Date(2017, 5, 1)];
        let yDomain = [0, 1000];

        // create scales
        // this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
        this.xScale = d3.scaleTime().domain(xDomain).range([0, this.width]);
        this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

        // bar colors
        this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);

        // x & y axis
        this.xAxis = svg.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
            .call(d3.axisBottom(this.xScale));
        this.yAxis = svg.append('g')
            .attr('class', 'axis axis-y')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .call(d3.axisLeft(this.yScale));

        let update = this.chart.selectAll('.bar').data(this.data);

        update
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => this.xScale(d[0]))
            .attr('y', (d: any) => this.yScale(0))
            .attr('width', 5)
            .attr('height', 0)
            // .attr('height', (d: any) => (d[1]))
            // .style('fill', (d: any, i: any) => this.colors(i))
            .style('fill', '#3f51b5')
            .transition()
            .delay((d: any, i: any) => i * 200)
            .attr('y', (d: any) => this.yScale(d[1]))
            .attr('height', (d: any) => this.height - this.yScale(d[1]))
            ;
    }

    redrawOld() {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

        // update scales & axis
        // this.xScale.domain(this.items.map(d => d[0]));
        this.xScale.domain([0, 100]);
        this.yScale.domain([0, d3.max(this.items, d => d[1])]);
        this.colors.domain([0, this.items.length]);
        this.xAxis.transition().call(d3.axisBottom(this.xScale));
        this.yAxis.transition().call(d3.axisLeft(this.yScale));

        let update = this.chart.selectAll('.bar').data(this.items);

        // remove exiting bars
        update.exit().remove();

        // update existing bars
        this.chart.selectAll('.bar').transition()
            .attr('x', (d: any) => this.xScale(d[0]))
            .attr('y', (d: any) => this.yScale(d[1]))
            .attr('width', (d: any) => this.xScale.bandwidth())
            .attr('height', (d: any) => this.height - this.yScale(d[1]))
            .style('fill', (d: any, i: any) => this.colors(i));

        // add new bars
        update
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => this.xScale(d[0]))
            .attr('y', (d: any) => this.yScale(0))
            .attr('width', this.xScale.bandwidth())
            .attr('height', 0)
            .style('fill', (d: any, i: any) => this.colors(i))
            .transition()
            .delay((d: any, i: any) => i * 10)
            .attr('y', (d: any) => this.yScale(d[1]))
            .attr('height', (d: any) => this.height - this.yScale(d[1]));
    }

    private createInternalArray(arrayToProcess: Array<any>): Array<any> {
        let arrayOfmilliseconds: Array<any> = [];
        let tempDate: any = null;
        for (let i = 0; i < arrayToProcess.length; i++) {
            tempDate = new Date(arrayToProcess[i]._source.timestamp);
            arrayOfmilliseconds.push(tempDate.getTime());
        }
        let arrayMaxValue: number = Math.max(...arrayOfmilliseconds);
        let arrayMinValue: number = Math.min(...arrayOfmilliseconds);
        console.log('arrayOfmilliseconds: ', arrayOfmilliseconds);
        console.log('arrayMaxValue: ', arrayMaxValue);
        console.log('arrayMinValue: ', arrayMinValue);





        let arrayToReturn: Array<any> = [];
        for (let i = 0; i < arrayToProcess.length; i++) {
            arrayToReturn.push([
                arrayToProcess[i]._source.timestamp,
                arrayToProcess[i]._source.capacity.siplines
            ]);
        }
        return arrayToReturn;
    }

    private checkElasticDbService(): void {
        this.elasticDBServiceListener = this.DbDataService.activeElasticDbStateSubject.subscribe(
            response => {
                if (response) {
                    // console.log('the response for the elastic objects is: ', response);
                    // this.items = this.createInternalArray(response);
                    // this.redraw();
                } else {
                    console.log('no response for the elastic objects');
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }
}