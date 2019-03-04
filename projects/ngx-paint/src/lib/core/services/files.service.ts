import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FilesService {

    public uploadFile(multipleFiles: boolean, ...extensionMimes: string[]): Observable<File[]> {
        return new Observable(resolver => {
            const element = document.createElement('input');
            element.setAttribute('type', 'file');
            if (multipleFiles) {
                element.setAttribute('multiple', 'multiple');
            }
            if (extensionMimes && extensionMimes.length > 0) {
                element.setAttribute('accept', extensionMimes.join(','));
            }

            element.onchange = e => {
                element.remove();

                if (!e || !e.target) {
                    return;
                }

                const files = <File[]>(<any>e.target).files;
                if (!files || files.length <= 0) {
                    resolver.error();
                    resolver.complete();
                }

                resolver.next(Array.from(files));
                resolver.complete();

                // Js does not fire the event if you select the same file twice. With this trick does it!
                element.value = '';
            };
            element.click();
        });
    }

    public getStringFromFile(file: File): Observable<string> {
        return new Observable(resolver => {
            const reader = new FileReader();
            reader.onload = () => {
                resolver.next(reader.result as any);
                resolver.complete();
            };
            reader.readAsText(file);
        });
    }

    public getBase64FromFile(file: File): Observable<string | ArrayBuffer> {
        return new Observable(resolver => {
            const reader = new FileReader();
            reader.onload = () => {
                resolver.next(reader.result);
                resolver.complete();
            };
            reader.readAsDataURL(file);
        });
    }

    public downloadByBlob(fileName: string, mimeType: string, blob: any): void {
        const a = document.createElement('a');
        const wrappedBlob = new Blob([blob], { 'type': mimeType });
        a.href = window.URL.createObjectURL(wrappedBlob);
        a.download = fileName;
        a.click();
    }

    public downloadByUrl(url: string, fileName: string): void {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        a.remove();
    }

    public downloadFromBase64String(base64String: string, fileName: string, mimeType: string): void {
        // decode base64 string, remove space for IE compatibility
        const binary = atob(base64String.replace(/\s/g, ''));
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }

        // create the blob object with content-type
        const blob = new Blob([view], { type: mimeType });
        this.downloadByBlob(fileName, mimeType, blob);
    }

}