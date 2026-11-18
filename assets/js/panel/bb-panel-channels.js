(function(){
"use strict";
var root=document.querySelector("[data-bb-channel-registry]");if(!root)return;

var channels=[
 {id:1,code:"BULBULUSTUR",name:"Bulbulustur B2B/B2C",ownership:"owned",type:"Merkezi Pazaryeri",health:"healthy",icon:"storefront",orders:184,pending:3,lastSync:"Şimdi",mode:"Native",open:"dashboard.html",cap:["Sipariş","Product","Stock","Price","İade"]},
 {id:2,code:"DRAUGR",name:"Draugr",ownership:"owned",type:"Kendi Domainin",health:"healthy",icon:"language",orders:72,pending:1,lastSync:"1 dk önce",mode:"Native",open:"draugr.html?view=dashboard",cap:["Sipariş","Product","Stock","Price","Müşteri"]},
 {id:3,code:"POSB",name:"POSB",ownership:"owned",type:"Fiziksel Mağaza / Kasa",health:"healthy",icon:"point_of_sale",orders:96,pending:4,lastSync:"Şimdi",mode:"Offline-first",open:"posb.html?view=dashboard",cap:["Sipariş","Stock","Price","Invoice","Müşteri"]},
 {id:101,code:"TRENDYOL",name:"Trendyol",ownership:"connected",type:"Pazaryeri",health:"healthy",logo:"trendyol.png",orders:128,pending:5,lastSync:"2 dk önce",mode:"Webhook + Poller",cap:["Sipariş","Product","Stock","Price","İade"]},
 {id:102,code:"HEPSIBURADA",name:"Hepsiburada",ownership:"connected",type:"Pazaryeri",health:"warning",logo:"hepsiburada.png",orders:84,pending:9,lastSync:"11 dk önce",mode:"Poller",cap:["Sipariş","Product","Stock","Price","Kargo"]},
 {id:103,code:"TICIMAX",name:"Ticimax",ownership:"connected",type:"E-Ticaret Altyapısı",health:"healthy",logo:"ticimax.png",orders:41,pending:2,lastSync:"4 dk önce",mode:"API + Webhook",cap:["Sipariş","Product","Stock","Price"]},
 {id:104,code:"SHOPIFY",name:"Shopify",ownership:"connected",type:"E-Ticaret Altyapısı",health:"healthy",logo:"shopify.png",orders:37,pending:1,lastSync:"3 dk önce",mode:"Webhook",cap:["Sipariş","Product","Stock","Price","Müşteri"]},
 {id:105,code:"IDEASOFT",name:"Ideasoft",ownership:"connected",type:"E-Ticaret Altyapısı",health:"healthy",logo:"ideasoft.png",orders:22,pending:0,lastSync:"6 dk önce",mode:"API",cap:["Sipariş","Product","Stock","Price"]},
 {id:106,code:"AMAZON_TR",name:"Amazon Türkiye",ownership:"connected",type:"Pazaryeri",health:"warning",logo:"amazon.png",orders:19,pending:7,lastSync:"18 dk önce",mode:"Poller",cap:["Sipariş","Product","Stock","Price","Kargo"]},
 {id:107,code:"N11",name:"N11",ownership:"connected",type:"Pazaryeri",health:"healthy",logo:"N11.png",orders:31,pending:1,lastSync:"5 dk önce",mode:"API",cap:["Sipariş","Product","Stock","Price"]},
 {id:108,code:"PAZARAMA",name:"Pazarama",ownership:"connected",type:"Pazaryeri",health:"offline",logo:"pazarama.png",orders:0,pending:12,lastSync:"1 sa 24 dk",mode:"Poller",cap:["Sipariş","Product","Stock","Price"]},
 {id:109,code:"SHOPIER",name:"Shopier",ownership:"connected",type:"Satış Kanalı",health:"healthy",logo:"shopier.png",orders:12,pending:0,lastSync:"7 dk önce",mode:"API",cap:["Sipariş","Stock"]}
];

var orders=[
 {id:"ORD-260184",channelId:101,external:"TY-94588321",customer:"Ayşe Kaya",total:"₺2.845,00",status:"Yeni",age:"2 dk"},
 {id:"ORD-260183",channelId:1,external:"BB-184293",customer:"Mehmet Demir",total:"₺1.240,00",status:"Hazırlanıyor",age:"4 dk"},
 {id:"ORD-260182",channelId:3,external:"POS-5146-882",customer:"Perakende Müşteri",total:"₺920,00",status:"Tamamlandı",age:"7 dk"},
 {id:"ORD-260181",channelId:104,external:"SH-778410",customer:"Elif Yılmaz",total:"₺3.420,00",status:"Yeni",age:"9 dk"},
 {id:"ORD-260180",channelId:102,external:"HB-118520",customer:"Can Aydın",total:"₺1.675,00",status:"Kanal Bekliyor",age:"12 dk"},
 {id:"ORD-260179",channelId:2,external:"DR-240188",customer:"Zeynep Akın",total:"₺4.780,00",status:"Hazırlanıyor",age:"16 dk"},
 {id:"ORD-260178",channelId:107,external:"N11-55418",customer:"Ali Çetin",total:"₺865,00",status:"Yeni",age:"21 dk"}
];

var grid=root.querySelector("[data-bb-channel-grid]");
var empty=root.querySelector("[data-bb-channel-empty]");
var search=root.querySelector("[data-bb-channel-search]");
var count=root.querySelector("[data-bb-channel-count]");
var orderBody=root.querySelector("[data-bb-channel-orders]");
var orderTitle=root.querySelector("[data-bb-channel-order-title]");
var filters=Array.from(root.querySelectorAll("[data-bb-channel-filter]"));
var selectedOrderChannel=null;

document.addEventListener("error",function(event){
 var img=event.target;
 if(!img || !img.matches || !img.matches("[data-bb-channel-logo-img]"))return;
 var host=img.parentElement;
 if(!host)return;
 img.remove();
 host.innerHTML='<span class="material-symbols-outlined" aria-hidden="true">hub</span>';
},true);

function channelById(id){return channels.find(function(c){return c.id===Number(id);});}
function logoMarkup(c,small){
 var cls=small?"bb-channel-order-logo":"bb-channel-logo";
 if(c.logo)return '<span class="'+cls+'"><img src="../../assets/media/integrators/'+c.logo+'" alt="'+c.name+'" data-bb-channel-logo-img></span>';
 return '<span class="'+cls+'"><span class="material-symbols-outlined" aria-hidden="true">'+(c.icon||"hub")+'</span></span>';
}
function healthLabel(h){return h==="healthy"?"Sağlıklı":h==="warning"?"Gecikme":"Bağlantı Yok";}
function ownershipLabel(o){return o==="owned"?"OWNED":"CONNECTED";}
function statusBadge(status){
 var cls=status==="Tamamlandı"?"bb-badge-success":status==="Kanal Bekliyor"?"bb-badge-warning":status==="Yeni"?"bb-badge-info":"bb-badge-light";
 return '<span class="bb-badge '+cls+'">'+status+'</span>';
}
function renderCards(){
 var active=root.querySelector("[data-bb-channel-filter][aria-pressed='true']");
 var ownership=active?active.dataset.bbChannelFilter:"all";
 var q=(search.value||"").trim().toLocaleLowerCase("tr-TR");
 var visible=channels.filter(function(c){
  return (ownership==="all"||c.ownership===ownership) && (c.name+" "+c.code+" "+c.type).toLocaleLowerCase("tr-TR").includes(q);
 });
 grid.replaceChildren();
 visible.forEach(function(c){
  var card=document.createElement("button");
  card.type="button";card.className="bb-channel-card";card.dataset.channelId=String(c.id);
  card.innerHTML=
   '<span class="bb-channel-card-head">'+logoMarkup(c,false)+'<span class="bb-channel-title"><strong>'+c.name+'</strong><small>'+c.type+'</small></span><span class="bb-channel-health" data-health="'+c.health+'" title="'+healthLabel(c.health)+'"></span></span>'+
   '<span class="bb-channel-card-meta"><span class="bb-channel-card-stat"><strong>'+c.orders+'</strong><small>Bugünkü sipariş</small></span><span class="bb-channel-card-stat"><strong>'+c.pending+'</strong><small>Bekleyen işlem</small></span></span>'+
   '<span class="bb-channel-card-foot"><span class="bb-badge '+(c.ownership==="owned"?"bb-badge-success":"bb-badge-light")+'">'+ownershipLabel(c.ownership)+'</span><code>#'+c.id+' · '+c.code+'</code></span>';
  card.addEventListener("click",function(){openDetail(c.id);});
  grid.append(card);
 });
 count.textContent=visible.length+" kanal";
 empty.hidden=visible.length!==0;
}
function renderOrders(channelId){
 selectedOrderChannel=channelId==null?null:Number(channelId);
 var rows=selectedOrderChannel?orders.filter(function(o){return o.channelId===selectedOrderChannel;}):orders;
 orderBody.replaceChildren();
 if(orderTitle){
  var c=selectedOrderChannel?channelById(selectedOrderChannel):null;
  orderTitle.textContent=c?c.name+" Siparişleri":"Kanallardan Gelen Son Siparişler";
 }
 rows.forEach(function(o){
  var c=channelById(o.channelId);if(!c)return;
  var tr=document.createElement("tr");
  tr.innerHTML='<td><strong>'+o.id+'</strong><small class="d-block text-body-secondary">'+o.external+'</small></td><td><span class="bb-channel-order-source">'+logoMarkup(c,true)+'<span>'+c.name+'</span></span></td><td>'+o.customer+'</td><td>'+o.total+'</td><td>'+statusBadge(o.status)+'</td><td>'+o.age+'</td>';
  orderBody.append(tr);
 });
 if(!rows.length){
  var tr=document.createElement("tr");tr.innerHTML='<td colspan="6" class="text-center text-body-secondary py-5">Bu kanal için demo sipariş yok.</td>';orderBody.append(tr);
 }
}
function openDetail(id){
 var c=channelById(id);if(!c)return;
 var drawer=document.getElementById("bb_channel_detail_drawer");if(!drawer)return;
 drawer.dataset.channelId=String(c.id);
 drawer.querySelector("[data-bb-channel-detail-logo]").innerHTML=logoMarkup(c,false);
 drawer.querySelector("[data-bb-channel-detail-name]").textContent=c.name;
 drawer.querySelector("[data-bb-channel-detail-type]").textContent=c.type+" · "+ownershipLabel(c.ownership);
 drawer.querySelector("[data-bb-channel-detail-id]").textContent="#"+c.id;
 drawer.querySelector("[data-bb-channel-detail-code]").textContent=c.code;
 drawer.querySelector("[data-bb-channel-detail-health]").textContent=healthLabel(c.health);
 drawer.querySelector("[data-bb-channel-detail-sync]").textContent=c.lastSync;
 drawer.querySelector("[data-bb-channel-detail-mode]").textContent=c.mode;
 drawer.querySelector("[data-bb-channel-detail-orders]").textContent=String(c.orders);
 drawer.querySelector("[data-bb-channel-detail-pending]").textContent=String(c.pending);
 var caps=drawer.querySelector("[data-bb-channel-capabilities]");caps.replaceChildren();
 c.cap.forEach(function(x){var b=document.createElement("span");b.className="bb-badge bb-badge-light";b.textContent=x;caps.append(b);});
 var open=drawer.querySelector("[data-bb-channel-open]");
 open.hidden=!c.open; if(c.open)open.href=c.open;
 drawer.querySelector("[data-bb-channel-detail-status]").textContent="";
 window.BBDrawer.open("#bb_channel_detail_drawer");
}
filters.forEach(function(btn){btn.addEventListener("click",function(){filters.forEach(function(x){x.setAttribute("aria-pressed",String(x===btn));});renderCards();});});
search.addEventListener("input",renderCards);
root.querySelector("[data-bb-channel-show-all-orders]").addEventListener("click",function(){renderOrders(null);});
document.querySelector("[data-bb-channel-orders-action]").addEventListener("click",function(){
 var drawer=document.getElementById("bb_channel_detail_drawer");var id=drawer?drawer.dataset.channelId:null;
 if(!id)return;renderOrders(id);window.BBDrawer.close();root.querySelector(".bb-channel-orders").scrollIntoView({behavior:"smooth",block:"start"});
});
document.querySelector("[data-bb-channel-sync]").addEventListener("click",function(){
 var drawer=document.getElementById("bb_channel_detail_drawer");var id=drawer?drawer.dataset.channelId:null;var c=channelById(id);var s=document.querySelector("[data-bb-channel-detail-status]");
 if(c&&s)s.textContent="#"+c.id+" "+c.code+" için demo senkron isteği hazırlandı.";
});
renderCards();renderOrders(null);
}());
