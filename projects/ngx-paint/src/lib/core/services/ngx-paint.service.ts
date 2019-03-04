import { Injectable } from '@angular/core';
import { CanvasElement } from 'projects/ngx-paint/src/lib/core/models/canvas-element.model';
import { CanvasElemetTypes } from 'projects/ngx-paint/src/lib/core/models/element-types.model';

@Injectable({
    providedIn: 'root'
})
export class NgxPaintService {

    private readonly activeElementStrokeWidth = 3;
    private readonly activeElementStrokeColor = '#03A9F4';

    private _canvas: HTMLCanvasElement;
    private _dragModeOn: boolean = false;
    private _ctx: CanvasRenderingContext2D;
    private _defaultCanvasSize: ICanvasSize;

    public constructor() {
        this._defaultCanvasSize = {
            w: 540,
            h: 755
        };
    }

    public set canvas(c: HTMLCanvasElement) {
        this._canvas = c;
        this._canvas = this.sizeCanvas(c);
        this._ctx = this._canvas.getContext('2d');
    }

    public set enableDragMode(value: boolean) {
        this._dragModeOn = value;
    }

    public get isDragModeEnabled(): boolean {
        return this._dragModeOn;
    }

    public updateCanvas(elements: CanvasElement[]): void {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        elements.forEach(element => {
            if (element.type === CanvasElemetTypes.image) {
                this.addImageToCanvas(element);
            }
        });

        //  Find the active element if any
        const activeElement = elements.find(el => el.active);
        if (activeElement && activeElement.type === CanvasElemetTypes.image && activeElement.active) {
            this._ctx.lineWidth = this.activeElementStrokeWidth;
            this._ctx.strokeStyle = this.activeElementStrokeColor;

            this._ctx.strokeRect(activeElement.posX, activeElement.posY, activeElement.sizeW, activeElement.sizeH);
        }
    }

    public dragElement(mouseEvent: MouseEvent, element: CanvasElement): CanvasElement {
        element.posY = mouseEvent.y - this._canvas.offsetTop;
        element.posX = mouseEvent.x - this._canvas.offsetLeft;

        return element;
    }

    private addImageToCanvas(element: CanvasElement): void {
        this._ctx.drawImage(element.image, element.posX, element.posY, element.sizeW, element.sizeH);
    }

    private sizeCanvas(c: HTMLCanvasElement): HTMLCanvasElement {
        c.width = this._defaultCanvasSize.w;
        c.height = this._defaultCanvasSize.h;
        return c;
    }

}

export interface ICanvasSize {
    w: number,
    h: number
}