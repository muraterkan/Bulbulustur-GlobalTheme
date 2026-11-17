"use strict";

var BBToast = (function () {

    function init(context) {
        var scope = context || document;

        var toastEls = [].slice.call(scope.querySelectorAll('.toast'));

        toastEls.forEach(function (el) {
            if (el.getAttribute('data-bb-initialized') === '1') {
                return;
            }

            new bootstrap.Toast(el);
            el.setAttribute('data-bb-initialized', '1');
        });
    }

    function show(selector) {
        var el = document.querySelector(selector);
        if (!el) {
            return;
        }

        var toast = bootstrap.Toast.getOrCreateInstance(el);
        toast.show();
    }

    return {
        init: init,
        show: show
    };

})();

// auto init
document.addEventListener('DOMContentLoaded', function () {
    BBToast.init();
});
