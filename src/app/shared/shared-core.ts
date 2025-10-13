import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FbTimestampPipe } from '../pipes/fb-timestamp.pipe';


export const SharedCore = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  FbTimestampPipe,
  NgxMaskDirective,
  NgxMaskPipe
] as const;

export const SHARE_CORE_PROVIDER = [provideNgxMask()];