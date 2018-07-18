'use strict';

import { Dispatcher } from './dispatcher';
import { TodoStore, ACTION_TYPES } from './todoStoreRx';
import { TodoActions } from './todoActions';

function render(numberOfApplications, useSingleDispatcher) {
    document.documentElement.style.setProperty('--container-width', (200 / numberOfApplications) + 'vw');

    let singleDispatcher = useSingleDispatcher ? new Dispatcher() : null;

    $(document).ready(function () {
        let $appTemplate = $('#appRx');
        $appTemplate.hide();

        for (let appIndex = 0; appIndex < numberOfApplications; appIndex++) {
            let dispatcher = singleDispatcher || new Dispatcher();
            let todoStore = new TodoStore(dispatcher);
            let todoActions = new TodoActions(dispatcher);

            dispatcher.register(function (payload) {
                console.log("ACTION for instance " + appIndex + ": " + JSON.stringify(payload))
            });

            let $app = $appTemplate.clone();
            $app.show().addClass('half').appendTo('body');

            let todoForm = $app.find('> form');
            todoForm.submit(function (e) {
                e.preventDefault();
                todoActions.createTodo({
                    title: todoForm.find('input').val(),
                    completed: false
                });
                todoForm.get(0).reset();

                return false;
            });

            $app.find('.btn-undo').click(() => {
                todoStore.undo();
            });

            let todoCounter = $app.find('.todo-counter');

            let todoList = $('<ul>');
            todoList.appendTo($app);

            todoStore.subscribe((todos) => {
                todoList.empty();
                $.each(todos, function (id, todo) {
                    todoList.append(todoTemplate(todo))
                })
            });

            todoStore.subscribe((todos) => {
                todoCounter.text(Object.keys(todos).length);
                console.log('got todo', todos);
            });

            // let id = todoStore.subscribe(() => {
            //     alert('Added a new todo!');
            // }, ACTION_TYPES.CREATE_TODO);

            //todoStore.unsubscribe(id, ACTION_TYPES.CREATE_TODO);

            todoList.on('click', 'span.toggle', function (e) {
                let id = parseInt($(e.target).parents('li').attr('rel'), 10);
                let todo = todoStore.getTodo(id);
                todoActions.updateTodo(id, {completed: !todo.completed})
            });

            todoList.on('click', 'a.remove', function (e) {
                e.preventDefault();
                let id = parseInt($(e.target).parents('li').attr('rel'), 10);
                todoActions.removeTodo(id)
            });

            todoActions.listTodos(); // seed data
        }
    });

    function todoTemplate(todo) {
        let template = [
            "<li rel='{{id}}'>",
            "<span class='toggle'>{{check}}</span>",
            "{{title}}",
            "<small><a href='javascript:void(0);' class='remove'>(remove)</a></small>",
            "</li>"
        ].join('');
        let data = $.extend({}, todo)
        data.check = data.completed ? '&check;' : '&ndash;';
        let html = template.replace(
            /\{\{([^{}]+)\}\}/g,
            function (_, match) {
                return data[match]
            }
        );

        return html;
    }
}

const MultiApp = {
    render: render
};

export { MultiApp };