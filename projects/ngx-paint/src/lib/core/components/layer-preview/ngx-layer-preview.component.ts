import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CanvasElement } from 'projects/ngx-paint/src/lib/core/models/canvas-element.model';

@Component({
    selector: 'ngx-layer-preview',
    templateUrl: './ngx-layer-preview.component.html',
    styleUrls: [
        '../../../../../node_modules/@mdi/font/css/materialdesignicons.min.css',
        './ngx-layer-preview.component.scss'
    ]
})
export class NgxLayerPreviewComponent implements OnInit {

    @Input('element') element: CanvasElement;

    @Output('onDeleteLayer') onDeleteLayer = new EventEmitter<CanvasElement>();
    @Output('onZoomLayerIn') onZoomLayerIn = new EventEmitter<CanvasElement>();
    @Output('onZoomLayerOut') onZoomLayerOut = new EventEmitter<CanvasElement>();
    @Output('onLayerSelected') onLayerSelected = new EventEmitter<CanvasElement>();

    public zoomFactor = 10;

    private autoZoomInInterval: any;
    private autoZoomOutInterval: any;

    public constructor() { }

    public ngOnInit(): void {
    }

    public onDeleteLayerClick(): void {
        this.onDeleteLayer.emit(this.element);
    }

    public onLayerClick(): void {
        this.onLayerSelected.emit(this.element);
    }

    public onZoomInMouseUp(): void {
        clearInterval(this.autoZoomInInterval);
    }

    public onZoomInMouseDown(): void {
        this.autoZoomInInterval = setInterval(() => this.onZoomInLayer(), 100);
    }

    public onZoomOutMouseUp(): void {
        clearInterval(this.autoZoomOutInterval);
    }

    public onZoomOutMouseDown(): void {
        this.autoZoomOutInterval = setInterval(() => this.onZoomOutLayer(), 100);
    }

    public onZoomInLayer(evt?: MouseEvent): void {
        if (!!evt) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        }

        this.element.zoomFactor = this.zoomFactor;
        this.onZoomLayerIn.emit(this.element);
    }

    public onZoomOutLayer(evt?: MouseEvent): void {
        if (!!evt) {
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        }

        this.element.zoomFactor = this.zoomFactor;
        this.onZoomLayerOut.emit(this.element);
    }
}
