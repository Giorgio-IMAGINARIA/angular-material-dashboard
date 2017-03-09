// Angular modules
import { NgModule} from '@angular/core';
import { Renderer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// Routing
import { routing } from './app.routing';
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login.component';
// Directives
// Services
// External modules
import { MaterialModule } from '@angular/material';
import 'hammerjs';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    MaterialModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }