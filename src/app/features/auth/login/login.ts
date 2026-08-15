import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

const BG_VARIANTS = ['kb-zoom-in', 'kb-zoom-out', 'kb-pan-left', 'kb-pan-right'] as const;
const BG_IMAGE_URLS = [
  'assets/login-bg/bilio1.jpg',
  'assets/login-bg/biblio2.jpg',
  'assets/login-bg/biblio3.webp',
  'assets/login-bg/biblio4.jpg',
  'assets/login-bg/biblio5.jpg',
  'assets/login-bg/biblio6.jpg',
  'assets/login-bg/biblio7.jpg'
];
const BG_SLIDE_DURATION_MS = 6500;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit, OnDestroy {
  matricule = '';
  password = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  passwordVisible = signal(false);

  readonly bgSlides = BG_IMAGE_URLS.map((url, i) => ({
    url,
    variant: BG_VARIANTS[i % BG_VARIANTS.length]
  }));
  activeSlide = signal(0);
  private bgTimer?: ReturnType<typeof setInterval>;

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.bgTimer = setInterval(() => {
      this.activeSlide.update((i) => (i + 1) % this.bgSlides.length);
    }, BG_SLIDE_DURATION_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.bgTimer);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  submit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);
    this.authService.login(this.matricule, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('login.error');
      }
    });
  }
}
