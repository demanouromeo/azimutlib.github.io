import { Component, effect, input, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

/** Renders an avatar image, falling back to initials when none is set. Defaults to the
 *  logged-in user (topbar chip, profile page); pass `[user]` to render someone else's
 *  avatar instead (admin user list), fetched via the admin-only per-user avatar endpoint. */
@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (avatarUrl()) {
      <img [src]="avatarUrl()" class="avatar-img" [style.width.px]="size()" [style.height.px]="size()" alt="" />
    } @else {
      <span class="avatar-initials" [style.width.px]="size()" [style.height.px]="size()">{{ initials() }}</span>
    }
  `,
  styles: [
    `
      .avatar-img {
        border-radius: 50%;
        object-fit: cover;
        display: block;
      }

      .avatar-initials {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--brand-primary);
        color: white;
        font-weight: 700;
        font-size: 0.8rem;
      }
    `
  ]
})
export class Avatar {
  size = input(34);
  user = input<User | null>(null);

  avatarUrl = signal<string | null>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly userService: UserService
  ) {
    effect((onCleanup) => {
      const target = this.user() ?? this.authService.currentUser();
      const isSelf = this.user() === null;
      let objectUrl: string | null = null;

      if (target?.hasAvatar) {
        const blob$ = isSelf ? this.profileService.getAvatarBlob() : this.userService.getAvatarBlob(target.id);
        blob$.subscribe((blob) => {
          objectUrl = URL.createObjectURL(blob);
          this.avatarUrl.set(objectUrl);
        });
      } else {
        this.avatarUrl.set(null);
      }

      onCleanup(() => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      });
    });
  }

  initials(): string {
    const name = (this.user() ?? this.authService.currentUser())?.fullName ?? '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }
}
