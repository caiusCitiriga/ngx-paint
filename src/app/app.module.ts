import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxPaintModule } from 'projects/ngx-paint/src/public_api';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        NgxPaintModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
