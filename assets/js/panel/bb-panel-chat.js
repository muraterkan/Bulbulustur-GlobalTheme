(function () {
  "use strict";
  const root = document.querySelector("[data-bb-chat]");
  if (!root) return;

  const list = root.querySelector("[data-bb-chat-list]");
  const search = root.querySelector("[data-bb-chat-search]");
  const empty = root.querySelector("[data-bb-chat-empty]");
  const count = root.querySelector("[data-bb-chat-count]");
  const messages = root.querySelector("[data-bb-chat-messages]");
  const name = root.querySelector("[data-bb-chat-thread-name]");
  const status = root.querySelector("[data-bb-chat-thread-status]");
  const avatarHost = root.querySelector("[data-bb-chat-thread-avatar]");
  const presenceDot = root.querySelector("[data-bb-chat-presence-dot]");
  const form = root.querySelector("[data-bb-chat-compose]");
  const input = root.querySelector("[data-bb-chat-input]");
  const feedback = root.querySelector("[data-bb-chat-feedback]");

  const people = [
    {id:1,name:"Brian Cox",email:"brian@exchange.com",online:true,unread:5,last:"2 dk",avatar:"../../assets/media/avatars/300-12.webp",messages:[
      {side:"in",text:"New sezon ürünleri için stok planını bugün netleştirebilir miyiz?",time:"2 dk"},
      {side:"out",text:"Evet. Öğleden sonra kategori bazında listeyi paylaşacağım.",time:"5 dk"},
      {side:"in",text:"Tamamdır, özellikle aksesuar grubunu ayrıca kontrol edelim.",time:"1 sa"},
      {side:"out",text:"Not aldım. Kritik varyantları da ayrıca işaretlerim.",time:"2 sa"}
    ]},
    {id:2,name:"Emma Smith",email:"smith@kpmg.com",online:true,unread:2,last:"18 dk",avatar:"../../assets/media/avatars/300-2.webp",messages:[
      {side:"in",text:"New mağaza başvurusundaki belgeleri kontrol ettiniz mi?",time:"18 dk"},
      {side:"out",text:"Evet, bir belge eksik. Panelden tekrar yüklenmesini isteyeceğim.",time:"14 dk"}
    ]},
    {id:3,name:"Melody Macy",email:"melody@altbox.com",online:false,unread:0,last:"2 sa",avatar:"",messages:[
      {side:"in",text:"Kampanya başlangıç tarihini yarına çekebilir miyiz?",time:"2 sa"},
      {side:"out",text:"Takvimi kontrol edip size dönüş yapacağım.",time:"1 sa"}
    ]},
    {id:4,name:"Max Smith",email:"max@kt.com",online:true,unread:0,last:"4 sa",avatar:"../../assets/media/avatars/300-5.webp",messages:[
      {side:"in",text:"Product aktarımı tamamlandı mı?",time:"4 sa"},
      {side:"out",text:"Katalog tamamlandı, fiyat deltasını bekliyoruz.",time:"3 sa"}
    ]},
    {id:5,name:"Sean Bean",email:"sean@dellito.com",online:false,unread:1,last:"Dün",avatar:"../../assets/media/avatars/300-6.webp",messages:[
      {side:"in",text:"Order raporunu CSV olarak indirebilir miyiz?",time:"Dün"},
      {side:"out",text:"Demo sayfada yok; gerçek panelde rapor aksiyonuna bağlanacak.",time:"Dün"}
    ]}
  ];

  let activeId = people[0].id;

  function initial(person) {
    return person.name.trim().charAt(0).toUpperCase();
  }

  function renderList() {
    const q = search.value.trim().toLocaleLowerCase("tr-TR");
    const filtered = people.filter(person =>
      (person.name + " " + person.email + " " + person.messages.map(x => x.text).join(" "))
        .toLocaleLowerCase("tr-TR").includes(q)
    );

    list.replaceChildren();
    empty.hidden = filtered.length > 0;
    count.textContent = String(filtered.length);

    filtered.forEach(person => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bb-chat-list-item";
      button.setAttribute("aria-selected", String(person.id === activeId));

      const avatar = document.createElement(person.avatar ? "img" : "span");
      avatar.className = "bb-chat-list-avatar";
      if (person.avatar) {
        avatar.src = person.avatar;
        avatar.alt = "";
      } else {
        avatar.textContent = initial(person);
      }

      const copy = document.createElement("span");
      copy.className = "bb-chat-list-copy";
      const top = document.createElement("span");
      top.className = "bb-chat-list-top";
      const strong = document.createElement("strong");
      strong.textContent = person.name;
      const time = document.createElement("small");
      time.textContent = person.last;
      top.append(strong, time);

      const meta = document.createElement("span");
      meta.className = "bb-chat-list-meta";
      const email = document.createElement("small");
      email.textContent = person.email;
      meta.append(email);
      if (person.unread) {
        const badge = document.createElement("span");
        badge.className = "bb-badge bb-badge-light-primary";
        badge.textContent = String(person.unread);
        meta.append(badge);
      }

      copy.append(top, meta);
      button.append(avatar, copy);
      button.addEventListener("click", () => {
        activeId = person.id;
        person.unread = 0;
        renderList();
        renderThread();
      });
      list.append(button);
    });
  }

  function renderThread() {
    const person = people.find(x => x.id === activeId);
    if (!person) return;

    name.textContent = person.name;
    status.textContent = person.online ? "Aktif" : "Çevrimdışı";
    presenceDot.classList.toggle("is-online", person.online);

    avatarHost.replaceChildren();
    if (person.avatar) {
      const img = document.createElement("img");
      img.src = person.avatar;
      img.alt = "";
      avatarHost.append(img);
    } else {
      const span = document.createElement("span");
      span.className = "bb-chat-avatar-fallback";
      span.textContent = initial(person);
      avatarHost.append(span);
    }

    messages.replaceChildren();
    person.messages.forEach(message => {
      const row = document.createElement("div");
      row.className = "bb-chat-message";
      row.dataset.side = message.side;

      const meta = document.createElement("div");
      meta.className = "bb-chat-message-meta";
      const author = document.createElement("strong");
      author.textContent = message.side === "out" ? "Siz" : person.name;
      const time = document.createElement("small");
      time.textContent = message.time;
      meta.append(author, time);

      const bubble = document.createElement("div");
      bubble.className = "bb-chat-bubble";
      bubble.textContent = message.text;

      row.append(meta, bubble);
      messages.append(row);
    });
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      feedback.textContent = "Mesaj alanı boş bırakılamaz.";
      input.focus();
      return;
    }
    const person = people.find(x => x.id === activeId);
    person.messages.push({side:"out",text:value,time:"Şimdi"});
    person.last = "Şimdi";
    input.value = "";
    feedback.textContent = "Mesaj yalnızca demo konuşmasına eklendi.";
    renderList();
    renderThread();
  });

  search.addEventListener("input", renderList);
  root.querySelector("[data-bb-chat-filter]").addEventListener("click", () => {
    const current = root.getAttribute("data-bb-chat-online-only") === "true";
    root.setAttribute("data-bb-chat-online-only", String(!current));
    feedback.textContent = current ? "Çevrimiçi filtresi kaldırıldı." : "Çevrimiçi filtresi demo olarak etkinleştirildi.";
  });
  root.querySelector("[data-bb-chat-new]").addEventListener("click", () => {
    feedback.textContent = "New konuşma oluşturma demo sürümünde kayıt yapmaz.";
    input.focus();
  });
  root.querySelector("[data-bb-chat-more]").addEventListener("click", () => {
    feedback.textContent = "Konuşma seçenekleri demo sürümünde pasiftir.";
  });

  renderList();
  renderThread();
})();