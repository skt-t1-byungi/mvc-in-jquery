class Counter {
    constructor($el) {
        this.$el = $el;
        this.number = 0;

        this.attachEvents();
        this.render();
    }

    attachEvents() {
        this.$el
            .on("click", '[data-action-increment]', this.increment.bind(this))
            .on("click", '[data-action-decrement]', this.decrement.bind(this));
    }

    increment() {
        this.number++;
        this.render();
    }

    decrement() {
        this.number--;
        this.render();
    }

    render() {
        this.$el.find("[data-counter=number]").text(this.number);
    }
}

new Counter($("#counter"));