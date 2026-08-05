import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';
import { environment } from '../environments/environment';

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

    httpMock.expectOne(`${environment.apiUrl}/api/health`).flush({ status: 'UP' });
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('todo-frontend');

    httpMock.expectOne(`${environment.apiUrl}/api/health`).flush({ status: 'UP' });
  });

  it('should show UP when the backend responds with status UP', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/health`);
    req.flush({ status: 'UP' });
    fixture.detectChanges();

    const statusEl = fixture.nativeElement.querySelector('.up');
    expect(statusEl?.textContent?.trim()).toBe('UP');
  });

  it('should show DOWN when the backend request fails', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/health`);
    req.error(new ProgressEvent('network error'));
    fixture.detectChanges();

    const statusEl = fixture.nativeElement.querySelector('.down');
    expect(statusEl?.textContent?.trim()).toBe('DOWN');
  });
});
