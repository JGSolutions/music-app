import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-results',
  templateUrl: './empty-results.component.html',
  styleUrls: ['./empty-results.component.scss']
})
export class EmptyResultsComponent {
  @Input()
  message!: string;
}

