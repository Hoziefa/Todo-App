import { CurrentUserFromService } from '../services/FirebaseService';

export type PartialRequired<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type HTMLElementEvent<T extends Element, C = T> = Event & { target: T; currentTarget: C };

export type CurrentUser = CurrentUserFromService | null;
