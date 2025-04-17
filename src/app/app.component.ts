import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdjustersComponent } from './adjusters/adjusters.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdjustersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test-typeahead-control';
}
