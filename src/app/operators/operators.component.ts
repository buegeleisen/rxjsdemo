import { Component, OnInit } from '@angular/core';
import {
  catchError,
  combineLatestWith,
  concatMap,
  delay, distinct,
  filter, forkJoin,
  from,
  map,
  of,
  switchMap,
  take, tap,
} from "rxjs";

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit{
  items: any[] = [];
  constructor() {
  }

  ngOnInit(): void {
    const arr1 = ['A', 'B', 'C', 'D'];
    const arr2 = [0, 1, 2, 3];

    //creation from
    const obs1$ = from(arr1);
    const obs2$ = from(arr2);

    const obs1Delayed$ = from(obs1$).pipe(
      concatMap( item => of(item).pipe ( delay( 500 ) ))
    );

    const obs2Delayed$ = from(obs2$).pipe(
      concatMap( item => of(item).pipe ( delay( 500 ) ))
    );

    //TRANSFORMATION
    //map
    const mapObs = obs2$.pipe(map( x => x * 10));

    //switchMap
    const switchMapObs = obs1Delayed$.pipe(
      switchMap((x) => {
        return obs2Delayed$.pipe(
          map((y) => {
            return y + ' ' + x;
      }));
    }));

    //FILTERING
    //filter
    const filterObs = obs2$.pipe(filter(x => x % 2 !== 0));

    //take
    const takeObs = obs1$.pipe(take(3));

    //distinct
    const distinctObs = from(['A', 'A', 'B', 'C', 'C', 'D']).pipe(distinct());


    //JOIN CREATION
    //combineLatestWith
    const combineLatestObs = obs1Delayed$.pipe(
      combineLatestWith(obs2Delayed$),
      map((x) => (x) )
    );

    //forkJoin
    const forkJoinObs = forkJoin([obs1Delayed$, obs2Delayed$]);


    //OTHER
    //tap
    const tapObs = obs2$.pipe(
      map(x => 10 * x),
      tap(t => console.log('Hi', t))
    );

    //errorHandling
    const error$ = of(1, 2, 3, 4, 5)
      .pipe(
        map(n => {
          if (n === 4) {
            throw 'four!';
          }
          return n;
        })
      );

    const errorObs1 = error$.pipe(
      catchError(err => of('I', 'II', 'III', 'IV', 'V'))
    );

    const errorObs2 = error$.pipe(
      catchError((err, caught) => caught),
      take(30)
    );



    mapObs.subscribe((x) => {
      this.items.push(x);
    });
  }

}
