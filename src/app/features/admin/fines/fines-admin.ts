import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { Fine } from '../../../core/models/loan.model';
import { User } from '../../../core/models/user.model';
import { FineService } from '../../../core/services/fine.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-fines-admin',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    TranslatePipe
  ],
  templateUrl: './fines-admin.html',
  styleUrl: './fines-admin.scss'
})
export class FinesAdmin implements OnInit {
  fines = signal<Fine[]>([]);
  columns = ['userName', 'type', 'reason', 'amountXaf', 'paid', 'actions'];

  matricule = '';
  borrowerPreview = signal<User | null>(null);
  borrowerError = signal<string | null>(null);
  amountXaf: number | null = null;
  reason = '';
  busy = signal(false);

  constructor(
    private readonly fineService: FineService,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.fineService.allFines().subscribe((fines) => this.fines.set(fines));
  }

  lookupBorrower(): void {
    const matricule = this.matricule.trim();
    this.borrowerPreview.set(null);
    this.borrowerError.set(null);
    if (!matricule) return;

    this.userService.getByMatricule(matricule).subscribe({
      next: (user) => this.borrowerPreview.set(user),
      error: () => this.borrowerError.set('Not found')
    });
  }

  createFine(): void {
    const borrower = this.borrowerPreview();
    if (!borrower || !this.amountXaf || this.amountXaf <= 0 || !this.reason.trim()) return;

    this.busy.set(true);
    this.fineService.createManual({ userId: borrower.id, amountXaf: this.amountXaf, reason: this.reason.trim() }).subscribe({
      next: () => {
        this.busy.set(false);
        this.snackBar.open('Fine issued', 'OK', { duration: 3000 });
        this.matricule = '';
        this.borrowerPreview.set(null);
        this.amountXaf = null;
        this.reason = '';
        this.refresh();
      },
      error: (err) => {
        this.busy.set(false);
        this.snackBar.open(err?.error?.message ?? 'Could not issue fine', 'OK', { duration: 4000 });
      }
    });
  }

  markPaid(fine: Fine): void {
    this.fineService.markPaid(fine.id).subscribe({
      next: () => {
        this.snackBar.open('Fine marked as paid', 'OK', { duration: 3000 });
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not update fine', 'OK', { duration: 4000 })
    });
  }
}
