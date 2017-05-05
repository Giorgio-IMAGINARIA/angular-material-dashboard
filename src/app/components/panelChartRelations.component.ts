// ANGULAR COMPONENTS
import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { MdIconRegistry } from '@angular/material';
import { MdDialog } from '@angular/material';
//Services
import { DbDataService } from '../services/db.data.service';
import { NodePanelService } from '../services/nodePanel.service';
import { LinkPanelService } from '../services/linkPanel.service';
import { ForceChartDataProcessService } from '../services/forceChartDataProcess.service';

// Libraries
import * as d3 from 'd3';
import * as _ from "lodash";

// Data
import { ForceData } from '../data/forceData';
import { ForceDataChange } from '../data/forceDataChange';

// Interfaces
interface LinkPanelPropertiesInterface {
    sourceID: string;
    sourceGroup: number;
    targetID: string;
    targetGroup: number;
    additionalInfo: {
        info1: string;
        info2: string;
        info3: string;
    };
}

interface NodePanelPropertiesInterface {
    id: string;
    group: number;
    additionalInfo: {
        info1: string;
        info2: string;
        info3: string;
    };
}

@Component({
    selector: 'panelChartRelations',
    templateUrl: '../templates/panelChartRelations.component.html',
    styleUrls: ['../styles/panelChartRelations.component.css']
})
export class PanelChartRelationsComponent {


    allCheck = false;
    group0Check = false;


    @ViewChild('chart') private chartContainer: ElementRef;
    @ViewChild('svgChart') private svgChartContainer: ElementRef;

    private temporaryCount: number = 0;

    private margin: any = { top: 10, bottom: 10, left: 20, right: 20 };
    private width: number;
    private height: number;
    private color: any = d3.scaleOrdinal(d3.schemeCategory20);
    private nodes: Array<any> = [];
    private links: Array<any> = [];
    private simulation: any;
    private svg: any;
    private rect: any;
    private nodeLayer: any;
    private nodeLabelLayer: any;
    private linkLayer: any;

    private elasticDBServiceListener: any;
    private forceDirectedProcessedServiceListener: any;
    private nodePanelServiceListener: any;
    private linkPanelServiceListener: any;
    private items: any = {};
    private group: number = null;

    private selectedNode: string = null;
    private selectedLink: LinkPanelPropertiesInterface = {
        sourceID: null,
        sourceGroup: null,
        targetID: null,
        targetGroup: null,
        additionalInfo: {
            info1: null,
            info2: null,
            info3: null
        }
    };

    constructor(private DbDataService: DbDataService, private linkPanelService: LinkPanelService, private nodePanelService: NodePanelService, private forceChartDataProcessService: ForceChartDataProcessService, private renderer2: Renderer2) { }

    ngAfterViewInit() {
        this.setChartContainerHeight();
        this.setChart();
        if (!_.isEmpty(this.items)) {
            console.log('this.items init: ', this.items);
            this.redraw();
        }
        this.checkElasticDbService();
        this.checkForceDirectedProcessedDataService();
        this.checkNodePanelService();
        this.checkLinkPanelService();
    }

    ngOnDestroy(): void {
        this.elasticDBServiceListener.unsubscribe();
        this.nodePanelServiceListener.unsubscribe();
        this.forceDirectedProcessedServiceListener.unsubscribe();
    }

    @HostListener('window:resize', ['$event']) onResize(event: any): void {
        this.resizeChart();
    }

    resizeChart(): void {
        this.setChartContainerHeight();
        let element = this.chartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
        this.rect
            .attr('width', this.width)
            .attr('height', this.height);
        this.simulation
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));
        this.simulation.alpha(0.3).restart();
    }

    closeNodePanel(): void {
        console.log('close panel');
        this.nodePanelService.setNodePanelOpenState(false);
    }

    setChartContainerHeight(): void {
        let ratio: number = 0.6;
        let element = this.chartContainer.nativeElement;
        let elementWidth = element.offsetWidth;
        let BoxH: number = elementWidth * ratio;
        let BoxHString: string = BoxH + 'px';
        this.renderer2.setStyle(element, 'height', BoxHString);
    }

    setChart(): void {
        let element = this.chartContainer.nativeElement;
        let svgElement = this.svgChartContainer.nativeElement;
        this.width = element.offsetWidth - this.margin.left - this.margin.right;
        this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
        this.svg = d3.select(svgElement)
            .attr('width', this.width)
            .attr('height', this.height)
            .style('border', '1px #b9b9b9 solid');

        this.svg
            .append("rect");

        this.rect = d3.select("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .style("cursor", "all-scroll")
            .call(d3.zoom()
                .scaleExtent([1 / 2, 4])
                .on("zoom", this.zoomed.bind(this)));

        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d: any) { return d.id; }))
            .force("link", d3.forceLink().id(function (d: any) { return d.id; }).distance(100).strength(1))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));
        this.linkLayer = this.svg.append('g')
            .attr('id', 'link-layer');
        this.nodeLayer = this.svg.append('g')
            .attr('id', 'node-layer');
        this.nodeLabelLayer = this.svg.append('g')
            .attr('id', 'label-layer');
    }
    zoomed(): void {
        this.nodeLayer.attr("transform", d3.event.transform);
        this.nodeLabelLayer.attr("transform", d3.event.transform);
        this.linkLayer.attr("transform", d3.event.transform);
    }

    redraw(): void {
        let node = this.nodeLayer
            .selectAll(".node")
            .data(this.nodes, (d: any) => { return d.id; });
        node
            .enter()
            .append("circle")
            .attr("class", (d: any) => { return "node " + d.id; })
            .style("cursor", "pointer")
            .attr("r", (d: any): any => { return d.clicked ? 25 : 10; })
            .style("fill", (d: any): any => { return this.color.bind(this)(d.group); })
            .attr("stroke", "#424242")
            .attr("stroke-width", (d: any): any => { return d.clicked ? "4px" : "3px"; })
            .on("click", this.sendNodeInfo.bind(this))
            .call(d3.drag()
                .on("start", this.dragstarted.bind(this))
                .on("drag", this.dragged.bind(this))
                .on("end", this.dragended.bind(this)))
            .append("title")
            .text(function (d: any) { return d.id; });

        node.exit().remove();

        let nodeLabel = this.nodeLabelLayer
            .selectAll(".nodeLabel")
            .data(this.nodes, (d: any) => { return d.id; });

        nodeLabel
            .enter()
            .append("text")
            .attr("class", (d: any) => { return "nodeLabel " + d.id; })
            .style("fill", (d: any): any => { return d.clicked ? "#ef5350" : "#5c6bc0"; })
            .style("font-size", (d: any): any => { return d.clicked ? "18px" : "15px"; })

            .attr("width", (d: any): any => { return d.clicked ? "20" : "10"; })
            .attr("height", (d: any): any => { return d.clicked ? "20" : "10"; })
            .text(function (d: any) { return d.id; });

        nodeLabel.exit().remove();

        let link = this.linkLayer
            .selectAll(".link")
            .data(this.links, (d: any) => { return d.source.id + "-" + d.target.id; });

        link
            .enter().append("line")
            .attr("class", "link")
            .attr("style", "cursor:pointer;")
            .attr("stroke", (d: any): any => { return d.clicked ? "#ef5350" : "#424242"; })
            .attr("stroke-width", "5px")
            .attr("stroke-dasharray", (d: any): any => { return d.clicked ? "5" : "0"; })
            .on("click", this.sendLinkInfo.bind(this));

        link.exit().remove();

        this.simulation
            .nodes(this.nodes)
            .on("tick", this.tick.bind(this));

        this.simulation.force("link")
            .links(this.links);
    }

    tick(): void {
        this.linkLayer
            .selectAll('.link')
            .attr("x1", (d: any) => { return d.source.x; })
            .attr("y1", (d: any) => { return d.source.y; })
            .attr("x2", (d: any) => { return d.target.x; })
            .attr("y2", (d: any) => { return d.target.y; });

        this.nodeLayer
            .selectAll('.node')
            .attr("cx", (d: any) => { return d.x; })
            .attr("cy", (d: any) => { return d.y; });

        this.nodeLabelLayer
            .selectAll('.nodeLabel')
            .attr("x", function (d: any) {
                let distanceToPass: number;
                d.clicked ? distanceToPass = 30 : distanceToPass = 13;
                return d.x + distanceToPass;
            })
            .attr("y", function (d: any) { return d.y + 5; });
    }

    dragstarted(d: any) {
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(d: any): void {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    dragended(d: any) {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    checkNode(nodeID: string, link: LinkPanelPropertiesInterface, i: number): void {
        if (nodeID) {
            if (nodeID === this.selectedNode) {
                if (nodeID === this.items.data.nodes[i].id) {
                    this.items.data.nodes[i].clicked = false;
                } else {
                    this.nodes.push(this.items.data.nodes[i]);
                }
            } else {
                if (nodeID === this.items.data.nodes[i].id) {
                    this.items.data.nodes[i].clicked = true;
                } else if (this.selectedNode === this.items.data.nodes[i].id) {
                    this.items.data.nodes[i].clicked = false;
                } else {
                    this.nodes.push(this.items.data.nodes[i]);
                }
            }
        } else {
            if (link && this.selectedNode) {
                if (this.items.data.nodes[i].id === this.selectedNode) {
                    this.items.data.nodes[i].clicked = false;
                    this.selectedNode = null;
                } else {
                    this.nodes.push(this.items.data.nodes[i]);
                }
            } else {
                this.nodes.push(this.items.data.nodes[i]);
            }
        }
    }

    checkLink(nodeID: string, link: LinkPanelPropertiesInterface, i: number): void {
        if (link) {
            if ((link.sourceID === this.selectedLink.sourceID) && (link.targetID === this.selectedLink.targetID)) {
                if (((link.sourceID === this.items.data.links[i].sourceID) && (link.targetID === this.items.data.links[i].targetID)) || ((link.sourceID === this.items.data.links[i].targetID) && (link.targetID === this.items.data.links[i].sourceID))) {
                    this.items.data.links[i].clicked = false
                } else {
                    this.links.push(this.items.data.links[i]);
                }
            } else {
                if (((link.sourceID === this.items.data.links[i].sourceID) && (link.targetID === this.items.data.links[i].targetID)) || ((link.sourceID === this.items.data.links[i].targetID) && (link.targetID === this.items.data.links[i].sourceID))) {
                    this.items.data.links[i].clicked = true;
                }
                else if ((this.selectedLink.sourceID === this.items.data.links[i].sourceID) && (this.selectedLink.targetID === this.items.data.links[i].targetID)) {
                    this.items.data.links[i].clicked = false;
                }
                else {
                    this.links.push(this.items.data.links[i]);
                }
            }
        } else {
            if (nodeID && this.selectedLink.sourceID) {
                if ((this.selectedLink.sourceID === this.items.data.links[i].sourceID) && (this.selectedLink.targetID === this.items.data.links[i].targetID)) {
                    this.items.data.links[i].clicked = false;
                    this.selectedLink.sourceID = null;
                    this.selectedLink.sourceGroup = null;
                    this.selectedLink.targetID = null;
                    this.selectedLink.targetGroup = null;
                    this.selectedLink.additionalInfo.info1 = null;
                    this.selectedLink.additionalInfo.info2 = null;
                    this.selectedLink.additionalInfo.info3 = null;
                } else {
                    this.links.push(this.items.data.links[i]);
                }
            } else {
                this.links.push(this.items.data.links[i]);
            }
        }
    }

    processNewData(nodeID: string, link: LinkPanelPropertiesInterface): void {
        this.nodes = [];
        for (let i = 0; i < this.items.data.nodes.length; i++) {
            if (typeof (this.group) === 'number') {
                if (this.items.data.nodes[i].group === this.group) {
                    this.checkNode(nodeID, link, i);
                } else {
                    if ((nodeID && this.selectedNode) || (link && this.selectedNode)) {
                        if (this.items.data.nodes[i].id === this.selectedNode) {
                            this.items.data.nodes[i].clicked = false;
                            this.selectedNode = null;
                        }
                    }
                }
            } else {
                this.checkNode(nodeID, link, i);
            }
        }
        if (nodeID) {
            if (nodeID === this.selectedNode) {
                this.selectedNode = null;
            } else {
                this.selectedNode = nodeID;
            }
        }
        this.links = [];
        for (let i = 0; i < this.items.data.links.length; i++) {
            if (typeof (this.group) === 'number') {
                if ((this.items.data.links[i].sourceGroup === this.group) && (this.items.data.links[i].targetGroup === this.group)) {
                    this.checkLink(nodeID, link, i);
                } else {
                    if ((nodeID && this.selectedLink.sourceID) || (link && this.selectedLink.sourceID)) {
                        if ((this.selectedLink.sourceID === this.items.data.links[i].sourceID) && (this.selectedLink.targetID === this.items.data.links[i].targetID)) {
                            this.items.data.links[i].clicked = false;
                            this.selectedLink.sourceID = null;
                            this.selectedLink.targetID = null;
                        }
                    }
                }
            } else {
                this.checkLink(nodeID, link, i);
            }
        }
        if (link) {
            if ((link.sourceID === this.selectedLink.sourceID) && (link.targetID === this.selectedLink.targetID)) {
                this.selectedLink.sourceID = null;
                this.selectedLink.sourceGroup = null;
                this.selectedLink.targetID = null;
                this.selectedLink.targetGroup = null;
                this.selectedLink.additionalInfo.info1 = null;
                this.selectedLink.additionalInfo.info2 = null;
                this.selectedLink.additionalInfo.info3 = null;
            } else {
                this.selectedLink.sourceID = link.sourceID;
                this.selectedLink.sourceGroup = link.sourceGroup;
                this.selectedLink.targetID = link.targetID;
                this.selectedLink.targetGroup = link.targetGroup;
                this.selectedLink.additionalInfo.info1 = link.additionalInfo.info1;
                this.selectedLink.additionalInfo.info2 = link.additionalInfo.info2;
                this.selectedLink.additionalInfo.info3 = link.additionalInfo.info3;
            }
        }
        this.simulation.alphaTarget(0.3).restart();
    }

    sendNodeInfo(node: NodePanelPropertiesInterface): void {
        this.processNewData(node.id, null);
        this.redraw();
        this.processNewData(null, null);
        this.redraw();
        if (this.selectedNode) {
            let infoToSend: NodePanelPropertiesInterface = {
                "id": node.id,
                "group": node.group,
                "additionalInfo": node.additionalInfo
            }
            this.nodePanelService.setNodePanelState(infoToSend);
            this.nodePanelService.setNodePanelOpenState(true);
        } else {
            this.nodePanelService.setNodePanelOpenState(false);
        }
    }

    sendLinkInfo(link: LinkPanelPropertiesInterface): void {
        this.processNewData(null, link);
        this.redraw();
        this.processNewData(null, null);
        this.redraw();
        if (this.selectedLink.sourceID) {
            let infoToSend: LinkPanelPropertiesInterface = {
                sourceID: link.sourceID,
                sourceGroup: link.sourceGroup,
                targetID: link.targetID,
                targetGroup: link.targetGroup,
                additionalInfo: {
                    info1: link.additionalInfo.info1,
                    info2: link.additionalInfo.info2,
                    info3: link.additionalInfo.info3
                }
            }
            this.linkPanelService.setLinkPanelState(infoToSend);
            this.linkPanelService.setLinkPanelOpenState(true);

        } else {
            this.linkPanelService.setLinkPanelOpenState(false);
        }
    }

    public changeData(group: number) {
        this.group = group;
        this.processNewData(null, null);
        this.redraw();
    }

    private dehighlightNodes(): void {
        this.processNewData(this.selectedNode, null);
        this.redraw();
        this.processNewData(null, null);
        this.redraw();
    }

    private dehighlightLinks(): void {
        this.processNewData(null, this.selectedLink);
        this.redraw();
        this.processNewData(null, null);
        this.redraw();
    }

    private checkElasticDbService(): void {
        this.elasticDBServiceListener = this.DbDataService.activeElasticDbStateSubject.subscribe(
            response => {
                if (response) {
                    // console.log('Response for the elastic objects from relations : ', response);
                    this.forceChartDataProcessService.processElasticSearchData(response);
                } else {
                    console.log('no response for the elastic objects');
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }

    private checkForceDirectedProcessedDataService(): void {
        this.forceDirectedProcessedServiceListener = this.forceChartDataProcessService.processedElasticDataStateSubject.subscribe(
            response => {
                if (response) {
                    console.log('processedDataToVisualise : ', response);
                    this.items = response;
                    if (this.selectedNode) {
                        let isSelectedNodeDeleted: boolean = true;
                        for (let i = 0; i < this.items.data.nodes.length; i++) {
                            if (this.items.data.nodes[i].id === this.selectedNode) {
                                this.items.data.nodes[i].clicked = true;
                                this.nodePanelService.setNodePanelState(this.items.data.nodes[i]);
                                isSelectedNodeDeleted = false;
                            }
                        }
                        if (isSelectedNodeDeleted) {
                            this.nodePanelService.setNodePanelOpenState(false);
                            this.selectedNode = null;
                        }
                    } else if (this.selectedLink.sourceID) {
                        let isSelectedLinkDeleted: boolean = true;
                        for (let i = 0; i < this.items.data.links.length; i++) {
                            if ((this.selectedLink.sourceID === this.items.data.links[i].sourceID) && (this.selectedLink.targetID === this.items.data.links[i].targetID)) {
                                this.items.data.links[i].clicked = true;
                                this.linkPanelService.setLinkPanelState(this.items.data.links[i]);
                                isSelectedLinkDeleted = false;
                            }
                        }
                        if (isSelectedLinkDeleted) {
                            this.linkPanelService.setLinkPanelOpenState(false);
                            this.selectedLink.sourceID = null;
                            this.selectedLink.sourceGroup = null;
                            this.selectedLink.targetID = null;
                            this.selectedLink.targetGroup = null;
                            this.selectedLink.additionalInfo.info1 = null;
                            this.selectedLink.additionalInfo.info2 = null;
                            this.selectedLink.additionalInfo.info3 = null;
                        }
                    }
                    this.processNewData(null, null);
                    this.redraw();
                } else {
                    console.log('no response for the elastic objects');
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }

    private checkNodePanelService(): void {
        this.nodePanelServiceListener = this.nodePanelService.nodePanelOpenStateSubject.subscribe(
            response => {
                if (response) {
                    console.log('The node panel is opening');
                } else {
                    this.dehighlightNodes();
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }

    private checkLinkPanelService(): void {
        this.linkPanelServiceListener = this.linkPanelService.linkPanelOpenStateSubject.subscribe(
            response => {
                if (response) {
                    console.log('The link panel is opening');
                } else {
                    this.dehighlightLinks();
                }
            },
            error => console.log('Error! Description: ' + error)
        );
    }

}