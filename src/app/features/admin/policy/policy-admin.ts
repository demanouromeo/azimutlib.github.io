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
import { LibraryPolicy, UpdateLibraryPolicyRequest } from '../../../core/models/policy.model';
import { PolicyService } from '../../../core/services/policy.service';

@Component({
  selector: 'app-policy-admin',
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
  templateUrl: './policy-admin.html',
  styleUrl: './policy-admin.scss'
})
export class PolicyAdmin implements OnInit {
  policies = signal<LibraryPolicy[]>([]);
  editingPolicy = signal<LibraryPolicy | null>(null);
  columns = ['role', 'loanDurationDays', 'maxConcurrentLoans', 'maxRenewals', 'finePerDayXaf', 'actions'];

  editForm: UpdateLibraryPolicyRequest = {
    loanDurationDays: 14,
    maxConcurrentLoans: 3,
    maxRenewals: 1,
    finePerDayXaf: 100
  };

  constructor(
    private readonly policyService: PolicyService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.policyService.listAll().subscribe((policies) => this.policies.set(policies));
  }

  startEdit(policy: LibraryPolicy): void {
    this.editingPolicy.set(policy);
    this.editForm = {
      loanDurationDays: policy.loanDurationDays,
      maxConcurrentLoans: policy.maxConcurrentLoans,
      maxRenewals: policy.maxRenewals,
      finePerDayXaf: policy.finePerDayXaf
    };
  }

  cancelEdit(): void {
    this.editingPolicy.set(null);
  }

  saveEdit(): void {
    const policy = this.editingPolicy();
    if (!policy) return;

    this.policyService.update(policy.role, this.editForm).subscribe({
      next: () => {
        this.snackBar.open('Policy updated', 'OK', { duration: 3000 });
        this.cancelEdit();
        this.refresh();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Could not update policy', 'OK', { duration: 4000 })
    });
  }
}
