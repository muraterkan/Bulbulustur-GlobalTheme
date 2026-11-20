/* Panel Calendar — leave and appointments. Local demo data only; no API writes. */
(function () {
  "use strict";

  const root = document.querySelector("[data-bb-calendar]");
  if (!root) return;

  const $ = selector => root.querySelector(selector);
  const $$ = selector => Array.from(root.querySelectorAll(selector));
  const today = new Date();
  const staff = [
    {id:"ayse",name:"Ayşe Demir",role:"Uzman",avatar:"300-2.webp"},
    {id:"mert",name:"Mert Kaya",role:"Danışman",avatar:"300-5.webp"},
    {id:"selin",name:"Selin Arslan",role:"Uzman",avatar:"300-6.webp"},
    {id:"emre",name:"Emre Yılmaz",role:"Danışman",avatar:"300-12.webp"},
    {id:"deniz",name:"Deniz Aksoy",role:"Uzman",avatar:"2ab21709-aa5c-451e-8be7-3b8c56c59a3c.webp"}
  ];
  const leaveTypes = {
    annual:"Yıllık izin",sick:"Hastalık",parental:"Ebeveyn izni",unpaid:"Ücretsiz izin"
  };
  const statuses = {
    booked:"Rezerve",arrived:"Geldi",completed:"Tamamlandı",
    unpaid:"Ödeme bekliyor",cancelled:"İptal edildi"
  };
  const avatarBase = "../../assets/media/avatars/";
  const pad = n => String(n).padStart(2,"0");
  const iso = date => date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate());
  const parse = value => {
    const parts = value.split("-").map(Number);
    return new Date(parts[0],parts[1]-1,parts[2]);
  };
  const addDays = (date, days) => new Date(date.getFullYear(),date.getMonth(),date.getDate()+days);
  const startMonday = date => addDays(date,-((date.getDay()+6)%7));
  const dayDiff = (from,to) => Math.round((Date.UTC(to.getFullYear(),to.getMonth(),to.getDate()) -
    Date.UTC(from.getFullYear(),from.getMonth(),from.getDate())) / 86400000);
  const monthLabel = date => new Intl.DateTimeFormat("tr-TR",{month:"long",year:"numeric"}).format(date);
  const longDate = date => new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"}).format(date);
  const shortDate = date => new Intl.DateTimeFormat("tr-TR",{day:"numeric",month:"short"}).format(date);
  const weekday = date => new Intl.DateTimeFormat("tr-TR",{weekday:"short"}).format(date);
  const monthStart = new Date(today.getFullYear(),today.getMonth(),1);
  const relative = (offset,base=monthStart) => iso(addDays(base,offset));

  const leaves = [
    {id:"l1",person:"ayse",type:"annual",start:relative(2),end:relative(5),created:false},
    {id:"l2",person:"deniz",type:"sick",start:relative(8),end:relative(9),created:false},
    {id:"l3",person:"selin",type:"parental",start:relative(14),end:relative(19),created:false},
    {id:"l4",person:"mert",type:"annual",start:relative(17),end:relative(21),created:false},
    {id:"l5",person:"emre",type:"unpaid",start:relative(23),end:relative(25),created:false},
    {id:"l6",person:"deniz",type:"annual",start:relative(27),end:relative(31),created:false},
    {id:"l7",person:"ayse",type:"sick",start:relative(3,new Date(today.getFullYear(),today.getMonth()+1,1)),end:relative(4,new Date(today.getFullYear(),today.getMonth()+1,1)),created:false}
  ];
  const bookings = [
    {id:"b1",person:"ayse",client:"Bahar Özdemir",service:"Kontrol",date:iso(today),time:"09:00",status:"completed",created:false},
    {id:"b2",person:"mert",client:"Cem Karaca",service:"Danışma",date:iso(today),time:"10:00",status:"booked",created:false},
    {id:"b3",person:"selin",client:"Duru Şen",service:"Görüşme",date:iso(today),time:"11:00",status:"arrived",created:false},
    {id:"b4",person:"emre",client:"Ece Taş",service:"Bakım",date:iso(today),time:"09:00",status:"unpaid",created:false},
    {id:"b5",person:"deniz",client:"Fırat Polat",service:"Kontrol",date:iso(today),time:"15:00",status:"booked",created:false},
    {id:"b6",person:"ayse",client:"Gizem Uslu",service:"Bakım",date:iso(today),time:"14:00",status:"booked",created:false},
    {id:"b7",person:"selin",client:"Hakan Tunç",service:"Danışma",date:iso(addDays(today,1)),time:"10:00",status:"completed",created:false},
    {id:"b8",person:"deniz",client:"İpek Sezer",service:"İnceleme",date:iso(addDays(today,2)),time:"12:00",status:"booked",created:false},
    {id:"b9",person:"mert",client:"Kerem Çelik",service:"Kontrol",date:iso(addDays(today,-1)),time:"16:00",status:"cancelled",created:false},
    {id:"b10",person:"emre",client:"Lale Güneş",service:"Görüşme",date:iso(addDays(today,4)),time:"11:00",status:"arrived",created:false}
  ];

  const state = {
    mode:"leave",bookingView:"day",date:new Date(today.getFullYear(),today.getMonth(),today.getDate()),
    month:new Date(today.getFullYear(),today.getMonth(),1),
    filters:new Set(Object.keys(leaveTypes))
  };
  let selectedDetail = null;
  function node(tag,className,text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function icon(name) {
    const element = node("span","material-symbols-outlined",name);
    element.setAttribute("aria-hidden","true");
    return element;
  }
  function button(label,className,iconName) {
    const element = node("button",className,label);
    element.type = "button";
    if (iconName) element.prepend(icon(iconName));
    return element;
  }
  function avatar(person) {
    const symbol = node("span","bb-symbol size-35 is-circle bb-cal-avatar");
    const picture = node("img");
    picture.src = avatarBase + person.avatar;
    picture.alt = "";
    picture.loading = "lazy";
    picture.addEventListener("error",() => {
      symbol.replaceChildren(node("span","bb-symbol-label",person.name.charAt(0)));
    },{once:true});
    symbol.append(picture);
    return symbol;
  }
  function person(id) { return staff.find(item => item.id === id) || staff[0]; }
  function announce(message) { $("[data-bb-cal-status]").textContent = message; }

  function openLeaveDialog(date) {
    const dialog = document.querySelector("[data-bb-cal-leave-dialog]");
    dialog.querySelector("[name='start']").value = iso(date || state.date);
    dialog.querySelector("[name='end']").value = iso(date || state.date);
    dialog.querySelector("[data-bb-cal-leave-error]").hidden = true;
    dialog.showModal();
  }
  function openBookingDialog(date,personId,hour) {
    const dialog = document.querySelector("[data-bb-cal-booking-dialog]");
    dialog.querySelector("[name='date']").value = iso(date || state.date);
    dialog.querySelector("[name='person']").value = personId || staff[0].id;
    dialog.querySelector("[name='time']").value = hour === undefined ? "09:00" : pad(hour)+":00";
    dialog.querySelector("[name='client']").value = "";
    dialog.querySelector("[data-bb-cal-booking-error]").hidden = true;
    dialog.showModal();
  }
  function openDetail(kind,item) {
    selectedDetail = {kind,id:item.id};
    const dialog = document.querySelector("[data-bb-cal-detail-dialog]");
    const list = dialog.querySelector("[data-bb-cal-detail-list]");
    const fields = kind === "leave" ?
      [["Personel",person(item.person).name],["Tür",leaveTypes[item.type]],["Başlangıç",shortDate(parse(item.start))],["Bitiş",shortDate(parse(item.end))]] :
      [["Müşteri / Hasta",item.client],["Personel",person(item.person).name],["Hizmet",item.service],["Tarih",longDate(parse(item.date))],["Saat",item.time],["Durum",statuses[item.status]]];
    list.replaceChildren();
    fields.forEach(([label,value]) => {
      const dt = node("dt","",label), dd = node("dd","",value);
      list.append(dt,dd);
    });
    dialog.querySelector("[data-bb-cal-detail-heading]").textContent = kind === "leave" ? "İzin ayrıntısı" : "Randevu ayrıntısı";
    dialog.querySelector("[data-bb-cal-remove-demo]").hidden = !item.created;
    dialog.showModal();
  }

  function renderMini() {
    const grid = $("[data-bb-cal-mini-grid]");
    grid.replaceChildren();
    $("[data-bb-cal-mini-title]").textContent = monthLabel(state.month);
    const first = startMonday(state.month);
    for (let i=0;i<42;i++) {
      const date = addDays(first,i);
      const value = iso(date);
      const item = button(String(date.getDate()),"bb-cal-mini-day");
      item.dataset.outside = String(date.getMonth() !== state.month.getMonth());
      item.setAttribute("aria-label",longDate(date));
      item.setAttribute("aria-pressed",String(value === iso(state.date)));
      if (value === iso(today)) item.setAttribute("aria-current","date");
      const has = state.mode === "leave" ?
        leaves.some(l => state.filters.has(l.type) && l.start <= value && l.end >= value) :
        bookings.some(b => b.date === value);
      if (has) item.append(node("span","bb-cal-mini-dot"));
      item.addEventListener("click",() => {
        state.date = date;
        state.month = new Date(date.getFullYear(),date.getMonth(),1);
        render();
      });
      grid.append(item);
    }
  }
  function renderUpcoming() {
    const list = $("[data-bb-cal-upcoming]");
    const upcoming = leaves.filter(item => state.filters.has(item.type) && item.end >= iso(today))
      .sort((a,b) => a.start.localeCompare(b.start)).slice(0,5);
    list.replaceChildren();
    upcoming.forEach(item => {
      const li = node("li");
      const control = button("","bb-cal-upcoming-link");
      const dot = node("span","bb-cal-type-dot");
      dot.dataset.type = item.type;
      const copy = node("span","bb-cal-upcoming-copy");
      copy.append(node("strong","",person(item.person).name + " · " + leaveTypes[item.type]),
        node("small","",shortDate(parse(item.start)) + " – " + shortDate(parse(item.end))));
      control.append(dot,copy);
      control.addEventListener("click",() => {
        state.month = new Date(parse(item.start).getFullYear(),parse(item.start).getMonth(),1);
        state.date = parse(item.start);
        render();
        openDetail("leave",item);
      });
      li.append(control);
      list.append(li);
    });
    if (!upcoming.length) list.append(node("li","bb-cal-helper","Gösterilecek yaklaşan izin yok."));
  }
  function renderTeam() {
    const list = $("[data-bb-cal-team-list]");
    list.replaceChildren();
    staff.forEach(item => {
      const li = node("li","bb-cal-team-item");
      const info = node("span","bb-cal-team-info");
      info.append(node("strong","",item.name),node("small","",item.role));
      li.append(avatar(item),info);
      list.append(li);
    });
  }
  function renderMonth() {
    const container = $("[data-bb-cal-month-grid]");
    container.replaceChildren();
    const first = startMonday(state.month);
    for (let weekIndex=0;weekIndex<6;weekIndex++) {
      const weekStart = addDays(first,weekIndex*7);
      const weekEnd = addDays(weekStart,6);
      const week = node("div","bb-cal-month-week");
      for(let i=0;i<7;i++){
        const date = addDays(weekStart,i);
        const day = node("div","bb-cal-month-day");
        day.dataset.outside = String(date.getMonth() !== state.month.getMonth());
        const btn = button(String(date.getDate()),"bb-cal-month-day-button");
        const value=iso(date);
        btn.setAttribute("aria-label",longDate(date));
        btn.setAttribute("aria-pressed",String(value === iso(state.date)));
        if (value === iso(today)) btn.setAttribute("aria-current","date");
        btn.addEventListener("click",() => {
          state.date = date;
          if(date.getMonth() !== state.month.getMonth())
            state.month = new Date(date.getFullYear(),date.getMonth(),1);
          render();
        });
        day.append(btn);
        week.append(day);
      }
      const overlay = node("div","bb-cal-leave-layer");
      const relevant = leaves.filter(item => state.filters.has(item.type) &&
        item.end >= iso(weekStart) && item.start <= iso(weekEnd))
        .sort((a,b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
      const lanes=[[],[],[]];
      let overflow=0;
      relevant.forEach(item => {
        const start=Math.max(1,dayDiff(weekStart,parse(item.start))+1);
        const end=Math.min(7,dayDiff(weekStart,parse(item.end))+1);
        let lane=lanes.findIndex(used => !used.some(([from,to]) => from<=end && to>=start));
        if(lane<0){overflow++;return;}
        lanes[lane].push([start,end]);
        const pill=button("","bb-cal-leave-bar");
        pill.dataset.type=item.type;
        pill.dataset.column=String(start);
        pill.dataset.span=String(end-start+1);
        pill.dataset.lane=String(lane+1);
        pill.setAttribute("aria-label",person(item.person).name+" · "+leaveTypes[item.type]+
          " · "+shortDate(parse(item.start))+" – "+shortDate(parse(item.end)));
        const dot=node("span","bb-cal-type-dot"); dot.dataset.type=item.type;
        const text=node("span","bb-cal-leave-bar-text",person(item.person).name + ": " + leaveTypes[item.type]);
        pill.append(dot,text);
        if(start===1 || item.start>=iso(weekStart)) pill.append(avatar(person(item.person)));
        pill.addEventListener("click",() => openDetail("leave",item));
        overlay.append(pill);
      });
      if(overflow){
        const note=node("span","bb-cal-week-overflow","+"+overflow+" izin");
        overlay.append(note);
      }
      week.append(overlay);
      container.append(week);
    }
  }
  function renderBooking() {
    const grid = $("[data-bb-cal-booking-grid]");
    const isWeek=state.bookingView==="week";
    grid.dataset.view=state.bookingView;
    grid.replaceChildren();
    const monday=startMonday(state.date);
    const columns=isWeek ? Array.from({length:7},(_,i) => ({id:iso(addDays(monday,i)),date:addDays(monday,i)})) :
      staff.map(item=>({id:item.id,staff:item}));
    const corner=node("div","bb-cal-schedule-corner","Saat");
    grid.append(corner);
    columns.forEach(col => {
      const head=node("div","bb-cal-schedule-head");
      if(isWeek){
        const weekDate=col.date;
        head.append(node("strong","",weekday(weekDate)+" "+weekDate.getDate()),
          node("small","",monthLabel(weekDate)));
        if(iso(weekDate)===iso(today))head.dataset.today="true";
      } else {
        head.append(avatar(col.staff));
        const text=node("div","bb-cal-resource-name");
        text.append(node("strong","",col.staff.name),node("small","",col.staff.role));
        head.append(text);
      }
      grid.append(head);
    });
    const visibleDates=new Set(isWeek?columns.map(c=>c.id):[iso(state.date)]);
    const matches=bookings.filter(item=>visibleDates.has(item.date));
    $("[data-bb-cal-booking-count]").textContent=matches.length+" randevu";
    for(let hour=9;hour<18;hour++){
      const hourLabel=node("div","bb-cal-schedule-time",pad(hour)+":00");
      grid.append(hourLabel);
      columns.forEach(col=>{
        const date=isWeek?col.date:state.date;
        const events=bookings.filter(b=>b.date===iso(date) && Number(b.time.slice(0,2))===hour &&
          (isWeek||b.person===col.id)).sort((a,b)=>a.time.localeCompare(b.time));
        const slot=node("div","bb-cal-schedule-slot");
        if (!events.length && !isWeek && hour===13) {
          const breakNote=node("span","bb-cal-schedule-break","Mola");
          breakNote.prepend(icon("schedule"));
          slot.append(breakNote);
        } else {
          events.forEach(item=>{
            const event=button("","bb-cal-appointment");
            event.dataset.status=item.status;
            event.append(node("strong","",item.client),node("small","",item.time+" · "+item.service));
            if(isWeek)event.append(node("small","bb-cal-event-staff",person(item.person).name));
            else event.append(node("span","bb-cal-event-state",statuses[item.status]));
            event.setAttribute("aria-label",item.client+" · "+person(item.person).name+" · "+item.time+" · "+statuses[item.status]);
            event.addEventListener("click",()=>openDetail("booking",item));
            slot.append(event);
          });
          if(!events.length){
            const add=button("","bb-cal-schedule-add","add");
            add.setAttribute("aria-label",longDate(date)+", "+pad(hour)+":00 için randevu ekle"+
              (isWeek?"":", "+col.staff.name));
            add.addEventListener("click",()=>openBookingDialog(date,isWeek?staff[0].id:col.id,hour));
            slot.append(add);
          }
        }
        grid.append(slot);
      });
    }
  }
  function render() {
    $$("[data-bb-cal-mode]").forEach(btn => {
      btn.setAttribute("aria-pressed",String(btn.dataset.bbCalMode===state.mode));
    });
    const leave=state.mode==="leave";
    $("[data-bb-cal-booking-controls]").hidden=leave;
    $("[data-bb-cal-leave-content]").hidden=!leave;
    $("[data-bb-cal-booking-content]").hidden=leave;
    $("[data-bb-cal-leave-aside]").hidden=!leave;
    $("[data-bb-cal-booking-aside]").hidden=leave;
    $$("[data-bb-cal-booking-view]").forEach(btn =>
      btn.setAttribute("aria-pressed",String(btn.dataset.bbCalBookingView===state.bookingView)));
    $("[data-bb-cal-period]").textContent=leave ? monthLabel(state.month) :
      state.bookingView==="day" ? longDate(state.date) :
      shortDate(startMonday(state.date))+" – "+shortDate(addDays(startMonday(state.date),6));
    renderMini();
    renderUpcoming();
    renderTeam();
    if(leave)renderMonth();else renderBooking();
  }

  $$("[data-bb-cal-mode]").forEach(btn=>btn.addEventListener("click",()=>{
    state.mode=btn.dataset.bbCalMode;
    state.month=new Date(state.date.getFullYear(),state.date.getMonth(),1);
    render();
    announce(state.mode==="leave"?"Aylık izin planı gösteriliyor.":"Randevu çizelgesi gösteriliyor.");
  }));
  $$("[data-bb-cal-booking-view]").forEach(btn=>btn.addEventListener("click",()=>{
    state.bookingView=btn.dataset.bbCalBookingView;render();
  }));
  $("[data-bb-cal-prev]").addEventListener("click",()=>{
    if(state.mode==="leave"){
      state.month=new Date(state.month.getFullYear(),state.month.getMonth()-1,1);
      state.date=new Date(state.month.getFullYear(),state.month.getMonth(),1);
    }else{
      state.date=addDays(state.date,state.bookingView==="day"?-1:-7);
      state.month=new Date(state.date.getFullYear(),state.date.getMonth(),1);
    }
    render();
  });
  $("[data-bb-cal-next]").addEventListener("click",()=>{
    if(state.mode==="leave"){
      state.month=new Date(state.month.getFullYear(),state.month.getMonth()+1,1);
      state.date=new Date(state.month.getFullYear(),state.month.getMonth(),1);
    }else{
      state.date=addDays(state.date,state.bookingView==="day"?1:7);
      state.month=new Date(state.date.getFullYear(),state.date.getMonth(),1);
    }
    render();
  });
  $("[data-bb-cal-today]").addEventListener("click",()=>{
    state.date=new Date(today.getFullYear(),today.getMonth(),today.getDate());
    state.month=new Date(today.getFullYear(),today.getMonth(),1);render();
  });
  $("[data-bb-cal-mini-prev]").addEventListener("click",()=>{
    state.month=new Date(state.month.getFullYear(),state.month.getMonth()-1,1);
    if(state.mode==="leave")state.date=new Date(state.month);
    render();
  });
  $("[data-bb-cal-mini-next]").addEventListener("click",()=>{
    state.month=new Date(state.month.getFullYear(),state.month.getMonth()+1,1);
    if(state.mode==="leave")state.date=new Date(state.month);
    render();
  });
  $$("[data-bb-cal-type]").forEach(input=>input.addEventListener("change",()=>{
    if(input.checked)state.filters.add(input.dataset.bbCalType);
    else state.filters.delete(input.dataset.bbCalType);
    render();
  }));

  for (const selector of ["[data-bb-cal-leave-person]","[data-bb-cal-booking-person]"]) {
    const control=document.querySelector(selector);
    staff.forEach(item=>{
      const option=node("option","",item.name);
      option.value=item.id;
      control.append(option);
    });
  }
  const timeSelect=document.querySelector("[data-bb-cal-time]");
  for(let hour=9;hour<18;hour++){
    const option=node("option","",pad(hour)+":00");
    option.value=pad(hour)+":00";
    timeSelect.append(option);
  }
  document.querySelectorAll("[data-bb-cal-add]").forEach(btn=>btn.addEventListener("click",()=>{
    if(btn.dataset.bbCalAdd==="leave")openLeaveDialog(state.date);
    else openBookingDialog(state.date);
  }));
  document.querySelectorAll("[data-bb-cal-close]").forEach(btn=>btn.addEventListener("click",()=>{
    btn.closest("dialog").close();
  }));

  const leaveForm=document.querySelector("[data-bb-cal-leave-form]");
  leaveForm.addEventListener("submit",event=>{
    event.preventDefault();
    if(!leaveForm.reportValidity())return;
    const data=new FormData(leaveForm);
    const start=String(data.get("start")),end=String(data.get("end"));
    const feedback=leaveForm.querySelector("[data-bb-cal-leave-error]");
    if(end<start){
      feedback.hidden=false;
      feedback.textContent="Bitiş tarihi başlangıçtan önce olamaz.";
      return;
    }
    leaves.push({
      id:"leave-"+Date.now(),person:String(data.get("person")),type:String(data.get("type")),
      start,end,created:true
    });
    state.mode="leave";
    state.date=parse(start);
    state.month=new Date(state.date.getFullYear(),state.date.getMonth(),1);
    leaveForm.closest("dialog").close();
    render();
    announce("Örnek izin kaydı takvime eklendi. Sunucuya kaydedilmedi.");
  });
  const bookingForm=document.querySelector("[data-bb-cal-booking-form]");
  bookingForm.addEventListener("submit",event=>{
    event.preventDefault();
    if(!bookingForm.reportValidity())return;
    const data=new FormData(bookingForm);
    const date=String(data.get("date")),time=String(data.get("time")),personId=String(data.get("person"));
    const feedback=bookingForm.querySelector("[data-bb-cal-booking-error]");
    if(bookings.some(item=>item.date===date && item.time===time && item.person===personId && item.status!=="cancelled")){
      feedback.hidden=false;
      feedback.textContent="Bu personelin seçilen saatinde zaten bir randevu var.";
      return;
    }
    bookings.push({
      id:"booking-"+Date.now(),person:personId,date,time,
      client:String(data.get("client")).trim(),service:String(data.get("service")),
      status:String(data.get("status")),created:true
    });
    state.mode="booking";
    state.date=parse(date);
    state.month=new Date(state.date.getFullYear(),state.date.getMonth(),1);
    bookingForm.closest("dialog").close();
    render();
    announce("Örnek randevu takvime eklendi. Sunucuya kaydedilmedi.");
  });
  document.querySelector("[data-bb-cal-remove-demo]").addEventListener("click",()=>{
    if(!selectedDetail)return;
    const items=selectedDetail.kind==="leave"?leaves:bookings;
    const index=items.findIndex(item=>item.id===selectedDetail.id && item.created);
    if(index<0)return;
    items.splice(index,1);
    selectedDetail=null;
    document.querySelector("[data-bb-cal-detail-dialog]").close();
    render();
    announce("Örnek kayıt takvimden kaldırıldı.");
  });
  render();
  announce("Takvim demo verileri gösteriliyor. Gerçek izin veya randevu kaydı oluşturulmaz.");
})();