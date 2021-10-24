import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IPlatformTypes } from 'models/artist.types';
import { Observable } from 'rxjs';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';

@Component({
  selector: 'app-platform-selection',
  templateUrl: './platform-selection.component.html',
  styleUrls: ['./platform-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformSelectionComponent {
  @Input()
  connectedServices$!: Observable<ConnectedServicesList[]>;

  @Output() selectedPlatform = new EventEmitter<IPlatformTypes>();

  public connectedServices = IPlatformTypes;
  public selectedChip: IPlatformTypes = this.connectedServices.all;

  public selectChip(evt: IPlatformTypes): void {
    this.selectedChip = evt;
    this.selectedPlatform.emit(evt);
  }

  public identify(index: number, item: ConnectedServicesList) {
    return item.type;
  }
}

