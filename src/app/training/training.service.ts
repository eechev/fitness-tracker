import { inject } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

import { Exercise } from './exercide.model';

export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise?: Exercise;
  private exercises: Exercise[] = [];

  db = inject(Firestore);

  fetchAvailableExercises() {
    const exerciseCollection = collection(this.db, 'availableExercises');
    collectionData(exerciseCollection, { idField: 'id' })
      .pipe(
        map((valArray) => {
          return valArray.map((val) => {
            return {
              id: val.id,
              name: val['name'],
              duration: val['duration'],
              calories: val['calories'],
            };
          });
        })
      )
      .subscribe((result: Exercise[]) => {
        this.availableExercises = result;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise! };
  }

  getCompletedOrCancelledExercises(): Exercise[] {
    return this.exercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next(this.runningExercise!);
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise!,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = undefined;
    this.exerciseChanged.next(this.runningExercise!);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise!,
      date: new Date(),
      state: 'cancelled',
      duration: this.runningExercise!.duration! * (progress / 100),
      calories: this.runningExercise!.calories! * (progress / 100),
    });
    this.runningExercise = undefined;
    this.exerciseChanged.next(this.runningExercise!);
  }
}
