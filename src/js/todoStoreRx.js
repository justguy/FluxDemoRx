import { MyBehaviorSubject } from './rx/myBehaviorSubject';

let ACTION_TYPES = {
    SEED_TODOS: 'SEED_TODOS',
    CREATE_TODO: 'CREATE_TODO',
    REMOVE_TODO: 'REMOVE_TODO',
    UPDATE_TODO: 'UPDATE_TODO'
};

let TodoStore = function(dispatcher) {
    //let _emitter = new Dispatcher();
    let _nextId = 0;
    let _todos = new MyBehaviorSubject({});
    let _callbacksForActions = {};

    function getTodos() {
        return _todos.getValue()
    }

    dispatcher.register((payload) => {
        let todos = null;

        switch (payload.type) {
            case ACTION_TYPES.SEED_TODOS:
                _todos.next(payload.todos);
                // go through the seed and set _nextId
                // appropriately so that creating new todos
                // doesn't override ones from the seed
                for (let i in payload.todos) {
                    _nextId = Math.max(_nextId + 1, payload.todos[i].id)
                }
                executeActionObservers(ACTION_TYPES.SEED_TODOS, getTodos());
                break;
            case ACTION_TYPES.CREATE_TODO:
                payload.todo.id = _nextId++;
                todos = _todos.getValue();
                todos[payload.todo.id] = payload.todo;
                _todos.next(todos);
                executeActionObservers(ACTION_TYPES.CREATE_TODO, getTodos());
                break;
            case ACTION_TYPES.REMOVE_TODO:
                todos = _todos.getValue();
                delete todos[payload.todo.id];
                _todos.next(todos);
                executeActionObservers(ACTION_TYPES.REMOVE_TODO, getTodos());
                break;
            case ACTION_TYPES.UPDATE_TODO:
                todos = _todos.getValue();
                Object.assign(todos[payload.todo.id], payload.todo);
                _todos.next(todos);
                executeActionObservers(ACTION_TYPES.UPDATE_TODO, getTodos());
                break;
            default:
                return // avoid emitting a change
        }
    });

    function executeActionObservers(actionType, value) {
        if (_callbacksForActions.hasOwnProperty(actionType)) {
            let callbacksForAction = _callbacksForActions[actionType];
            for (let id in callbacksForAction.callbacks) {
                callbacksForAction.callbacks[id](value);
            }
        }
    }

    return {
        getTodos: () => {
            return getTodos();
        },
        getTodo: (id) => {
            return _todos.getValue()[id];
        },
        subscribe: (observer, actionType) => {
            let result = null;

            if (actionType) {
                if (!_callbacksForActions.hasOwnProperty(actionType)) {
                    _callbacksForActions[actionType] = {
                        id: 0,
                        callbacks: { 0: observer }
                    };
                    result = 0;
                } else {
                    let callbacksForAction = _callbacksForActions[actionType];
                    let id = ++callbacksForAction.id;
                    callbacksForAction.callbacks[id] = observer;
                    result = id;
                }
            } else {
                result = _todos.subscribe(observer);
            }

            return result;
        },
        unsubscribe: (observerOrId, actionType) => {
            if (actionType) {
                delete _callbacksForActions[actionType].callbacks[observerOrId];
            } else {
                return _todos.unsubscribe(observerOrId);
            }
        },
        undo: () => {
            _todos.undo();
        },

    }
};

export { TodoStore, ACTION_TYPES };