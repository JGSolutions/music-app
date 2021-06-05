import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlatformTypes } from 'models/artist.types';
import { Observable } from 'rxjs';
import { ConnectedServicesList } from 'src/app/core/stores/connected-services/connected-services.types';

@Component({
  selector: 'app-platform-selection',
  templateUrl: './platform-selection.component.html',
  styleUrls: ['./platform-selection.component.scss']
})
export class PlatformSelectionComponent implements OnInit {
  @Input()
  connectedServices$!: Observable<ConnectedServicesList[]>;

  @Output() selectedPlatform = new EventEmitter<IPlatformTypes>();

  public connectedServices = IPlatformTypes;
  public selectedChip: IPlatformTypes = this.connectedServices.all;

  ngOnInit(): void {

  }

  public selectChip(evt: IPlatformTypes): void {
    this.selectedChip = evt;
    this.selectedPlatform.emit(evt);
  }
}

