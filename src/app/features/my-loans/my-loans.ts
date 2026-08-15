import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LoanService } from '../../core/services/loan.service';
import { FineService } from '../../core/services/fine.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Loan, Fine, Reservation } from '../../core/models/loan.model';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, TranslatePipe],
  templateUrl: './my-loans.html',
  styleUrl: './my-loans.scss'
})
export class MyLoans implements OnInit {
  loans = signal<Loan[]>([]);
  fines = signal<Fine[]>([]);
  reservations = signal<Reservation[]>([]);
  loading = signal(false);
  loanColumns = ['bookTitle', 'borrowDate', 'dueDate', 'status', 'actions'];
  readonly skeletonLoanRows = Array.from({ length: 3 }, (_, i) => i);
  readonly skeletonListRows = Array.from({ length: 3 }, (_, i) => i);

  constructor(
    private readonly loanService: LoanService,
    private readonly fineService: FineService,
    private readonly reservationService: ReservationService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    forkJoin({
      loans: this.loanService.myLoans(),
      fines: this.fineService.myUnpaidFines(),
      reservations: this.reservationService.myReservations()
    }).subscribe({
      next: ({ loans, fines, reservations }) => {
        this.loans.set(loans);
        this.fines.set(fines);
        this.reservations.set(reservations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  renew(loan: Loan): void {
    this.loanService.renew(loan.id).subscribe({
      next: () => {
        this.snackBar.open('Loan renewed', 'OK', { duration: 3000 });
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not renew this loan', 'OK', { duration: 4000 })
    });
  }

  cancelReservation(reservation: Reservation): void {
    this.reservationService.cancel(reservation.id).subscribe(() => this.refresh());
  }
}
