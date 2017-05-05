// Angular modules
import { NgModule } from '@angular/core';
import { Renderer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// Routing
import { routing } from './app.routing';
// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard.component';
import { PanelControlsComponent } from './components/panelControls.component';
import { PanelChartListComponent } from './components/panelChartList.component';
import { PanelNodeDetailsComponent } from './components/panelNodeDetails.component';
import { PanelLinkDetailsComponent } from './components/panelLinkDetails.component';
import { PanelChartRelationsComponent } from './components/panelChartRelations.component';
import { PanelChartTimeComponent } from './components/panelChartTime.component';
import { DialogOverviewExampleDialog } from './components/dialogOverviewExampleDialog.component';
// Directives
import { PreserveAspectDirective } from './directives/preserveAspect.directive';
// Services
import { DbDataService } from './services/db.data.service';
import { NodePanelService } from './services/nodePanel.service';
import { LinkPanelService } from './services/linkPanel.service';
import { ForceChartDataProcessService } from './services/forceChartDataProcess.service';

// External modules
import { MaterialModule } from '@angular/material';
import 'hammerjs';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    MaterialModule,
    BrowserAnimationsModule
  ],
  declarations: [
    // Components
    AppComponent,
    DashboardComponent,
    PanelControlsComponent,
    PanelChartListComponent,
    PanelNodeDetailsComponent,
    PanelLinkDetailsComponent,
    PanelChartRelationsComponent,
    PanelChartTimeComponent,
    // Directives
    PreserveAspectDirective,
  ],
  providers: [
    DbDataService,
    NodePanelService,
    LinkPanelService,
    ForceChartDataProcessService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }