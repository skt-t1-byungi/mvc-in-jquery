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
    constructor() {
        super();
        this.todos = {};
        this.uid = 0;
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
        // todos에 전달하는 이벤트리스너에 this를 바인딩합니다.
        // 만약 뷰가 삭제될 경우, todos에 남아있는 이벤트 리스너(리스너의 this, this의 this.$el, this.$el의 DOM)
        // 참조가 남아있어서 화면상에 뷰가 제거되도 메모리에 남게될 수 있습니다.
        // 뷰 제거시 등록한 이벤트리스너를 지우는 로직이 추가되거나 
        // es6 weakmap을 사용해 참조카운팅을 증가시키지 않도록 합니다.
        this.todos
            .on("create", this.render)
            .on("remove", this.render)
            .on("done", this.render);

        // 전체 내용을 전부 다시 그릴 때는 불필요한 렌더링이 발생합니다.
        // 이벤트상황에 맞게 다른 렌더링 메소드를 적용해 불필요한 렌더링을 막을 수 있습니다.
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

const $todos = $("#todos");

const todos = new Todos();
const todoListView = new TodoListView(todos, $todos.find(".list"));
const todoFormView = new TodoFormView(todos, $todos.find(".add-todo"));