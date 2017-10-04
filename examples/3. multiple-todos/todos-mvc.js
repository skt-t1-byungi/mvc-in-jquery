class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(name, listener) {
        const listeners = this.listeners[name] || (this.listeners[name] = []);
        listeners.push(listener);

        return this;
    }

    emit(name, ...args) {
        for (let listener of (this.listeners[name] || [])) {
            listener(...args);
        }
    }
}

class Todos extends EventEmitter {
    static create() {
        if (!Todos.uid) {
            Todos.uid = 0;
        }

        return new Todos(Todos.uid++);
    }

    constructor(id) {
        super();
        this.todos = {};
        this.uid = 0;

        //정규화를 위한 id값 추가
        //나머지 그대로
        this.id = id;
    }

    get(id) {
        return this.todos[id];
    }

    create(title) {
        const id = this.uid++;
        const todo = this.todos[id] = { id, title, done: false };

        this.emit("create", todo);

        return id;
    }

    remove(id) {
        const todo = this.todos[id];

        delete this.todos[id];

        this.emit("remove", todo);
    }

    done(id) {
        const todo = this.todos[id];

        this.todos[id].done = true;

        this.emit("done", todo);
    }

    toArray() {
        return Object.values(this.todos);
    }

    count() {
        return Object.keys(this.todos).length;
    }
}

class TodoListView {
    constructor(todos, $el) {
        this.todos = todos;
        this.$el = $el;
        this.render = this.render.bind(this);

        this.attchEvents();
        this.listenTodos();
        this.render();
    }

    attchEvents() {
        this.$el
            .on("click", '[data-action-done]', evt => {
                const todoId = evt.target.dataset.actionDone;

                this.todos.done(todoId);
            })
            .on("click", '[data-action-remove]', evt => {
                const todoId = evt.target.dataset.actionRemove;

                this.todos.remove(todoId);
            });
    }

    listenTodos() {
        this.todos
            .on("create", this.render)
            .on("remove", this.render)
            .on("done", this.render);
    }

    render() {
        const html = this.todos.toArray()
            .map(todo => `
                <li> "${todo.title}" 
                    ${ todo.done ? "완료" : `<button data-action-done="${todo.id}">완료</button>`}
                    <button data-action-remove="${todo.id}">삭제</button>
                </li>`
            )
            .join('');

        this.$el.html(html);
    }
}

class TodoFormView {
    constructor(todos, $el) {
        this.todos = todos;
        this.$el = $el;
        this.$count = $el.find('[data-todo-form="count"]');
        this.$input = $el.find('[name=title]');
        this.render = this.render.bind(this);

        this.attchEvents();
        this.listenTodos();
        this.render();
    }

    attchEvents() {
        this.$el.submit(evt => {
            evt.preventDefault();

            const title = this.$input.val().trim();

            if (title === '') {
                return;
            }

            this.todos.create(title);

            return false;
        });
    }

    listenTodos() {
        this.todos
            .on("create", this.render)
            .on("remove", this.render);
    }

    render() {
        this.$count.text('(' + this.todos.count() + ')');
    }
}