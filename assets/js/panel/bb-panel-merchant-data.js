/* Shared fixtures for the merchant dashboard and order list. */
window.BBMerchantDemo = {
  channels: [
    { id: "bulbulustur", name: "Bulbulustur", type: "Pazaryeri", icon: "storefront", health: "active", href: "orders.html?channel=bulbulustur" },
    { id: "draugr", name: "Draugr", type: "Kendi siteniz", icon: "language", health: "active", href: "draugr.html?view=dashboard" },
    { id: "posb", name: "PosB", type: "Fiziksel mağaza", icon: "point_of_sale", health: "active", href: "pos-system.html" },
    { id: "trendyol", name: "Trendyol", type: "Integration Hub", icon: "hub", health: "active", href: "orders.html?channel=trendyol" },
    { id: "hepsiburada", name: "Hepsiburada", type: "Integration Hub", icon: "hub", health: "warning", href: "integrations.html?q=Hepsiburada" }
  ],
  states: {
    prepare: { label: "Hazırlanacak", tone: "primary" },
    ship: { label: "Kargolanacak", tone: "info" },
    invoice: { label: "Fatura bekliyor", tone: "warning" },
    return: { label: "İade talebi", tone: "danger" },
    done: { label: "Tamamlandı", tone: "success" }
  },
  orders: [
    { id: "26121", customer: "Merve Kaya", channel: "draugr", state: "prepare", total: 2490, time: "13:46", created: "2026-11-21" },
    { id: "26120", customer: "Serkan Yıldız", channel: "bulbulustur", state: "ship", total: 1750, time: "13:38", created: "2026-11-21" },
    { id: "26119", customer: "Perakende müşteri", channel: "posb", state: "done", total: 920, time: "13:24", created: "2026-11-21" },
    { id: "26118", customer: "Elif Şahin", channel: "trendyol", state: "prepare", total: 1280, time: "13:11", created: "2026-11-21" },
    { id: "26117", customer: "Burak Demir", channel: "bulbulustur", state: "invoice", total: 2390, time: "12:54", created: "2026-11-21" },
    { id: "26116", customer: "Selin Ak", channel: "hepsiburada", state: "ship", total: 1450, time: "12:12", created: "2026-11-21" },
    { id: "26115", customer: "Zeynep Yalçın", channel: "draugr", state: "done", total: 1690, time: "11:33", created: "2026-11-21" },
    { id: "26114", customer: "Deniz Arslan", channel: "trendyol", state: "prepare", total: 2090, time: "10:58", created: "2026-11-21" },
    { id: "26113", customer: "Ayşe Akın", channel: "bulbulustur", state: "return", total: 1190, time: "10:42", created: "2026-11-21" }
  ],
  questions: [
    { customer: "Derya Işık", channel: "bulbulustur", product: "Deri ev terliği", detail: "Ürünün kalıbı dar mı? 38 ve 39 numara arasında kaldım.", time: "13:52" },
    { customer: "Can Aydın", channel: "draugr", product: "Günlük yürüyüş ayakkabısı", detail: "Siyah renk için 43 numara tekrar stoğa girecek mi?", time: "11:24" }
  ],
  returnReasons: {
    "26113": "Numara uymadı. Alıcı ürünü iade etmek istiyor."
  },
  stock: [
    { name: "Günlük yürüyüş ayakkabısı", sku: "AY-204 · Siyah / 43", quantity: 2 },
    { name: "Deri ev terliği", sku: "TR-118 · Taba / 38", quantity: 3 },
    { name: "Anatomik tabanlı sandalet", sku: "SD-072 · Kum / 40", quantity: 4 }
  ],
  payout: { paid: 20840, pending: 8730, reversed: 1190 }
};
