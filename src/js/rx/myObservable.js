
class MyObservable {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    next(value) {
        this.observers.forEach(observer => observer.next(value));
    }

    error(error) {
        this.observers.forEach(observer => observer.error(error));
    }

    complete() {
        this.observers.forEach(observer => observer.complete());
    }

}

export { MyObservable };