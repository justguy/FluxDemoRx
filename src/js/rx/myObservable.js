/**
 * An RxJS-like implementation of an observable which maintains a list of subscribers.
 */
class MyObservable {
    /**
     * Init the object
     * @param observers - optional array of observers
     */
    constructor(observers) {
        this.observers = Array.isArray(observers) ? observers : [];
    }

    /**
     * Add a new subscriber
     * @param observer
     */
    subscribe(observer) {
        this.observers.push(observer);
    }

    /**
     * Trigger all subscribers with the value
     * @param value
     */
    next(value) {
        this.observers.forEach(observer => observer.next(value));
    }

    /**
     * Trigger all subscribers with an error
     * @param error
     */
    error(error) {
        this.observers.forEach(observer => observer.error(error));
    }

    /**
     * Complete all subscribers
     */
    complete() {
        this.observers.forEach(observer => observer.complete());
    }

}

export { MyObservable };