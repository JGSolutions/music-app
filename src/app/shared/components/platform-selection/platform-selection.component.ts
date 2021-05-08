import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectedServicesList, IConnectedServicesTypes } from 'src/app/core/stores/connected-services/connected-services.types';

@Component({
  selector: 'app-platform-selection',
  templateUrl: './platform-selection.component.html',
  styleUrls: ['./platform-selection.component.scss']
})
export class PlatformSelectionComponent implements OnInit {
  @Input()
  connectedServices$!: Observable<ConnectedServicesList[]>;

  @Output() selectedPlatform = new EventEmitter<IConnectedServicesTypes>();

  public connectedServices = IConnectedServicesTypes;
  public selectedChip: IConnectedServicesTypes = this.connectedServices.all;
  // public avatar$!: Observable<Pictures>;
  // public platforms$!: Observable<string[]>;

  ngOnInit(): void {

  }

  public selectChip(evt: IConnectedServicesTypes): void {
    this.selectedChip = evt;
    this.selectedPlatform.emit(evt);
  }
}

