import { from, Observable, Subscriber } from 'rxjs';

const sequence$: Observable<number> = from([1, 2, 3, 4, 5]);

class CustomMapSubscriber extends Subscriber<number> {
    private readonly mapFn: (x: number) => number;

    public constructor(subscribe: Subscriber<number>, mapFn: (x: number) => number) {
        super(subscribe);
        this.mapFn = mapFn;
    }

    public _next(value: number) {
        this.destination.next && this.destination.next(this.mapFn(value));
    }
}

const customMap = (mapFn: (x: number) => number) => (source: Observable<number>) => {
    return source.lift({
            call(subscribe: Subscriber<number>) {
                source.subscribe(new CustomMapSubscriber(subscribe, mapFn));
            }
        }
    );
};

sequence$
    .pipe(
        customMap(x => x * 4)
    )
    .subscribe((value: number) => {
        // tslint:disable-next-line
        console.log(value)
    });
