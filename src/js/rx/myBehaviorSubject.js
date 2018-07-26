import MyObservable from './MyObservable';

/**
 * An RxJS-like implementation of an BehaviorSubject
 */
class MyBehaviorSubject {
    /**
     * set the initial value
      * @param initialValue
     */
    constructor(initialValue) {
        this.observers = [];

        if (typeof initialValue === 'undefined') {
            throw new Error('You need to provide initial value');
        }

        this.lastValue = initialValue;
        this.history = [];
    }

    /**
     * Add a new subscriber
     * @param observer
     */
    subscribe(observer) {
        this.observers.push(observer);
        observer(this.lastValue);
    }

    /**
     * update the value and save the last one in the history array
      * @param value
     * @param dontAddToHistory
     */
    next(value, dontAddToHistory) {
        if (!dontAddToHistory) {
            this.history.push(Object.assign({}, this.lastValue));
        }

        this.lastValue = value;
        this.observers.forEach(observer => observer(value));
    }

    /**
     * get a copy of the current value
      * @returns {*}
     */
    getValue() {
        return jQuery.extend(true, {}, this.lastValue);
    }

    /**
     * set the state with the previous value
      */
    undo() {
        if (this.history.length) {
            let value = this.history.pop();
            this.next(value, true);
        }
    }

    /**
     * Create a new MyObservable with the current observers and trigger the next()
     */
    asObservable() {
        let observable = MyObservable(this.observers);
        delete observable.next;

        return observable;
    }
}

export { MyBehaviorSubject };