const $counter = $("#counter");
const $number = $counter.find('span');

$number.text(0);

$counter
    .on("click", 'button:first-child', function () {
        $number.text(parseInt($number.text()) + 1);
    })
    .on("click", 'button:last-child', function () {
        $number.text(parseInt($number.text()) - 1);
    });