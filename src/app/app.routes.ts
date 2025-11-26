import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClipService } from './services/clip.service';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
    resolve: {
      clip: ClipService,
    },
  },

  {
    path: '',
    loadChildren: () =>
      import('./video/video.routes').then((m) => m.videoRoutes),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
