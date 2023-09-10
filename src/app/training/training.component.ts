import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  excersiceSubscription: Subscription | undefined;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.excersiceSubscription = this.trainingService.exerciseChanged.subscribe(
      (ex) => {
        if (ex != undefined) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.excersiceSubscription?.unsubscribe();
  }
}
