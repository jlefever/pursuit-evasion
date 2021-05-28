type PreferedFn<T> = (a: T, b: T) => boolean;
type EqualityFn<T> = (a: T, b: T) => boolean;

export default class Queue<T> {
    private readonly _arr: T[] = new Array();
    private readonly _preferedFn: PreferedFn<T>;
    private readonly _equalityFn: EqualityFn<T>;

    constructor(prefered: PreferedFn<T>, equality: EqualityFn<T>) {
        this._preferedFn = prefered;
        this._equalityFn = equality;
    }

    public isEmpty = () => this._arr.length === 0;

    public pop = () => this._arr.pop();

    public push = (...eles: T[]) => eles.forEach(e => this.insert(e));

    private insert = (e: T) => {
        for (const [index, value] of this._arr.entries()) {    
            if (this._equalityFn(value, e)) {
                return;
            }

            if (this._preferedFn(value, e)) {
                this._arr.splice(index - 1, 0, e);
                return;
            }
        }

        this._arr.push(e);
    }
}