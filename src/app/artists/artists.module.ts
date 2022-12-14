import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistsComponent } from './artists.component';
import { AngularMaterialModule } from 'src/angular-material.module';
import { ArtistItemModule } from '../shared/components/artist-item/artist-item.module';
import { PlatformSelectionModule } from '../shared/components/platform-selection/platform-selection.module';
import { EmptyResultsModule } from '../shared/components/empty-results/empty-results.module';

@NgModule({
  declarations: [ArtistsComponent],
  imports: [
    CommonModule,
    ArtistItemModule,
    AngularMaterialModule,
    PlatformSelectionModule,
    EmptyResultsModule,
    RouterModule.forChild([
      { path: '', component: ArtistsComponent },
    ]),
  ]
})
export class ArtistsModule { }
