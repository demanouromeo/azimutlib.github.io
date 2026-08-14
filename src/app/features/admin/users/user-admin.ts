import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminUpdateUserRequest, CreateUserRequest, UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Avatar } from '../../../shared/avatar/avatar';
import { Role, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [
    Avatar,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    TranslatePipe
  ],
  templateUrl: './user-admin.html',
  styleUrl: './user-admin.scss'
})
export class UserAdmin implements OnInit {
  users = signal<User[]>([]);
  editingUser = signal<User | null>(null);
  roles: Role[] = ['STUDENT', 'LECTURER', 'LIBRARIAN', 'ADMIN'];
  columns = ['avatar', 'matricule', 'fullName', 'role', 'status', 'actions'];

  form: CreateUserRequest = {
    matricule: '',
    fullName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: ''
  };

  editForm: AdminUpdateUserRequest = {
    fullName: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    department: '',
    password: ''
  };

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.userService.listAll().subscribe((users) => this.users.set(users));
  }

  createUser(): void {
    this.userService.create(this.form).subscribe({
      next: () => {
        this.snackBar.open('User created', 'OK', { duration: 3000 });
        this.form = { matricule: '', fullName: '', email: '', password: '', role: 'STUDENT', department: '' };
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not create user', 'OK', { duration: 4000 })
    });
  }

  isSelf(user: User): boolean {
    return this.authService.currentUser()?.id === user.id;
  }

  startEdit(user: User): void {
    this.editingUser.set(user);
    this.editForm = {
      fullName: user.fullName,
      email: user.email ?? '',
      phone: user.phone ?? '',
      role: user.role,
      department: user.department ?? '',
      password: ''
    };
  }

  cancelEdit(): void {
    this.editingUser.set(null);
  }

  saveEdit(): void {
    const user = this.editingUser();
    if (!user) return;

    this.userService.update(user.id, this.editForm).subscribe({
      next: (updated) => {
        this.snackBar.open('User updated', 'OK', { duration: 3000 });
        if (this.isSelf(updated)) {
          this.authService.updateCurrentUser(updated);
        }
        this.cancelEdit();
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not update user', 'OK', { duration: 4000 })
    });
  }

  onAvatarSelected(event: Event): void {
    const user = this.editingUser();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!user || !file) return;

    this.userService.uploadAvatar(user.id, file).subscribe({
      next: (updated) => {
        this.editingUser.set(updated);
        if (this.isSelf(updated)) {
          this.authService.updateCurrentUser(updated);
        }
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not upload avatar', 'OK', { duration: 4000 })
    });
    input.value = '';
  }

  removeAvatar(): void {
    const user = this.editingUser();
    if (!user) return;

    this.userService.removeAvatar(user.id).subscribe({
      next: (updated) => {
        this.editingUser.set(updated);
        if (this.isSelf(updated)) {
          this.authService.updateCurrentUser(updated);
        }
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not remove avatar', 'OK', { duration: 4000 })
    });
  }

  toggleStatus(user: User): void {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.userService.setStatus(user.id, nextStatus).subscribe({
      next: () => {
        this.snackBar.open(nextStatus === 'ACTIVE' ? 'User activated' : 'User suspended', 'OK', { duration: 3000 });
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not change user status', 'OK', { duration: 4000 })
    });
  }

  deleteUser(user: User): void {
    const message = this.translate.instant('admin.confirmDelete', { name: user.fullName });
    if (!confirm(message)) return;

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.snackBar.open('User deleted', 'OK', { duration: 3000 });
        if (this.editingUser()?.id === user.id) {
          this.cancelEdit();
        }
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not delete user', 'OK', { duration: 4000 })
    });
  }
}
