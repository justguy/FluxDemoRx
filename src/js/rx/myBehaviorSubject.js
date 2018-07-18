import { MyObservable } from "./myObservable";

class MyBehaviorSubject extends MyObservable {
    constructor(initialValue) {
        super();
        this.observers = [];

        if (typeof initialValue === 'undefined') {
            throw new Error('You need to provide initial value');
        }

        this.lastValue = initialValue;
        this.history = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    next(value, dontAddToHistory) {
        if (!dontAddToHistory) {
            this.history.push(Object.assign({}, this.lastValue));
        }

        this.lastValue = value;
        this.observers.forEach(observer => observer(value));
    }

    getValue() {
        return jQuery.extend(true, {}, this.lastValue);
    }

    undo() {
        if (this.history.length) {
            let value = this.history.pop();
            this.next(value, true);
        }
    }
}

export { MyBehaviorSubject };