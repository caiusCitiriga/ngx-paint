import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgxPaintComponent } from './ngx-paint.component';
import { SanitizationPipe } from './core/pipes/sanitization.pipe';
import { NgxLayerPreviewComponent } from 'projects/ngx-paint/src/lib/core/components/layer-preview/ngx-layer-preview.component';

@NgModule({
    declarations: [
        SanitizationPipe,
        NgxPaintComponent,
        NgxLayerPreviewComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
    ],
    providers: [
    ],
    exports: [NgxPaintComponent]
})
export class NgxPaintModule { }
