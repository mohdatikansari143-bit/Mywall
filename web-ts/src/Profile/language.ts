export {};

var LANGS = [
  {code:"en", name:"English",    native:"English",          country:"gb"},
  {code:"hi", name:"Hindi",      native:"हिन्दी",             country:"in"},
  {code:"ur", name:"Urdu",       native:"اردو",              country:"pk"},
  {code:"bn", name:"Bengali",    native:"বাংলা",             country:"bd"},
  {code:"te", name:"Telugu",     native:"తెలుగు",            country:"in"},
  {code:"ta", name:"Tamil",      native:"தமிழ்",             country:"in"},
  {code:"mr", name:"Marathi",    native:"मराठी",             country:"in"},
  {code:"gu", name:"Gujarati",   native:"ગુજરાતી",           country:"in"},
  {code:"pa", name:"Punjabi",    native:"ਪੰਜਾਬੀ",            country:"in"},
  {code:"ar", name:"Arabic",     native:"العربية",           country:"sa"},
  {code:"es", name:"Spanish",    native:"Español",           country:"es"},
  {code:"fr", name:"French",     native:"Français",          country:"fr"},
  {code:"de", name:"German",     native:"Deutsch",           country:"de"},
  {code:"pt", name:"Portuguese", native:"Português",         country:"br"},
  {code:"ru", name:"Russian",    native:"Русский",           country:"ru"},
  {code:"zh", name:"Chinese",    native:"中文",               country:"cn"},
  {code:"ja", name:"Japanese",   native:"日本語",             country:"jp"},
  {code:"ko", name:"Korean",     native:"한국어",             country:"kr"},
  {code:"tr", name:"Turkish",    native:"Türkçe",            country:"tr"},
  {code:"id", name:"Indonesian", native:"Bahasa Indonesia",  country:"id"},
  {code:"it", name:"Italian",    native:"Italiano",          country:"it"}
];

var selected = "en";

var list = document.getElementById("list")!;
var saveBtn = document.getElementById("save")!;
var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

function updateSaveBtn(){
  if (selected !== "en") {
    saveBtn.classList.add("visible");
  } else {
    saveBtn.classList.remove("visible");
  }
}

function render(){
  list.innerHTML = "";
  LANGS.forEach(function(l){
    var b = document.createElement("button");
    b.type = "button";
    b.className = "item" + (l.code === selected ? " on" : "");
    b.innerHTML =
      '<span class="flag"><img src="https://hatscripts.github.io/circle-flags/flags/' + l.country + '.svg" alt="' + l.name + '"></span>' +
      '<span class="name"><b>' + l.name + '</b><small>' + l.native + '</small></span>' +
      '<span class="chk">' + TICK + '</span>';
    b.onclick = function(){ 
      selected = l.code; 
      render(); 
    };
    list.appendChild(b);
  });
  updateSaveBtn();
}
render();

saveBtn.onclick = function(){
  try { 
    localStorage.setItem("lang", selected);
    localStorage.setItem("trex_lang", selected);

    document.cookie = "googtrans=/en/" + selected + "; path=/;";
    if (location.hostname) {
      document.cookie = "googtrans=/en/" + selected + "; path=/; domain=" + location.hostname + ";";
    }
  } catch(e) {}

  var combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (combo) {
    combo.value = selected;
    combo.dispatchEvent(new Event("change"));
  }

  var t = document.getElementById("toast")!;
  t.innerText = "Language Applied Everywhere!";
  t.classList.add("show");

  setTimeout(function(){
    t.classList.remove("show");
    if (history.length > 1) {
      history.back();
    } else {
      location.href = "setting.html";
    }
  }, 800);
};

Object.assign(window, { updateSaveBtn, render });
