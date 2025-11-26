import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';
import { SharedCore } from 'src/app/shared/shared-core';
import { SharedUI } from 'src/app/shared/shared-ui';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-manage',
  standalone: true,
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
  imports:[...SharedCore, ...SharedUI, EditComponent],
})
export class ManageComponent implements OnInit {
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null
  sort$: BehaviorSubject<string>

  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clipService = inject(ClipService);
  private modal = inject(ModalService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(): void {

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: Params) => {
        this.videoOrder = params['sort'] === '2' ? params['sort'] : '1'
        this.sort$.next(this.videoOrder)
      })

    this.clipService.getUserClips(this.sort$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(docs => {
        this.clips = []
        docs.forEach(doc => {
          this.clips.push({
            docID: doc.id,
            ...doc.data()
          })
        })
      })
   }
  
  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement) 
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
          sort: value
      }
       })
    
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()
    this.activeClip = clip
  this.modal.toggleModal('editClip')
}

  update($event: IClip) {
    // Usar === en lugar de ==
    const index = this.clips.findIndex(clip => clip.docID === $event.docID);
    if (index !== -1) {
      this.clips[index].title = $event.title;
    }
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()

    this.clipService.deleteClip(clip)

    
    const index = this.clips.findIndex(element => element.docID === clip.docID);
    if (index !== -1) {
      this.clips.splice(index, 1);
    }
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    $event.preventDefault()

    if (!docID) {
      console.error('No se puede copiar: docID no está definido');
      return;
    }

    const url = `${location.origin}/clip/${docID}`

    try {
      await navigator.clipboard.writeText(url)
     
      alert('Link Copied!')
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      alert('Error al copiar el enlace');
    }
  }

}
