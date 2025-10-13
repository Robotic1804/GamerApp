import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/');

export const videoRoutes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToHome,
    },
  },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToHome,
    },
  },
  {
    path: 'manage-clips',
    redirectTo: 'manage',
    pathMatch: 'full',
  },
];
