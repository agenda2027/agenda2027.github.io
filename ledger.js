(function(){
var rows=[].slice.call(document.querySelectorAll('.lg-row')),st='all',ser='all',q='';
var count=document.querySelector('.lg-count'),empty=document.querySelector('.lg .empty');
function apply(){var n=0;rows.forEach(function(r){var ok=(st==='all'||r.dataset.st===st)&&(ser==='all'||r.dataset.series===ser)&&(!q||r.dataset.text.indexOf(q)>-1);r.hidden=!ok;if(ok)n++});
count.textContent=n+' of '+rows.length+' claims';empty.hidden=n>0}
function group(attr,set){[].forEach.call(document.querySelectorAll('.chip['+attr+']'),function(c){c.addEventListener('click',function(){set(c.getAttribute(attr));[].forEach.call(document.querySelectorAll('.chip['+attr+']'),function(o){o.setAttribute('aria-pressed',String(o===c))});apply()})})}
group('data-st',function(v){st=v});group('data-ser',function(v){ser=v});
var inp=document.querySelector('.lg-search input');inp.addEventListener('input',function(){q=inp.value.trim().toLowerCase();apply()});
var h=location.hash.slice(1);if(h){var b=document.querySelector('.chip[data-st="'+h+'"]');if(b)b.click()}
apply()})();