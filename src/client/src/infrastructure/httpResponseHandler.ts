import { Observable } from 'rxjs';
import { ResponseContext } from '../models/httpResponse';

export type HandleError = <T> (operation: string, eventId: number, result?: T) => (context: ResponseContext) => Observable<T>;
