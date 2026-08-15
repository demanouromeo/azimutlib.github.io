import { Component, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Loan } from '../../core/models/loan.model';
import { FinesSummaryResponse } from '../../core/models/report.model';
import { ReportService } from '../../core/services/report.service';

const CHART_COLORS = ['#7c6df0', '#8b7ff0', '#a89bf5', '#c3baf9', '#54c98a', '#f2b84b', '#e8685f'];

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatIconModule, MatTableModule, TranslatePipe, BaseChartDirective],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements OnInit {
  overdueLoans = signal<Loan[]>([]);
  overdueColumns = ['inventoryCode', 'bookTitle', 'borrowerName', 'dueDate', 'status'];

  finesSummary = signal<FinesSummaryResponse | null>(null);

  topBooksChartType: ChartConfiguration<'bar'>['type'] = 'bar';
  topBooksChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ data: [], backgroundColor: CHART_COLORS }] };
  readonly topBooksChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false, beginAtZero: true } }
  };

  loansPerMonthChartType: ChartConfiguration<'line'>['type'] = 'line';
  loansPerMonthChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], borderColor: '#7c6df0', backgroundColor: 'rgba(124,109,240,0.15)', fill: true, tension: 0.35, pointRadius: 3 }]
  };
  readonly loansPerMonthChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false, beginAtZero: true } }
  };

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.overdueLoans().subscribe((loans) => this.overdueLoans.set(loans));
    this.reportService.finesSummary().subscribe((summary) => this.finesSummary.set(summary));

    this.reportService.topBorrowedBooks(8).subscribe((items) => {
      this.topBooksChartData = {
        labels: items.map((item) => item.title),
        datasets: [{ data: items.map((item) => item.loanCount), backgroundColor: CHART_COLORS }]
      };
    });

    this.reportService.loansPerMonth().subscribe((items) => {
      this.loansPerMonthChartData = {
        labels: items.map((item) => item.yearMonth),
        datasets: [
          {
            data: items.map((item) => item.count),
            borderColor: '#7c6df0',
            backgroundColor: 'rgba(124,109,240,0.15)',
            fill: true,
            tension: 0.35,
            pointRadius: 3
          }
        ]
      };
    });
  }
}
