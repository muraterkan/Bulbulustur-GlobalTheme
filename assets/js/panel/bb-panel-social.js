/* Social feed demo — session-only interactions; no API or persistent data. */
(function(){
"use strict";
var root=document.querySelector("[data-bb-social-feed]");
if(!root)return;
var form=root.querySelector("[data-bb-social-compose]");
var textarea=form.querySelector("textarea");
var list=root.querySelector("[data-bb-social-posts]");
var status=root.querySelector("[data-bb-social-status]");
var empty=root.querySelector("[data-bb-social-empty]");
var filter="all";
function refresh(){
 var count=0;
 list.querySelectorAll("[data-bb-social-post]").forEach(function(post){
  var visible=filter==="all"||post.dataset.followed==="true";
  post.hidden=!visible;if(visible)count++;
 });
 root.querySelectorAll("[data-bb-social-filter]").forEach(function(button){
  var selected=button.dataset.bbSocialFilter===filter;
  button.setAttribute("aria-pressed",String(selected));
 });
 status.textContent=count+" demo paylaşım gösteriliyor. Gerçek sosyal ağ verisi kullanılmaz.";
 empty.hidden=count!==0;
}
function avatar(initials){var symbol=document.createElement("span");symbol.className="bb-symbol size-35 is-circle";var label=document.createElement("span");label.className="bb-symbol-label";label.textContent=initials;symbol.append(label);return symbol;}
function createPost(content){
 var article=document.createElement("article");article.className="bb-card";article.dataset.bbSocialPost="";article.dataset.followed="true";
 var body=document.createElement("div");body.className="bb-card-body";
 var head=document.createElement("div");head.className="bb-social-post-header";
 head.append(avatar("ÖK"));var detail=document.createElement("div");detail.className="flex-grow-1";
 var name=document.createElement("strong");name.textContent="Murat Erkan";
 var date=document.createElement("small");date.textContent="Şimdi · Demo";
 detail.append(name,date);head.append(detail);
 var paragraph=document.createElement("p");paragraph.className="bb-social-post-text";paragraph.textContent=content;
 var actions=document.createElement("div");actions.className="bb-social-post-actions";
 var like=document.createElement("button");like.type="button";like.className="btn bb-btn-secondary btn-sm";like.dataset.bbSocialLike="";like.setAttribute("aria-pressed","false");
 var icon=document.createElement("span");icon.className="material-symbols-outlined";icon.textContent="favorite";icon.setAttribute("aria-hidden","true");
 var count=document.createElement("span");count.dataset.bbSocialLikeCount="";count.textContent="0";like.append(icon,count,document.createTextNode(" Beğeni"));
 var commentsCount=document.createElement("span");commentsCount.className="bb-social-muted";commentsCount.dataset.bbSocialCommentCount="";commentsCount.textContent="0 yorum";actions.append(like,commentsCount);
 var comments=document.createElement("div");comments.className="bb-social-comment-list";comments.dataset.bbSocialComments="";
 var commentForm=document.createElement("form");commentForm.className="bb-social-comment-form";commentForm.dataset.bbSocialCommentForm="";
 var input=document.createElement("input");input.className="form-control form-control-solid";input.name="comment";input.maxLength=300;input.placeholder="Yorum yazın...";input.required=true;input.setAttribute("aria-label","Yorumunuz");
 var submit=document.createElement("button");submit.type="submit";submit.className="btn btn-primary btn-sm";submit.textContent="Gönder";
 commentForm.append(input,submit);body.append(head,paragraph,actions,comments,commentForm);article.append(body);
 return article;
}
root.addEventListener("click",function(event){
 var filterButton=event.target.closest("[data-bb-social-filter]");
 if(filterButton){filter=filterButton.dataset.bbSocialFilter;refresh();return;}
 var follow=event.target.closest("[data-bb-social-follow]");
 if(follow){var active=follow.getAttribute("aria-pressed")==="true";follow.setAttribute("aria-pressed",String(!active));follow.textContent=active?"Takip Et":"Takip Ediliyor";return;}
 var like=event.target.closest("[data-bb-social-like]");
 if(like){var number=like.querySelector("[data-bb-social-like-count]"),active=like.getAttribute("aria-pressed")==="true";like.setAttribute("aria-pressed",String(!active));number.textContent=String(Number(number.textContent)+(active?-1:1));like.classList.toggle("btn-primary",!active);like.classList.toggle("bb-btn-secondary",active);return;}
 var hide=event.target.closest("[data-bb-social-hide]");
 if(hide){hide.closest("[data-bb-social-post]").remove();refresh();return;}
 var copy=event.target.closest("[data-bb-social-copy]");
 if(copy){var post=copy.closest("[data-bb-social-post]"),message=post.querySelector(".bb-social-post-text")?.textContent||"";if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(message).then(function(){status.textContent="Demo gönderi metni kopyalandı.";}).catch(function(){status.textContent="Copyma engellendi.";});else status.textContent="Copyma için güvenli bir bağlantı gerekiyor.";return;}
});
root.addEventListener("submit",function(event){
 var commentForm=event.target.closest("[data-bb-social-comment-form]");
 if(!commentForm)return;
 event.preventDefault();
 if(!commentForm.reportValidity())return;
 var field=commentForm.querySelector('[name="comment"]'),text=field.value.trim();
 if(!text)return;
 var post=commentForm.closest("[data-bb-social-post]"),comments=post.querySelector("[data-bb-social-comments]");
 var row=document.createElement("div");row.className="bb-social-comment";row.append(avatar("ÖK"));
 var wrapper=document.createElement("div"),name=document.createElement("strong"),p=document.createElement("p");name.textContent="Murat Erkan";p.textContent=text;wrapper.append(name,p);row.append(wrapper);comments.append(row);
 var count=post.querySelector("[data-bb-social-comment-count]");count.textContent=comments.children.length+" yorum";
 commentForm.reset();field.focus();
});
form.addEventListener("submit",function(event){
 event.preventDefault();if(!form.reportValidity())return;
 var text=textarea.value.trim();if(!text)return;
 var post=createPost(text);list.prepend(post);form.reset();filter="all";refresh();post.scrollIntoView({block:"nearest",behavior:"auto"});
});
var pageTitle=document.querySelector(".bb-page-title");if(pageTitle)pageTitle.textContent="Sosyal / Akış";
var crumbs=document.querySelector(".bb-breadcrumb .breadcrumb");if(crumbs){crumbs.replaceChildren();["PAGES","Sosyal","Akış"].forEach(function(value,i){var li=document.createElement("li");li.className="breadcrumb-item"+(i===2?" active":"");li.textContent=value;if(i===2)li.setAttribute("aria-current","page");crumbs.append(li);});}
refresh();
})();