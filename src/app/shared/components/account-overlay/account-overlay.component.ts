import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-overlay',
  templateUrl: './account-overlay.component.html',
  styleUrls: ['./account-overlay.component.scss']
})
export class AccountOverlayComponent {
  @Input()
  name!: string;

}

