export class CanvasElement {
    type: string;
    posX: number;
    posY: number;
    sizeW: number;
    sizeH: number;

    idx?: number;
    name?: string;
    active?: boolean;
    zoomFactor?: number;

    //  If image element
    image?: HTMLImageElement;
}