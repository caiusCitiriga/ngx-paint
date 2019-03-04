import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgxPaintService } from 'projects/ngx-paint/src/lib/core/services/ngx-paint.service';
import { FilesService } from 'projects/ngx-paint/src/lib/core/services/files.service';
import { CanvasElement } from 'projects/ngx-paint/src/lib/core/models/canvas-element.model';
import { CanvasElemetTypes } from 'projects/ngx-paint/src/lib/core/models/element-types.model';

@Component({
    selector: 'ngx-paint',
    templateUrl: './ngx-paint.component.html',
    styleUrls: [
        '../../node_modules/@mdi/font/css/materialdesignicons.min.css',
        './ngx-paint.component.scss'
    ]
})
export class NgxPaintComponent implements OnInit {

    @Input('wrapperWidth') wrapperWidth: string;
    @Input('wrapperHeight') wrapperHeight: string;

    @ViewChild('canvas') private _canvas: ElementRef<HTMLCanvasElement>;

    public isDragging: boolean = false;
    public canvasElements: CanvasElement[] = [];

    public constructor(
        private readonly filesSvc: FilesService,
        private readonly paintSvc: NgxPaintService
    ) { }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        this.paintSvc.canvas = this._canvas.nativeElement;
    }

    public onCanvasMouseDown(evt: MouseEvent): void {
        let activeElement = this.canvasElements.find(el => el.active);
        if (!!activeElement && !this.paintSvc.isDragModeEnabled) {
            this.isDragging = true;
            this.paintSvc.enableDragMode = true;
        }
    }

    public onCanvasMouseUp(evt: MouseEvent): void {
        let activeElement = this.canvasElements.find(el => el.active);
        if (!!activeElement && !!this.paintSvc.isDragModeEnabled) {
            this.isDragging = false;
            this.paintSvc.enableDragMode = false;
        }
    }

    public onCanvasMouseMove(evt: MouseEvent): void {
        let activeElement = this.canvasElements.find(el => el.active);
        if (!activeElement || !this.paintSvc.isDragModeEnabled) {
            return;
        }

        activeElement = this.paintSvc.dragElement(evt, activeElement);
        this.paintSvc.updateCanvas(this.canvasElements);
    }

    public onDeleteLayerClick(layer: CanvasElement): void {
        this.canvasElements = this.canvasElements.filter(ce => ce.idx !== layer.idx);
        this.paintSvc.updateCanvas(this.canvasElements);
    }

    public onLayerClick(layer: CanvasElement): void {
        layer.active = !layer.active;

        this.canvasElements.forEach((ce, idx) => {
            if (ce.idx === layer.idx) {
                return;
            }

            this.canvasElements[idx].active = false;
        });

        this.paintSvc.updateCanvas(this.canvasElements);
    }

    public onZoomInLayer(layer: CanvasElement): void {
        layer.sizeW += layer.zoomFactor;
        layer.sizeH = (layer.image.naturalHeight / layer.image.naturalWidth) * layer.sizeW;

        this.paintSvc.updateCanvas(this.canvasElements);
    }

    public onZoomOutLayer(layer: CanvasElement): void {
        layer.sizeW -= layer.zoomFactor;
        layer.sizeH = (layer.image.naturalHeight / layer.image.naturalWidth) * layer.sizeW;

        this.paintSvc.updateCanvas(this.canvasElements);
    }

    public uploadImage(): void {
        this.filesSvc.uploadFile(true, 'png', 'jpg').subscribe(files => {
            if (!files || !files.length) {
                return;
            }

            files.forEach(file => {
                this.filesSvc.getBase64FromFile(file).subscribe(b64 => {
                    const image = new Image();

                    image.onload = () => {
                        //  When data will be loaded, use the image to get its original size
                        const canvasEL = new CanvasElement();
                        canvasEL.posX = 0;
                        canvasEL.posY = 0;
                        canvasEL.image = image;
                        canvasEL.sizeW = image.naturalWidth;
                        canvasEL.sizeH = image.naturalHeight;
                        canvasEL.type = CanvasElemetTypes.image;
                        canvasEL.idx = this.canvasElements.length + 1;
                        //  Add it to the canvas elements array
                        this.canvasElements.push(canvasEL);
                    }

                    //  Set the B64 data as src to the image
                    image.src = b64.toString();
                });
            });

            setTimeout(() => {
                this.paintSvc.updateCanvas(this.canvasElements);
            }, 100);
        });
    }

}
