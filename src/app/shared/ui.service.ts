import { Subject } from 'rxjs';

export class UIService {
  //event emitter
  loadingStateChanged = new Subject<boolean>();
}
