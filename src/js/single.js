'use strict';

import { Dispatcher } from './dispatcher';
import { TodoStore } from './todoStoreRx';
import { TodoActions } from './todoActions';

function render() {
    let dispatcher = new Dispatcher();
    let todoStore = new TodoStore(dispatcher);
    let todoActions = new TodoActions(dispatcher);

    dispatcher.register(function (payload) {
        console.log("ACTION: " + JSON.stringify(payload))
    });

    $(document).ready(function () {
        let todoForm = $('#appRx > form');
        todoForm.submit(function (e) {
            e.preventDefault();
            todoActions.createTodo({
                title: todoForm.find('input').val(),
                completed: false
            });
            todoForm.get(0).reset();

            return false;
        });

        $('.btn-undo').click(() => {
            todoStore.undo();
        });

        let todoCounter = $('.todo-counter');

        let todoList = $('<ul>');
        todoList.appendTo($('#appRx'));

        todoStore.subscribe((todos) => {
            todoList.empty();
            $.each(todos, function (id, todo) {
                todoList.append(todoTemplate(todo))
            })
        });

        todoStore.subscribe((todos) => {
            todoCounter.text(Object.keys(todos).length);
        });

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
        //console.log("GENERATED HTML", html)
        return html
    }
}

const SingleApp = {
    render: render
};

export { SingleApp };