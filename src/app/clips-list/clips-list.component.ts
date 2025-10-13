import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service'; 
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedUI } from '../shared/shared-ui';
import { FbTimestampPipe } from '../pipes/fb-timestamp.pipe';


@Component({
  selector: 'app-clips-list',
  standalone: true,
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  imports: [CommonModule, SharedUI, RouterModule, FbTimestampPipe],
  providers: [DatePipe],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true;

  constructor(public clipService: ClipService) {
    this.clipService.getClips();
  }

  ngOnInit(): void {
    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }
  ngOnDestroy(): void {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    this.clipService.pageClips = [];
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;

    const { innerHeight } = window;

    const bottomOfWindow =
      Math.round(scrollTop) + innerHeight < offsetHeight - 100;

    if (bottomOfWindow) {
      this.clipService.getClips();
    }
  };
}