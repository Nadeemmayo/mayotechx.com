/* MayoTechX — site script */
(function(){
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function wa(t){return 'https://wa.me/'+SITE.whatsapp+(t?'?text='+encodeURIComponent(t):'')}
  window.MX={wa:wa};

  /* ---------- header, menu, fab ---------- */
  function chrome(){
    var hdr=$('.site-header'), top=$('#toTop'), mm=$('#mobileMenu'), bg=$('#burger');
    if(bg) bg.addEventListener('click',function(){var o=mm.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.innerHTML=o?'<i class="fas fa-xmark"></i>':'<i class="fas fa-bars"></i>';document.body.style.overflow=o?'hidden':''});
    window.addEventListener('scroll',function(){ if(top) top.classList.toggle('show',scrollY>600); });
    if(top) top.addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'})});
    var fab=$('#fab'), fb=$('#fabBtn');
    if(fb){ fb.addEventListener('click',function(){var o=fab.classList.toggle('open');fb.setAttribute('aria-expanded',o);fb.innerHTML=o?'<i class="fas fa-xmark"></i>':'<i class="fab fa-whatsapp"></i>'}); }
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ if(fab&&fab.classList.contains('open')) fb.click(); var f=$('.filters'); if(f) f.classList.remove('open'); }});
    var y=$('#year'); if(y) y.textContent=new Date().getFullYear();
  }
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08}):null;
  function reveal(){$$('.reveal:not(.in)').forEach(function(el){io?io.observe(el):el.classList.add('in')})}

  /* ---------- forms → WhatsApp ---------- */
  function forms(){
    $$('form[data-wa]').forEach(function(f){
      f.addEventListener('submit',function(e){
        e.preventDefault(); if(!f.reportValidity()) return;
        var l=['*'+f.getAttribute('data-wa')+'* — mayotechx.com',''];
        $$('input,select,textarea',f).forEach(function(el){ if(!el.name||!el.value) return; if((el.type==='checkbox'||el.type==='radio')&&!el.checked) return; l.push('• '+el.name+': '+el.value); });
        window.open(wa(l.join('\n')),'_blank');
      });
    });
  }

  /* ---------- helpers ---------- */
  function fmtTraffic(s){return s||'—'}
  function orderLink(o){return wa('Hi MayoTechX, I want to order a guest post on '+o.site+' (DR '+o.dr+', '+o.niche+'). Please share the price and turnaround.')}
  function row(o){
    return '<tr><td><div class="site-cell"><span class="fav">'+esc(o.site.charAt(0))+'</span><div><b>'+esc(o.site)+'</b><small>'+esc(o.lang)+' · '+esc(o.country)+'</small></div></div></td>'+
      '<td><span class="tag">'+esc(o.niche)+'</span></td>'+
      '<td><span class="metric-pill'+(o.dr>=80?' hi':'')+'">'+o.dr+'</span></td>'+
      '<td><span class="metric-pill'+(o.da>=80?' hi':'')+'">'+o.da+'</span></td>'+
      '<td>'+esc(fmtTraffic(o.traffic))+'</td>'+
      '<td>'+esc(o.price)+'</td>'+
      '<td><a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="'+orderLink(o)+'"><i class="fab fa-whatsapp"></i> Order</a></td></tr>';
  }
  function uniq(a){return a.filter(function(v,i,s){return v&&s.indexOf(v)===i}).sort()}
  function fill(sel,vals,label){ if(!sel) return; sel.innerHTML='<option value="">'+label+'</option>'+vals.map(function(v){return '<option>'+esc(v)+'</option>'}).join(''); }

  /* ---------- marketplace ---------- */
  function market(){
    var body=$('#invBody'); if(!body) return;
    var f=$('#invFilters'), sortKey='dr', dir=-1;
    fill(f.niche,uniq(INVENTORY.map(function(o){return o.niche})),'All niches');
    fill(f.country,uniq(INVENTORY.map(function(o){return o.country})),'All countries');
    fill(f.lang,uniq(INVENTORY.map(function(o){return o.lang})),'All languages');
    var qs=new URLSearchParams(location.search); if(qs.get('q')) f.q.value=qs.get('q');
    function apply(){
      var q=(f.q.value||'').toLowerCase(), drMin=+f.drmin.value||0, daMin=+f.damin.value||0, tMin=+f.tmin.value||0;
      var list=INVENTORY.filter(function(o){
        if(q && (o.site+' '+o.niche+' '+o.country+' '+o.lang).toLowerCase().indexOf(q)<0) return false;
        if(f.niche.value && o.niche!==f.niche.value) return false;
        if(f.country.value && o.country!==f.country.value) return false;
        if(f.lang.value && o.lang!==f.lang.value) return false;
        if(o.dr<drMin||o.da<daMin||o.tv<tMin) return false; return true;
      });
      list.sort(function(a,b){ var x=sortKey==='site'?a.site.localeCompare(b.site):(a[sortKey]-b[sortKey]); return sortKey==='site'?x*-dir:x*dir; });
      $('#invCount').innerHTML='<b>'+list.length+'</b> of '+INVENTORY.length+' listed sites';
      body.innerHTML=list.length?list.map(row).join(''):'<tr><td colspan="7"><div class="empty"><i class="fas fa-magnifying-glass"></i><p>No listed site matches. Message us — we have many more sites on request.</p></div></td></tr>';
    }
    f.addEventListener('input',apply); f.addEventListener('change',apply);
    f.addEventListener('submit',function(e){e.preventDefault();apply();$('.filters').classList.remove('open')});
    $('#resetInv').addEventListener('click',function(){f.reset();apply()});
    $$('table.inv th[data-sort]').forEach(function(th){th.addEventListener('click',function(){var k=th.getAttribute('data-sort'); if(sortKey===k) dir=-dir; else {sortKey=k;dir=-1} apply();})});
    var sb=$('#invSort'); if(sb) sb.addEventListener('change',function(){var p=sb.value.split(':');sortKey=p[0];dir=+p[1];apply()});
    var ft=$('.filter-toggle'); if(ft) ft.addEventListener('click',function(){$('.filters').classList.add('open')});
    apply();
  }

  /* ---------- Smart Site Finder (scores listed sites against the brief) ---------- */
  var SYN={tech:['tech','technology','software','saas','it','ai','app'],news:['news','media','magazine','press','journal'],business:['business','finance','startup','marketing'],health:['health','medical','fitness'],travel:['travel','tourism'],sports:['sports','sport','football','cricket'],gaming:['gaming','games','casino','igaming']};
  function score(o,brief){
    var s=0, n=(o.niche||'').toLowerCase(), words=(brief.topic||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    if(words.length){ var hit=words.some(function(w){ if(n.indexOf(w)>=0) return true; for(var k in SYN){ if(SYN[k].indexOf(w)>=0 && (n.indexOf(k)>=0 || SYN[k].indexOf(n)>=0)) return true; } return false; }); s+= hit?40:8; } else s+=25;
    var dr=brief.dr||0; s+= o.dr>=dr ? 25 - Math.min(10,(o.dr-dr)/5) : Math.max(0,25-(dr-o.dr)*2);
    if(brief.country){ s+= o.country.toLowerCase()===brief.country.toLowerCase()?20:(o.country==='Global'?12:4) } else s+=15;
    if(brief.lang){ s+= o.lang.toLowerCase()===brief.lang.toLowerCase()?15:0 } else s+=10;
    s+= Math.min(10, Math.log10(Math.max(1,o.tv))*1.2);
    return Math.max(1,Math.min(99,Math.round(s)));
  }
  function finder(){
    var form=$('#finderForm'), out=$('#finderOut'); if(!form) return;
    fill(form.country,uniq(INVENTORY.map(function(o){return o.country})),'Any country');
    fill(form.lang,uniq(INVENTORY.map(function(o){return o.lang})),'Any language');
    function run(){
      var b={topic:form.topic.value,dr:+form.dr.value||0,country:form.country.value,lang:form.lang.value};
      var list=INVENTORY.map(function(o){return {o:o,s:score(o,b)}}).sort(function(a,c){return c.s-a.s}).slice(0,6);
      out.innerHTML='<p class="muted" style="margin-bottom:14px;font-size:.9rem">Top matches from our listed sites for <b style="color:var(--text)">'+esc(b.topic||'any topic')+'</b>'+(b.dr?' · DR '+b.dr+'+':'')+'</p>'+list.map(function(m){return '<div class="match"><span class="fav">'+esc(m.o.site.charAt(0))+'</span><div class="info"><b>'+esc(m.o.site)+'</b><small>'+esc(m.o.niche)+' · DR '+m.o.dr+' · '+esc(m.o.country)+' · '+esc(m.o.traffic)+' traffic</small><div class="bar"><span style="width:'+m.s+'%"></span></div></div><span class="pct">'+m.s+'%</span><a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="'+orderLink(m.o)+'">Order</a></div>'}).join('')+
        '<a class="btn btn-wa" style="margin-top:8px" target="_blank" rel="noopener" href="'+wa('Hi MayoTechX, please send me a custom site list. Topic: '+(b.topic||'-')+', DR '+(b.dr||'any')+'+, country: '+(b.country||'any')+', language: '+(b.lang||'any')+'.')+'"><i class="fab fa-whatsapp"></i> Get a full custom list</a>';
    }
    form.addEventListener('submit',function(e){e.preventDefault();run()});
    form.addEventListener('change',run);
    run();
  }
  function heroConsole(){
    var box=$('#consoleRows'), inp=$('#consoleQ'); if(!box) return;
    function draw(){
      var t=(inp&&inp.value)||'news';
      var list=INVENTORY.map(function(o){return {o:o,s:score(o,{topic:t,dr:70})}}).sort(function(a,b){return b.s-a.s}).slice(0,4);
      box.innerHTML=list.map(function(m){return '<div class="c-row"><b>'+esc(m.o.site)+'</b><span class="score">'+m.o.dr+'</span><span>'+esc(m.o.traffic)+'</span><span class="tag gold">'+m.s+'% match</span></div>'}).join('');
    }
    if(inp){ inp.addEventListener('input',draw); $('#consoleGo').addEventListener('click',function(){location.href='smart-finder.html?topic='+encodeURIComponent(inp.value)}); }
    draw();
  }

  /* ---------- tools ---------- */
  function tools(){
    var a=$('#anchorForm');
    if(a){ function runA(){
      var n=+a.links.value||10, brand=a.brand.value||'YourBrand', kw=a.kw.value||'main keyword', url=a.url.value||'yourdomain.com';
      var mix=[['Branded',.4,brand],['Naked URL',.2,url],['Generic',.15,'click here / learn more'],['Partial match',.15,'best '+kw+' guide'],['Exact match',.1,kw]];
      var left=n, rows=mix.map(function(m,i){var c=i===mix.length-1?left:Math.round(n*m[1]); left-=c; return '<tr><td>'+m[0]+'</td><td>'+Math.round(m[1]*100)+'%</td><td><b>'+c+'</b></td><td class="muted">'+esc(m[2])+'</td></tr>'}).join('');
      $('#anchorOut').innerHTML='<div class="table-wrap"><table class="inv" style="min-width:0"><thead><tr><th>Anchor type</th><th>Share</th><th>Links</th><th>Example</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
    } a.addEventListener('input',runA); runA(); }
    var b=$('#budgetForm');
    if(b){ function runB(){
      var budget=+b.budget.value||1000, avg=+b.avg.value||150, months=+b.months.value||3;
      var per=Math.max(0,Math.floor(budget/avg)); $('#budgetOut').innerHTML='<div class="stats" style="grid-template-columns:repeat(3,1fr)"><div class="stat"><b>'+per+'</b><span>links per month</span></div><div class="stat"><b>'+(per*months)+'</b><span>links in '+months+' months</span></div><div class="stat"><b>$'+(budget*months).toLocaleString()+'</b><span>total budget</span></div></div><a class="btn btn-wa" style="margin-top:16px" target="_blank" rel="noopener" href="'+wa('Hi MayoTechX, my link budget is $'+budget+'/month for '+months+' months. Please suggest a plan.')+'"><i class="fab fa-whatsapp"></i> Get a plan for this budget</a>';
    } b.addEventListener('input',runB); runB(); }
  }

  /* ---------- v2 extras: rotator, clocks, card glow ---------- */
  function extras(){
    var r=$('#rotator'); if(r){ var w=JSON.parse(r.getAttribute('data-words')),i=0; setInterval(function(){ r.classList.add('out'); setTimeout(function(){ i=(i+1)%w.length; r.textContent=w[i]; r.classList.remove('out'); },350); },2600); }
    var zs=$$('[data-tz]'); function tick(){ zs.forEach(function(z){ try{ z.textContent=new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:z.getAttribute('data-tz')}); }catch(e){} }); }
    if(zs.length){ tick(); setInterval(tick,30000); }
    $$('.card').forEach(function(c){ c.addEventListener('mousemove',function(e){ var b=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-b.left)+'px'); c.style.setProperty('--my',(e.clientY-b.top)+'px'); }); });
  }

  /* ---------- real orders ticker ---------- */
  function orders(){
    var el=$('#orders'); if(!el||!ORDERS||!ORDERS.length) return;
    var items=ORDERS.map(function(o){return '<span><i class="fas fa-circle-check"></i><b>'+esc(o.who)+'</b> ordered '+esc(o.what)+(o.where?' on '+esc(o.where):'')+' · '+esc(o.when||'')+'</span>'}).join('');
    el.innerHTML='<div class="orders-track">'+items+items+'</div>'; el.classList.add('on');
  }

  document.addEventListener('DOMContentLoaded',function(){
    chrome(); forms(); market(); heroConsole(); tools(); orders(); extras();
    var t=$('#finderForm'); if(t){ var q=new URLSearchParams(location.search).get('topic'); if(q) t.topic.value=q; } finder();
    reveal();
  });
})();
