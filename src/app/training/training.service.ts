import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';

import { Exercise } from './exercide.model';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  //Events emiters
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  //private members
  private availableExercises?: Exercise[] = [];
  private runningExercise?: Exercise;
  private subs: Subscription[] = [];

  //constructors, initializers and cleaners
  constructor(private firestore: Firestore, private uiService: UIService) {}

  //getters and setters
  getRunningExercise(): Exercise {
    return { ...this.runningExercise! };
  }

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    const exerciseCollection = collection(this.firestore, 'availableExercises');
    this.subs.push(
      (
        collectionData(exerciseCollection, {
          idField: 'id',
        }) as Observable<Exercise[]>
      ).subscribe({
        next: (result: Exercise[]) => {
          this.availableExercises = result;
          this.exercisesChanged.next([...this.availableExercises]);
          this.uiService.loadingStateChanged.next(false);
        },
        error: (err) => {
          this.availableExercises = undefined;
          this.exercisesChanged.next(this.availableExercises!);
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackBar(
            'Fetching available exercises failed. Please try again',
            null,
            3000
          );
        },
      })
    );
  }

  fetchCompletedOrCancelledExercises() {
    this.uiService.loadingStateChanged.next(true);
    const exerciseCollection = collection(this.firestore, 'finishedExercises');
    this.subs.push(
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
        .subscribe({
          next: (exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
            this.uiService.loadingStateChanged.next(false);
          },
          error: (err) => {
            const exercise = undefined;
            this.finishedExercisesChanged.next(exercise!);
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar(
              'Fetching completed or cancelled exercises failed. Please try again',
              null,
              3000
            );
          },
        })
    );
  }

  //public methods
  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises!.find(
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

  cancelSubscriptions() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  //private methods
  private addExerciseToDatabase(exercise: Exercise) {
    const exerciseCollection = collection(this.firestore, 'finishedExercises');
    addDoc(exerciseCollection, exercise).catch((err) => console.error(err));
  }
}
