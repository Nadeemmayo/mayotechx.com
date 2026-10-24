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
    var hdr=$('#siteHeader'); window.addEventListener('scroll',function(){ if(top) top.classList.toggle('show',scrollY>600); if(hdr) hdr.classList.toggle('scrolled',scrollY>10); },{passive:true});
    if(top) top.addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'})});
    var fab=$('#fab'), fb=$('#fabBtn');
    if(fb){ fb.addEventListener('click',function(){var o=fab.classList.toggle('open');fb.setAttribute('aria-expanded',o);fb.innerHTML=o?'<i class="fas fa-xmark"></i>':'<i class="fab fa-whatsapp"></i>'}); }
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ if(fab&&fab.classList.contains('open')) fb.click(); var f=$('.filters'); if(f) f.classList.remove('open'); }});
    var y=$('#year'); if(y) y.textContent=new Date().getFullYear();
  }
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08}):null;
  function reveal(){$$('.reveal:not(.in)').forEach(function(el){io?io.observe(el):el.classList.add('in')})}

  /* ---------- forms → WhatsApp or email (static hosting: no server storage) ---------- */
  function forms(){
    $$('form[data-wa]').forEach(function(f){
      var via='wa';
      $$('[data-via]',f).forEach(function(b){ b.addEventListener('click',function(){ via=b.getAttribute('data-via'); }); });
      f.setAttribute('novalidate','');
      f.addEventListener('submit',function(e){
        e.preventDefault();
        var hp=f.querySelector('.hp'); if(hp&&hp.value) return;
        var err=f.querySelector('.form-err');
        if(!f.checkValidity()){ var bad=f.querySelector(':invalid'); if(err){ err.hidden=false; err.textContent=(bad&&bad.type==='checkbox')?'Please accept the privacy notice to continue.':'Please complete the required fields (marked *).'; } if(bad) bad.focus(); return; }
        if(err) err.hidden=true;
        var title=f.getAttribute('data-wa'), l=[title+' — mayotechx.com',''];
        $$('input,select,textarea',f).forEach(function(el){ if(!el.name||!el.value||el.classList.contains('hp')||el.name==='consent') return; if((el.type==='checkbox'||el.type==='radio')&&!el.checked) return; l.push(el.name+': '+el.value); });
        var msg=l.join('\n');
        try{ if(window.dataLayer) dataLayer.push({event:'form_submission',form:title,via:via}); }catch(x){}
        if(via==='mail') location.href='mailto:'+SITE.email+'?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(msg);
        else window.open(wa(msg),'_blank','noopener');
        var ok=f.querySelector('.form-ok'); if(!ok){ ok=document.createElement('p'); ok.className='form-ok full'; ok.setAttribute('role','status'); (f.querySelector('.form-grid')||f).appendChild(ok); }
        ok.innerHTML='<i class="fas fa-circle-check"></i> Your message is ready in '+(via==='mail'?'your email app':'WhatsApp')+'. Press send there to deliver it.';
      });
    });
    var ft=document.querySelector('form[data-funnel]'); if(ft){ var q=new URLSearchParams(location.search).get('type'); var s=ft.querySelector('[name="Request type"]'); if(q&&s){ $$('option',s).forEach(function(o){ if(o.getAttribute('data-k')===q) s.value=o.value; }); } }
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


  /* ---------- blog search + categories ---------- */
  function blogFilter(){
    var g=$('#blogGrid'); if(!g) return; var q=$('#bq'), cat='', cards=$$('.post-card',g), empty=$('#blogEmpty');
    function run(){ var s=(q.value||'').toLowerCase().trim(), n=0; cards.forEach(function(c){ var ok=(!cat||c.getAttribute('data-cat')===cat)&&(!s||c.getAttribute('data-k').indexOf(s)>=0); c.hidden=!ok; if(ok){n++;c.classList.add('in');} }); if(empty) empty.hidden=!!n; }
    q.addEventListener('input',run);
    $$('.cat-btn').forEach(function(b){ b.addEventListener('click',function(){ $$('.cat-btn').forEach(function(x){x.classList.remove('on')}); b.classList.add('on'); cat=b.getAttribute('data-cat'); run(); }); });
  }
  /* ---------- desktop dropdowns: keyboard + aria ---------- */
  function dropdowns(){
    $$('.menu .dd').forEach(function(d){ var b=d.querySelector('button'); if(!b) return;
      d.addEventListener('mouseenter',function(){b.setAttribute('aria-expanded','true')}); d.addEventListener('mouseleave',function(){b.setAttribute('aria-expanded','false')});
      d.addEventListener('focusin',function(){b.setAttribute('aria-expanded','true')}); d.addEventListener('focusout',function(e){ if(!d.contains(e.relatedTarget)) b.setAttribute('aria-expanded','false'); });
      b.addEventListener('keydown',function(e){ if(e.key==='Escape'){ b.blur(); } });
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    chrome(); forms(); tools(); orders(); extras(); blogFilter(); dropdowns();
    reveal();
  });
})();
