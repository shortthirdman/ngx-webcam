import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild("video", { static: true }) video: ElementRef;
    @ViewChild("canvas", { static: true }) canvas: ElementRef;
	captures: Array<any>;
	
	videoWidth = 0;
    videoHeight = 0;
    private constraints = {
        video: {
            facingMode: "environment",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
        }
    };
	
	constructor(private renderer: Renderer2) {
		this.captures = [];
	}
	
	ngOnInit(): void {
	}
	
	ngAfterViewInit(): void {
		if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
                this.attachVideo(stream);
            })
			.catch(err => console.error(err));
        } else {
			alert("No camera available")
		}
    }
	
	ngOnDestroy(): void {
		this.captures = [];
	}
	
	private attachVideo(stream: any): void {
        this.renderer.setProperty(this.video.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.video.nativeElement, 'play', (event) => {
            this.videoHeight = this.video.nativeElement.videoHeight;
            this.videoWidth = this.video.nativeElement.videoWidth;
        });
    }

	capture() {
		this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
        this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
		const context = this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
        this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
	}
}
