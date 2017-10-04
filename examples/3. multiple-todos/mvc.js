class TodosCollection extends EventEmitter {
    constructor() {
        super();
        this.collection = {};
    }

    add(todos) {
        this.collection[todos.id] = todos;
        this.emit("add", todos);
    }

    remove(id) {
        const todos = this.collection[id];
        delete this.collection[id];

        this.emit("remove", todos);
    }

    toArray() {
        return Object.values(this.collection);
    }
}

class CollectionView {
    constructor(collection, ItemConstructor) {
        this.collection = collection;
        this.ItemConstructor = ItemConstructor;
        this.itemViews = {};

        this.listenCollection();
    }

    listenCollection() {
        this.collection
            .on("add", todos => {
                this.itemViews[todos.id] = new this.ItemConstructor(todos);

                this.render();
            })
            .on("remove", todos => {
                delete this.itemViews[todos.id];

                this.render();
            });
    }
}

class TodosWrapperView {
    constructor(todos) {
        this.todos = todos;
        this.$el = $(`
            <li>
                <p>
                    <button data-action-remove-todos="${todos.id}">todos 삭제</button>
                </p>
                <h1>번호: ${todos.id + 1}</h1>
                <ul class="list">
                </ul>
                <form class="add-todo">
                    <input type="text" name="title">
                    <button type="submit">추가하기 <span data-todo-form="count">(0)</span></button>
                </form>
            </li>
        `);

        this.listView = new TodoListView(todos, this.$el.find('.list'));
        this.formView = new TodoFormView(todos, this.$el.find('.add-todo'));
    }
}

class MultipleTodosView extends CollectionView {
    constructor(collection, $el) {
        super(collection, TodosWrapperView);
        this.$el = $el;
        this.$list = $el.find(".multiple-todos-list");
        this.render = this.render.bind(this);

        this.attachEvents();
        this.render();
    }

    attachEvents() {
        this.$el
            .on("click", "[data-action-add-todos]", evt => {
                this.collection.add(Todos.create());
            })
            .on("click", "[data-action-remove-todos]", evt => {
                const todosId = evt.target.dataset.actionRemoveTodos;
                this.collection.remove(todosId);
            });;
    }

    render() {
        const $frag = $(document.createDocumentFragment());

        for (let itemView of Object.values(this.itemViews)) {
            $frag.append(itemView.$el);
        }

        this.$list.empty().append($frag);
    }
}

const todosCollection = new TodosCollection();
const multipleTodosView = new MultipleTodosView(todosCollection, $("#multiple-todos"));