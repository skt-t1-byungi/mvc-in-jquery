const $multipleTodos = $("#multiple-todos");
const $multipleTodosList = $multipleTodos.find(".list");

let todosNumber = 1;

$multipleTodos.find(".add-todos").click(() => {
    $multipleTodosList.append(`
    <li class="todos">
        <p>
            <button class="del-todos">tods 삭제</button>
        </p>
        <h1>번호 ${todosNumber++}</h1>
        <ul class="list">
        </ul>
        <form class="add-todo">
            <input type="text" name="title">
            <button type="submit">추가하기 <span data-todo-form="count">(0)</span></button>
        </form>
    </li>
    `);
});

$multipleTodos.on("click", ".del-todos", function () {
    $(this).closest(".todos").remove();
});

$multipleTodos.on("submit", ".add-todo", function () {
    const $form = $(this);
    const title = $form.find("[name=title]").val();

    if (title.trim() === '') {
        return false;
    }

    const $todosList = $form.prev('.list').append(`
        <li> 할일 : "${title}" 
            <button class="done">완료</button>
            <button class="remove">삭제</button>
        </li>`);

    $form.find(":submit > span").text('(' + $todosList.find("li").length + ')');

    return false;
});

$multipleTodos
    .on("click", ".done", function () {
        $(this).replaceWith("완료");
    })
    .on("click", ".remove", function () {
        const $el = $(this);
        const $todos = $(this).closest('.todos');

        $el.closest('li').remove();

        $todos.find(":submit > span").text('(' + $todos.find(".list > li").length + ')');
    });