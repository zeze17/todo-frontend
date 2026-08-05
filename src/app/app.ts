import { Component, OnInit, signal } from '@angular/core';
import { HealthService, HealthResponse } from './services/health';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  title = signal('todo-frontend');

  status = signal<'checking' | 'UP' | 'DOWN'>('checking');
  healthData = signal<HealthResponse | null>(null);

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.healthService.getHealth().subscribe({
      next: (data) => {
        this.healthData.set(data);
        this.status.set(data.status === 'UP' ? 'UP' : 'DOWN');
      },
      error: () => {
        this.status.set('DOWN');
      }
    });
  }
}