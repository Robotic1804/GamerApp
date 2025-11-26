import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import videojs from 'video.js';
import IClip from '../models/clip.model';
import { DatePipe } from '@angular/common';
import { SharedCore } from '../shared/shared-core';
import { SharedUI } from '../shared/shared-ui';

@Component({
  selector: 'app-clip',
  standalone: true,
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
  imports: [...SharedCore, ...SharedUI],
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef
  player?: videojs.Player
  clip?: IClip

  
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement)


    this.route.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.clip = data['clip'] as IClip

        this.player?.src({
          src: this.clip.url,
          type: 'video/mp4'
        })
      })
  }
}

