import { Component, OnInit, signal } from '@angular/core';
import { HealthService } from './services/health';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  title = signal('todo-frontend');

  status = signal<'checking' | 'UP' | 'DOWN'>('checking');

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.healthService.getHealth().subscribe({
      next: () => {
        this.status.set('UP');
      },
      error: () => {
        this.status.set('DOWN');
      }
    });
  }
}