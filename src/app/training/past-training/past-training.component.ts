import { Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercide.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css'],
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  finishedExercisesSubscription: Subscription | undefined;

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.finishedExercisesSubscription =
      this.trainingService.finishedExercisesChanged.subscribe(
        (exercises: Exercise[]) => (this.dataSource.data = exercises)
      );
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator!;
  }

  ngOnDestroy(): void {
    this.finishedExercisesSubscription?.unsubscribe();
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
