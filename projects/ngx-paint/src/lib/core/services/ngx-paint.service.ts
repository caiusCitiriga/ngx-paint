import { Injectable } from '@angular/core';
import { CanvasElement } from 'projects/ngx-paint/src/lib/core/models/canvas-element.model';
import { CanvasElemetTypes } from 'projects/ngx-paint/src/lib/core/models/element-types.model';

@Injectable({
    providedIn: 'root'
})
export class NgxPaintService {

    private _canvas: HTMLCanvasElement;
    private _defaultCanvasSize: ICanvasSize;
    private _ctx: CanvasRenderingContext2D;

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
            this._ctx.lineWidth = 3;
            this._ctx.strokeStyle = 'red';

            this._ctx.strokeRect(activeElement.posX, activeElement.posY, activeElement.sizeW, activeElement.sizeH);
        }
    }

    private addImageToCanvas(element: CanvasElement): void {
        this._ctx.drawImage(element.image, 0, 0, element.sizeW, element.sizeH);
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