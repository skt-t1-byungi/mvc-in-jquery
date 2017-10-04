const $todos = $("#todos");
const $todosList = $todos.find(".list");
const $todoForm = $todos.find(".add-todo");
const $todoFormBtnNumber = $todoForm.find(":submit > span");

$todoForm.submit(function () {
    const title = this.children.title.value;

    if (title.trim() === '') {
        return false;
    }

    $todosList.append(`
        <li> 할일 : "${title}" 
            <button class="done">완료</button>
            <button class="remove">삭제</button>
        </li>`);

    $todoFormBtnNumber.text('(' + $todosList.find("li").length + ')');

    return false;
});

$todosList
    .on("click", ".done", function () {
        $(this).replaceWith("완료");
    })
    .on("click", ".remove", function () {
        $(this).closest('li').remove();

        $todoFormBtnNumber.text('(' + $todosList.find("li").length + ')');
    });