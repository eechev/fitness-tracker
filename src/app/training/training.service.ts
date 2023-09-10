import { inject } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';

import { Exercise } from './exercide.model';

export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise?: Exercise;

  db = inject(Firestore);

  getRunningExercise(): Exercise {
    return { ...this.runningExercise! };
  }

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

  fetchCompletedOrCancelledExercises() {
    const exerciseCollection = collection(this.db, 'finishedExercises');
    collectionData(exerciseCollection, { idField: 'id' })
      .pipe(
        map((valArray) => {
          return valArray.map((val) => {
            return {
              id: val.id,
              name: val['name'],
              duration: val['duration'],
              calories: val['calories'],
              state: val['state'],
              date: val['date'].toDate(),
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next(this.runningExercise!);
  }

  completeExercise() {
    this.addExerciseToDatabase({
      ...this.runningExercise!,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = undefined;
    this.exerciseChanged.next(this.runningExercise!);
  }

  cancelExercise(progress: number) {
    this.addExerciseToDatabase({
      ...this.runningExercise!,
      date: new Date(),
      state: 'cancelled',
      duration: this.runningExercise!.duration! * (progress / 100),
      calories: this.runningExercise!.calories! * (progress / 100),
    });
    this.runningExercise = undefined;
    this.exerciseChanged.next(this.runningExercise!);
  }

  private addExerciseToDatabase(exercise: Exercise) {
    const exerciseCollection = collection(this.db, 'finishedExercises');
    addDoc(exerciseCollection, exercise).then(() => {
      console.log('Data saved successfully');
    });
  }
}
