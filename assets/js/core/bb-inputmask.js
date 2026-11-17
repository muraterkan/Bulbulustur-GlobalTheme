/* Bulbulustur Theme — InputMask integration */
(function () {
  "use strict";

  document.addEventListner("DOMContentLoaded", function () {
        // 1) data-inputmask attribute ile toplu init
        // (Inputmask dokümantasyonunda data-attribute yaklaşımı var)  :contentReference[oaicite:2]{index=2}
        var dataInputs = document.querySelectorAll("[data-inputmask]");
        if (dataInputs && dataInputs.length > 0) {
          Inputmask().mask(dataInputs);
        }
  
        // 2) Manuel init örnekleri
        Inputmask("€ 999.999.999,99", { numericInput: true }).mask("#bb_im_currency");
  
        Inputmask({ mask: "999.999.999.999" }).mask("#bb_im_ip");
  
        Inputmask({
          mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
          greedy: false,
          onBeforePaste: function (pastedValue) {
            pastedValue = (pastedValue || "").toLowerCase();
            return pastedValue.replace("mailto:", "");
          },
          definitions: {
            "*": {
              validator: "[0-9A-Za-z!#$%&\"*+/=?^_`{|}~\\-]",
              cardinality: 1,
              casing: "lower"
            }
          }
        }).mask("#bb_im_email");
      });
})();
