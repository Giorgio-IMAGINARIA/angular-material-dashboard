import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
@Directive({
    selector: '[preserveAspect]'
})
export class PreserveAspectDirective {
    private margin: any = { top: 10, bottom: 10, left: 40, right: 40 };

    constructor(private el: ElementRef, private renderer2: Renderer2) { }
    @Input('preserveAspect') ratio: number;

    @HostListener('window:resize', ['$event']) onResize(event: any) {
        this.preserveAspectFunc(this.ratio);
    }

    ngAfterViewInit() {
        this.preserveAspectFunc(this.ratio);
    }

    private preserveAspectFunc(ratio: number): void {
        console.log('this.el.nativeElement', this.el.nativeElement);
        console.log('this.el.nativeElement.offsetWidth: ', this.el.nativeElement.offsetWidth);
        let BoxW: number = this.el.nativeElement.offsetWidth;
        let BoxH: number = BoxW * ratio;
        let BoxHString: string = BoxH + 'px';
        this.renderer2.setStyle(this.el.nativeElement, 'height', BoxHString);
    }

}