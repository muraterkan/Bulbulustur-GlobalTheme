/* Panel demo service packages. Shared source for pricing, cart and checkout.
   These are representative theme prices, not billable backend prices. */
(function () {
  "use strict";

  window.BBPanelServicePlans = Object.freeze({
    draugr: {
      title: "Draugr Paketleri",
      label: "Draugr",
      icon: "storefront",
      summary: "Kendi alan adınızda mağaza",
      intro: "Kendi alan adınızda satış yapın ve B2B teklif taleplerine yanıt verin.",
      recommended: "pro",
      comparison: [
        { title: "Mağaza ve satış", rows: [
          ["Kendi alan adınız", true, true, true],
          ["Merkezi ürün ve stok", true, true, true],
          ["Tema", "Hazır tema", "Gelişmiş tema ayarları", "Özel tema çalışması"],
          ["Sayfa ve içerik yönetimi", "Temel", "Gelişmiş", "Özel içerik yapısı"],
          ["Dil ve SEO araçları", false, true, true]
        ] },
        { title: "Bulbulustur hizmetleri", rows: [
          ["B2B RFQ taleplerine teklif", true, true, true],
          ["Kategori Router", false, true, true],
          ["PosB hızlı satış", true, true, true],
          ["Özel entegrasyon çalışması", false, false, true],
          ["Öncelikli destek", false, false, true]
        ] }
      ],
      plans: [
        {id:"basic",name:"Draugr Basic",desc:"Hızlı başlangıç ve temel marka görünümü",
          description:"Temel mağaza ve tema yönetimi",year:2500,
          features:["Kendi domaini","Hazır tema","Temel içerik yönetimi","Merkezi ürün ve stok","B2B RFQ taleplerine teklif","PosB hızlı satış"]},
        {id:"pro",name:"Draugr Pro",desc:"Büyüyen mağazalar için içerik ve SEO kontrolü",
          description:"İçerik, SEO ve gelişmiş kontrol",year:10000,
          features:["Gelişmiş tema ayarları","Sayfa ve içerik yönetimi","Dil ve SEO araçları","Category Router","B2B RFQ taleplerine teklif","PosB hızlı satış"]},
        {id:"custom",name:"Draugr Custom",desc:"Özel tasarım ve daha ileri ihtiyaçlar",
          description:"Özel tasarım ve ileri ihtiyaçlar",year:100000,
          features:["Özel tema çalışması","İleri içerik yapısı","Özel entegrasyon ihtiyaçları","Öncelikli destek","B2B RFQ taleplerine teklif","PosB hızlı satış"]}
      ]
    },
    posb: {
      title: "PosB Paketleri",
      label: "PosB",
      icon: "point_of_sale",
      summary: "Şube, kasa ve stok yönetimi",
      intro: "Fiziksel mağazanızın kasa, şube ve stok işlemlerini yönetin.",
      recommended: "pro",
      comparison: [
        { title: "Kasa ve mağaza", rows: [
          ["Hızlı satış ekranı", true, true, true],
          ["Şube ve kasa", "Tek şube", "Çoklu şube ve kasa", "Gelişmiş şube yapısı"],
          ["Merkezi müşteri verisi", true, true, true],
          ["Stok görünümü", "Temel", "Depo ve transfer", "Depo ve transfer"],
          ["Fatura ayarları", false, true, true],
          ["Vardiya ve gün yönetimi", false, true, true]
        ] },
        { title: "Operasyon ve destek", rows: [
          ["Öncelikli entegrasyonlar", false, false, true],
          ["Gelişmiş raporlama", false, false, true],
          ["Öncelikli destek", false, false, true]
        ] }
      ],
      plans: [
        {id:"basic",name:"PosB Basic",desc:"Tek mağaza ve temel hızlı satış akışı",
          description:"Tek mağaza için kasa operasyonu",year:499,
          features:["Hızlı satış ekranı","Temel stok görünümü","1 şube / kasa yapısı","Merkezi müşteri verisi"]},
        {id:"pro",name:"PosB Pro",desc:"Çoklu şube, kasa ve operasyon yönetimi",
          description:"Çoklu şube ve kasa yönetimi",year:999,
          features:["Çoklu şube & kasa","Warehouse ve transfer","Invoice ayarları","Vardiya & gün yönetimi"]},
        {id:"enterprise",name:"PosB Enterprise",desc:"Daha büyük mağaza operasyonları için",
          description:"Büyük mağaza operasyonları",year:1999,
          features:["Gelişmiş şube yapısı","Öncelikli entegrasyonlar","Gelişmiş raporlama","Öncelikli destek"]}
      ]
    }
  });
})();
