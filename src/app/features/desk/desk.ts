import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BookCopy } from '../../core/models/book.model';
import { Loan, ReturnOutcome } from '../../core/models/loan.model';
import { User } from '../../core/models/user.model';
import { CatalogService } from '../../core/services/catalog.service';
import { LoanService } from '../../core/services/loan.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-desk',
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
  templateUrl: './desk.html',
  styleUrl: './desk.scss'
})
export class Desk implements OnInit {
  // Issue panel
  issueCode = '';
  issueMatricule = '';
  issueCopyPreview = signal<BookCopy | null>(null);
  issueBorrowerPreview = signal<User | null>(null);
  issueCopyError = signal<string | null>(null);
  issueBorrowerError = signal<string | null>(null);

  // Return panel
  returnCode = '';
  returnPreview = signal<Loan | null>(null);
  returnError = signal<string | null>(null);
  returnOutcome: ReturnOutcome = 'NORMAL';
  returnFeeXaf: number | null = null;

  activeLoans = signal<Loan[]>([]);
  activeLoansColumns = ['inventoryCode', 'bookTitle', 'borrowerName', 'dueDate', 'status', 'actions'];

  busy = signal(false);

  constructor(
    private readonly loanService: LoanService,
    private readonly catalogService: CatalogService,
    private readonly userService: UserService,
    private readonly snackBar: MatSnackBar,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.refreshActiveLoans();
  }

  refreshActiveLoans(): void {
    this.loanService.activeLoans().subscribe((loans) => this.activeLoans.set(loans));
  }

  lookupCopy(): void {
    const code = this.issueCode.trim();
    this.issueCopyPreview.set(null);
    this.issueCopyError.set(null);
    if (!code) return;

    this.catalogService.getCopyByCode(code).subscribe({
      next: (copy) => this.issueCopyPreview.set(copy),
      error: () => this.issueCopyError.set(this.translate.instant('desk.notFound'))
    });
  }

  lookupBorrower(): void {
    const matricule = this.issueMatricule.trim();
    this.issueBorrowerPreview.set(null);
    this.issueBorrowerError.set(null);
    if (!matricule) return;

    this.userService.getByMatricule(matricule).subscribe({
      next: (user) => this.issueBorrowerPreview.set(user),
      error: () => this.issueBorrowerError.set(this.translate.instant('desk.notFound'))
    });
  }

  issue(): void {
    const code = this.issueCode.trim();
    const matricule = this.issueMatricule.trim();
    if (!code || !matricule) return;

    this.busy.set(true);
    this.loanService.issue(code, matricule).subscribe({
      next: (loan) => {
        this.busy.set(false);
        this.snackBar.open(`Issued "${loan.bookTitle}" — due ${loan.dueDate}`, 'OK', { duration: 5000 });
        this.issueCode = '';
        this.issueMatricule = '';
        this.issueCopyPreview.set(null);
        this.issueBorrowerPreview.set(null);
        this.refreshActiveLoans();
      },
      error: (err) => {
        this.busy.set(false);
        this.snackBar.open(err?.error?.message ?? 'Could not issue loan', 'OK', { duration: 4000 });
      }
    });
  }

  lookupReturnCode(): void {
    const code = this.returnCode.trim();
    this.returnPreview.set(null);
    this.returnError.set(null);
    if (!code) return;

    this.loanService.activeLoanByCode(code).subscribe({
      next: (loan) => this.returnPreview.set(loan),
      error: () => this.returnError.set(this.translate.instant('desk.notFound'))
    });
  }

  startReturnFromRow(loan: Loan): void {
    this.returnCode = loan.inventoryCode;
    this.lookupReturnCode();
  }

  setReturnOutcome(outcome: ReturnOutcome): void {
    this.returnOutcome = outcome;
    if (outcome === 'NORMAL') {
      this.returnFeeXaf = null;
    }
  }

  processReturn(): void {
    const code = this.returnCode.trim();
    if (!code) return;
    if (this.returnOutcome !== 'NORMAL' && (!this.returnFeeXaf || this.returnFeeXaf <= 0)) {
      this.snackBar.open(this.translate.instant('desk.feeRequired'), 'OK', { duration: 4000 });
      return;
    }

    this.busy.set(true);
    this.loanService.returnByCode(code, this.returnOutcome, this.returnFeeXaf ?? undefined).subscribe({
      next: (loan) => {
        this.busy.set(false);
        this.snackBar.open(`Returned "${loan.bookTitle}"`, 'OK', { duration: 4000 });
        this.returnCode = '';
        this.returnPreview.set(null);
        this.returnOutcome = 'NORMAL';
        this.returnFeeXaf = null;
        this.refreshActiveLoans();
      },
      error: (err) => {
        this.busy.set(false);
        this.snackBar.open(err?.error?.message ?? 'Could not process return', 'OK', { duration: 4000 });
      }
    });
  }
}
