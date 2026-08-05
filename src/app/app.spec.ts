import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';
import { environment } from '../environments/environment';

const HEALTH_URL = `${environment.apiUrl}/api/health`;

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();

    httpMock.expectOne(HEALTH_URL).flush({ status: 'UP', service: 'todo-api', version: '1.0' });
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('todo-frontend');

    httpMock.expectOne(HEALTH_URL).flush({ status: 'UP', service: 'todo-api', version: '1.0' });
  });

  it('should show UP when the backend responds with status UP', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne(HEALTH_URL);
    req.flush({ status: 'UP', service: 'todo-api', version: '1.0' });
    fixture.detectChanges();

    const statusEl = fixture.nativeElement.querySelector('.result-text.up');
    expect(statusEl?.textContent).toContain('UP');
  });

  it('should show DOWN when the backend responds with status DOWN (200 OK but unhealthy)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne(HEALTH_URL);
    req.flush({ status: 'DOWN', service: 'todo-api', version: '1.0' });
    fixture.detectChanges();

    const statusEl = fixture.nativeElement.querySelector('.result-text.down');
    expect(statusEl?.textContent).toContain('DOWN');
  });

  it('should show DOWN when the backend request fails (network/CORS error)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne(HEALTH_URL);
    req.error(new ProgressEvent('network error'));
    fixture.detectChanges();

    const statusEl = fixture.nativeElement.querySelector('.result-text.down');
    expect(statusEl?.textContent).toContain('DOWN');
  });
});
