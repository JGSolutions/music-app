import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedPlatformComponent } from './connected-platform.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ConnectedPlatformComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    ConnectedPlatformComponent
  ]
})
export class ConnectedPlatformModule { }
