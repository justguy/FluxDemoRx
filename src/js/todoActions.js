const SEED = [
    { id: 0, title: 'Feed cat', completed: true },
    { id: 1, title: 'Pet cat', completed: false },
    { id: 2, title: 'Talk to cat', completed: true },
    { id: 3, title: 'Photograph cat', completed: false },
    { id: 4, title: 'Take nap with cat', completed: false }
];
const TodoActions = function(dispatcher) {
    // using a fake backend results in a lot of
    // irrelevant fiddling, so we just go back to faking it
    //let BACKEND = 'http://yourserver.com'

    return {
        listTodos: function() {
            let mapping = {};
            SEED.forEach( function( todo ) { mapping[todo.id] = todo } );
            dispatcher.dispatch( { type: 'SEED_TODOS', todos: mapping } )
        },

        createTodo: function( todo ) {
            dispatcher.dispatch( { type: 'CREATE_TODO', todo: todo } )
        },

        updateTodo: function( id, todo ) {
            let update = Object.assign({}, todo, { id: id });
            dispatcher.dispatch( { type: 'UPDATE_TODO', todo: update } )
        },

        removeTodo: function( id ) {
            dispatcher.dispatch( { type: 'REMOVE_TODO', todo: { id: id } } )
        }
    }
};

export { TodoActions }