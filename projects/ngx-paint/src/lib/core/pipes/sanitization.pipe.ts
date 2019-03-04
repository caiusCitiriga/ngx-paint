import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'sanitization'
})
export class SanitizationPipe implements PipeTransform {

    public constructor(private readonly domSanitizer: DomSanitizer) { }

    transform(url: string, args?: any): any {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }

}
