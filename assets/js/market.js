/* =========================================================
   MayoTechX — Marketplace engine (v8)
   • Publisher Marketplace   (#mkApp)      ← data/publishers.csv
   • Directory Marketplace   (#dirApp)     ← data/directories.csv
   • Smart Site Finder 2.0   (#finderApp)
   • Home preview            (#mkPreview)
   • Shortlist + quote request → WhatsApp or email (no automatic payment)
   Data is PUBLIC fields only. Never put supplier contacts, costs or margins
   in these CSV files — the repository and the site are public.
   ========================================================= */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var BASE=(document.documentElement.getAttribute('data-base')||'');
  var S=window.SITE||{whatsapp:'923074646927',email:'nadeemonlin@gmail.com'};
  function wa(t){return 'https://wa.me/'+S.whatsapp+'?text='+encodeURIComponent(t)}
  function mail(sub,body){return 'mailto:'+S.email+'?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(body)}
  function store(k,v){try{ if(v===undefined) return JSON.parse(localStorage.getItem(k)||'[]'); localStorage.setItem(k,JSON.stringify(v)); }catch(e){ return v===undefined?[]:null; }}
  function track(name,data){ try{ if(window.gtag) window.gtag('event',name,data||{}); if(window.dataLayer) window.dataLayer.push(Object.assign({event:name},data||{})); }catch(e){} }

  /* ---------- CSV ---------- */
  function parseCSV(txt){
    var rows=[],row=[],f='',q=false;
    for(var i=0;i<txt.length;i++){ var c=txt[i];
      if(q){ if(c==='"'){ if(txt[i+1]==='"'){f+='"';i++;} else q=false; } else f+=c; }
      else if(c==='"') q=true; else if(c===','){row.push(f);f='';} else if(c==='\n'){row.push(f);rows.push(row);row=[];f='';} else if(c!=='\r') f+=c; }
    if(f!==''||row.length){row.push(f);rows.push(row);}
    var h=rows.shift()||[]; h=h.map(function(x){return x.trim()});
    return rows.filter(function(r){return r.join('').trim()}).map(function(r){var o={};h.forEach(function(k,j){o[k]=(r[j]||'').trim()});return o;});
  }
  var cache={};
  function load(name,cfgUrl){
    if(cache[name]) return cache[name];
    var url=(cfgUrl&&S[cfgUrl])||(BASE+'data/'+name+'.csv?v='+(window.MX_VER||'1'));
    cache[name]=fetch(url,{cache:'no-cache'}).then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); }).then(parseCSV);
    return cache[name];
  }
  function num(v){ var n=parseFloat(String(v||'').replace(/[^\d.]/g,'')); return isNaN(n)?null:n; }
  function yes(v){ return /^(y|yes|true|1|available)$/i.test(String(v||'').trim()); }
  function fmtN(n){ if(n==null) return '—'; if(n>=1e6) return (n/1e6).toFixed(n>=1e7?0:1).replace(/\.0$/,'')+'M'; if(n>=1e3) return Math.round(n/1e3)+'K'; return String(n); }
  function money(p,cur){ if(p==null) return null; var s={USD:'$',EUR:'€',GBP:'£',AED:'AED ',SAR:'SAR '}[cur||'USD']||((cur||'')+' '); return s+p.toLocaleString('en-US'); }
  function pub(o){ o.da=num(o.da); o.pa=num(o.pa); o.dr=num(o.dr); o.tv=num(o.traffic); o.pr=num(o.price); o.gp=yes(o.guest_post); o.ne=yes(o.niche_edit); o.dp=yes(o.digital_pr); o.upd=o.last_verified||o.metric_checked||''; return o; }
  function active(o){ return !o.status || /active/i.test(o.status); }
  function uniq(a){ var m={}; a.forEach(function(v){ String(v||'').split(/\s*[;|]\s*/).forEach(function(x){ if(x) m[x]=1; }); }); return Object.keys(m).sort(); }
  function opts(sel,vals,label){ if(!sel) return; var cur=sel.value; sel.innerHTML='<option value="">'+esc(label)+'</option>'+vals.map(function(v){return '<option'+(v===cur?' selected':'')+'>'+esc(v)+'</option>'}).join(''); }
  function fav(d){ return '<span class="fav" aria-hidden="true">'+esc((d||'?').replace(/^www\./,'').charAt(0).toUpperCase())+'</span>'; }
  function chip(on,label){ return '<span class="av-chip'+(on?' on':'')+'" title="'+(on?'Available':'Ask for availability')+'">'+(on?'<i class="fas fa-check"></i>':'<i class="fas fa-question"></i>')+label+'</span>'; }
  function loading(el,cols){ el.innerHTML=cols?'<tr><td colspan="'+cols+'"><div class="mk-state"><span class="spin"></span>Loading inventory…</div></td></tr>':'<div class="mk-state"><span class="spin"></span>Loading inventory…</div>'; }
  function failed(el,cols,what){ var h='<div class="mk-state err"><i class="fas fa-triangle-exclamation"></i><p>We could not load the '+what+' right now. Please refresh, or <a href="'+wa('Hello MayoTechX, please send me your current '+what+'.')+'" target="_blank" rel="noopener">ask on WhatsApp</a>.</p></div>'; el.innerHTML=cols?'<tr><td colspan="'+cols+'">'+h+'</td></tr>':h; }

  /* ---------- modal ---------- */
  var lastFocus=null;
  function modal(html,cls){
    close(); lastFocus=document.activeElement;
    var m=document.createElement('div'); m.className='mk-modal'; m.id='mkModal';
    m.innerHTML='<div class="mk-dialog '+(cls||'')+'" role="dialog" aria-modal="true" tabindex="-1"><button type="button" class="mk-x" aria-label="Close"><i class="fas fa-xmark"></i></button>'+html+'</div>';
    document.body.appendChild(m); document.body.classList.add('mk-lock');
    m.addEventListener('click',function(e){ if(e.target===m||e.target.closest('.mk-x')) close(); });
    var d=$('.mk-dialog',m); setTimeout(function(){ var f=$('input,select,textarea,button:not(.mk-x)',d)||d; f.focus(); },30);
    return d;
  }
  function close(){ var m=$('#mkModal'); if(m){ m.remove(); document.body.classList.remove('mk-lock'); if(lastFocus&&lastFocus.focus) lastFocus.focus(); } }
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); if(e.key==='Tab'){ var d=$('#mkModal .mk-dialog'); if(!d) return; var f=$$('a[href],button,input,select,textarea',d).filter(function(x){return !x.disabled&&x.offsetParent!==null}); if(!f.length) return; if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus();} else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus();} } });

  /* ---------- shortlist (per kind) ---------- */
  var KIND={pub:{key:'mx_shortlist',label:'Publisher shortlist',noun:'websites'},dir:{key:'mx_dirlist',label:'Directory shortlist',noun:'directories'}};
  var DATA={pub:[],dir:[]};
  function list(k){ return store(KIND[k].key)||[]; }
  function setList(k,a){ store(KIND[k].key,a); renderBar(); $$('[data-sl="'+k+'"]').forEach(function(b){ var on=a.indexOf(b.getAttribute('data-id'))>=0; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); b.innerHTML=on?'<i class="fas fa-check"></i> Shortlisted':'<i class="fas fa-plus"></i> Shortlist'; }); }
  function toggle(k,id){ var a=list(k), i=a.indexOf(id); if(i>=0) a.splice(i,1); else { a.push(id); track('publisher_shortlist',{kind:k,id:id}); } setList(k,a); }
  function slBtn(k,id){ var on=list(k).indexOf(id)>=0; return '<button type="button" class="btn btn-ghost btn-sm sl-btn'+(on?' on':'')+'" data-sl="'+k+'" data-id="'+esc(id)+'" aria-pressed="'+on+'">'+(on?'<i class="fas fa-check"></i> Shortlisted':'<i class="fas fa-plus"></i> Shortlist')+'</button>'; }
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-sl]'); if(b){ e.preventDefault(); toggle(b.getAttribute('data-sl'),b.getAttribute('data-id')); } });
  function renderBar(){
    var bar=$('#slBar'); if(!bar){ bar=document.createElement('div'); bar.id='slBar'; bar.className='sl-bar'; document.body.appendChild(bar); }
    var h=''; ['pub','dir'].forEach(function(k){ var n=list(k).length; if(n) h+='<button type="button" data-open="'+k+'"><i class="fas '+(k==='pub'?'fa-layer-group':'fa-address-book')+'"></i>'+esc(KIND[k].label)+' <b>'+n+'</b></button>'; });
    bar.innerHTML=h; bar.classList.toggle('on',!!h);
    $$('[data-open]',bar).forEach(function(b){ b.addEventListener('click',function(){ quote(b.getAttribute('data-open')); }); });
  }

  /* ---------- quote request ---------- */
  var TYPES={pub:['Guest Post','Niche Edit','Digital PR','Not sure — advise me'],dir:['Manual listing submission','Citation building','NAP consistency audit','Citation cleanup']};
  function quote(k,preType){
    var ids=list(k), items=DATA[k].filter(function(o){return ids.indexOf(o.id)>=0});
    var priced=items.filter(function(o){return k==='pub'?o.pr!=null:num(o.client_price)!=null}), total=priced.reduce(function(s,o){return s+(k==='pub'?o.pr:num(o.client_price))},0), unknown=items.length-priced.length;
    var rows=items.map(function(o){ return k==='pub'
      ? '<tr><td><b>'+esc(o.domain)+'</b><small>'+esc(o.niche)+' · '+esc(o.country)+'</small></td><td>'+(o.dr==null?'—':o.dr)+'</td><td>'+(o.da==null?'—':o.da)+'</td><td>'+fmtN(o.tv)+'</td><td>'+(money(o.pr,o.currency)||'<span class="muted">Request price</span>')+'</td><td><button type="button" class="link-x" data-rm="'+esc(o.id)+'" aria-label="Remove '+esc(o.domain)+'"><i class="fas fa-xmark"></i></button></td></tr>'
      : '<tr><td><b>'+esc(o.name)+'</b><small>'+esc(o.website)+'</small></td><td>'+esc(o.country)+'</td><td>'+esc(o.listing_type||'—')+'</td><td>'+(money(num(o.client_price),o.currency)||'<span class="muted">Request price</span>')+'</td><td><button type="button" class="link-x" data-rm="'+esc(o.id)+'" aria-label="Remove '+esc(o.name)+'"><i class="fas fa-xmark"></i></button></td></tr>'; }).join('');
    var head=k==='pub'?'<tr><th>Website</th><th>DR</th><th>DA</th><th>Traffic</th><th>Price</th><th></th></tr>':'<tr><th>Directory</th><th>Country</th><th>Listing</th><th>Price</th><th></th></tr>';
    var est=items.length?('<p class="q-total"><span>Indicative total</span><b>'+(priced.length?money(total,'USD'):'—')+'</b>'+(unknown?'<small>+ '+unknown+' item'+(unknown>1?'s':'')+' priced on request</small>':'')+'</p>'):'';
    var d=modal('<h2>Request a quotation</h2><p class="muted">'+(items.length?'Review your selected '+KIND[k].noun+', then send the request on WhatsApp or by email. Nothing is charged automatically.':'Your shortlist is empty. You can still send a request and we will suggest suitable '+KIND[k].noun+'.')+'</p>'+
      (items.length?'<div class="table-wrap q-table"><table class="inv"><thead>'+head+'</thead><tbody>'+rows+'</tbody></table></div>'+est:'')+
      '<form class="form-grid q-form" novalidate>'+
        '<div class="field"><label for="q1">Your name *</label><input id="q1" name="Name" required autocomplete="name"></div>'+
        '<div class="field"><label for="q2">Company</label><input id="q2" name="Company" autocomplete="organization"></div>'+
        '<div class="field"><label for="q3">Email *</label><input id="q3" name="Email" type="email" required autocomplete="email" dir="ltr"></div>'+
        '<div class="field"><label for="q4">WhatsApp</label><input id="q4" name="WhatsApp" type="tel" autocomplete="tel" dir="ltr" placeholder="+1 555 000 0000"></div>'+
        '<div class="field"><label for="q5">'+(k==='pub'?'Target URL':'Business website')+'</label><input id="q5" name="Target URL" type="url" dir="ltr" placeholder="https://"></div>'+
        '<div class="field"><label for="q6">'+(k==='pub'?'Placement type':'Service')+'</label><select id="q6" name="Service">'+TYPES[k].map(function(t){return '<option'+(t===preType?' selected':'')+'>'+t+'</option>'}).join('')+'</select></div>'+
        (k==='pub'?'<div class="field"><label for="q7">Desired topic</label><input id="q7" name="Desired topic"></div><div class="field"><label for="q8">Preferred niche</label><input id="q8" name="Preferred niche"></div><div class="field"><label for="q9">Preferred country</label><input id="q9" name="Preferred country"></div><div class="field"><label for="q10">Preferred language</label><input id="q10" name="Preferred language"></div>'
                  :'<div class="field"><label for="q7">Business category</label><input id="q7" name="Business category"></div><div class="field"><label for="q8">Target country / city</label><input id="q8" name="Target location"></div>')+
        '<div class="field full"><label for="q11">Additional instructions</label><textarea id="q11" name="Additional instructions"></textarea></div>'+
        '<input type="text" name="company_website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">'+
        '<div class="full q-steps"><b>What happens next</b><ol><li>We confirm availability and editorial requirements with each '+(k==='pub'?'publisher':'directory')+'.</li><li>You receive a final quotation and timeline.</li><li>Work starts only after you approve it.</li></ol></div>'+
        '<label class="full consent"><input type="checkbox" name="consent" required> I agree that MayoTechX may use these details to reply to my request, as described in the <a href="'+BASE+'privacy-policy.html" target="_blank">Privacy Policy</a>.</label>'+
        '<p class="full form-err" role="alert" hidden></p>'+
        '<div class="full q-actions"><button class="btn btn-wa" type="submit" data-via="wa"><i class="fab fa-whatsapp"></i> Send on WhatsApp</button><button class="btn btn-gold" type="submit" data-via="mail"><i class="fas fa-envelope"></i> Send by email</button></div>'+
      '</form>','mk-wide');
    $$('[data-rm]',d).forEach(function(b){ b.addEventListener('click',function(){ var a=list(k); a.splice(a.indexOf(b.getAttribute('data-rm')),1); setList(k,a); quote(k,$('#q6',d).value); }); });
    var f=$('form',d), via='wa';
    $$('[data-via]',f).forEach(function(b){ b.addEventListener('click',function(){ via=b.getAttribute('data-via'); }); });
    f.addEventListener('submit',function(e){ e.preventDefault();
      var err=$('.form-err',f); if(f.company_website.value) return;
      if(!f.checkValidity()){ err.hidden=false; err.textContent=!f.consent.checked?'Please accept the privacy notice to continue.':'Please add your name and a valid email address.'; var bad=$(':invalid',f); if(bad) bad.focus(); return; }
      err.hidden=true;
      var v=function(n){var el=f.elements[n];return el?el.value.trim():''};
      var t=k==='pub'
        ? ['Hello MayoTechX,','','I would like to request a placement.','','Selected websites:',(items.length?items.map(function(o){return '- '+o.domain+(o.dr!=null?' (DR '+o.dr+')':'')}).join('\n'):'- Please suggest suitable websites'),'','Service:',v('Service'),'','Target URL:',v('Target URL')||'-','','Preferred niche:',v('Preferred niche')||'-','','Estimated total:',(priced.length?money(total,'USD')+(unknown?' + '+unknown+' on request':''):'To be quoted'),'']
        : ['Hello MayoTechX,','','I would like to request directory listings.','','Selected directories:',(items.length?items.map(function(o){return '- '+o.name+' ('+o.website+')'}).join('\n'):'- Please suggest suitable directories'),'','Service:',v('Service'),'','Business website:',v('Target URL')||'-','','Category:',v('Business category')||'-','Location:',v('Target location')||'-',''];
      t.push('Name: '+v('Name')+(v('Company')?' — '+v('Company'):''),'Email: '+v('Email')+(v('WhatsApp')?'  ·  WhatsApp: '+v('WhatsApp'):''));
      if(k==='pub'){ if(v('Desired topic')) t.push('Topic: '+v('Desired topic')); if(v('Preferred country')||v('Preferred language')) t.push('Country / language: '+(v('Preferred country')||'-')+' / '+(v('Preferred language')||'-')); }
      if(v('Additional instructions')) t.push('Notes: '+v('Additional instructions'));
      t.push('','Please confirm availability, editorial requirements and final quotation.');
      var msg=t.join('\n');
      track(via==='wa'?'whatsapp_click':'email_click',{form:'quote_'+k,items:items.length}); track('quote_request',{kind:k,items:items.length});
      if(via==='wa') window.open(wa(msg),'_blank','noopener'); else location.href=mail((k==='pub'?'Placement request':'Directory listing request')+' — '+v('Name'),msg);
      $('.q-actions',f).insertAdjacentHTML('afterend','<p class="full form-ok"><i class="fas fa-circle-check"></i> Your request is ready in '+(via==='wa'?'WhatsApp':'your email app')+'. Press send there to deliver it — we reply with confirmed availability and a final quote.</p>');
    });
  }
  window.MXQuote=quote;

  /* ---------- publisher details ---------- */
  function details(o){
    var row=function(l,v){ return v?'<div><dt>'+l+'</dt><dd>'+v+'</dd></div>':''; };
    var d=modal('<div class="pd-head">'+fav(o.domain)+'<div><h2>'+esc(o.domain)+'</h2><p class="muted">'+esc([o.niche,o.secondary_niches].filter(Boolean).join(' · '))+'</p></div></div>'+
      '<div class="pd-metrics"><div><b>'+(o.dr==null?'—':o.dr)+'</b><span>DR</span></div><div><b>'+(o.da==null?'—':o.da)+'</b><span>DA</span></div><div><b>'+(o.pa==null?'—':o.pa)+'</b><span>PA</span></div><div><b>'+fmtN(o.tv)+'</b><span>Traffic / mo</span></div></div>'+
      '<dl class="pd-list">'+row('Country',esc(o.country))+row('Language',esc(o.language))+row('Traffic country',esc(o.traffic_country))+row('Services',chip(o.gp,'Guest post')+' '+chip(o.ne,'Niche edit')+' '+chip(o.dp,'Digital PR'))+
        row('Price',money(o.pr,o.currency)||'Request price')+row('Turnaround',esc(o.turnaround)||'Confirmed with quote')+row('Link attribute',esc(o.link_attribute))+row('Sponsored policy',esc(o.sponsored_policy))+row('Editorial requirements',esc(o.requirements))+row('Notes',esc(o.notes))+
        row('Metric source',esc(o.metric_source))+row('Last verified',esc(o.upd)||'Ask us for a fresh check')+'</dl>'+
      '<p class="pd-note"><i class="fas fa-circle-info"></i> DA, PA and DR are third-party estimates (Moz, Ahrefs), not Google ranking scores. Availability and price are confirmed before any order.</p>'+
      '<div class="pd-actions">'+slBtn('pub',o.id)+'<button type="button" class="btn btn-gold btn-sm" data-req="Guest Post">Request guest post</button><button type="button" class="btn btn-ghost btn-sm" data-req="Niche Edit">Request niche edit</button>'+
      '<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="'+wa('Hello MayoTechX, I have a question about '+o.domain+'.')+'"><i class="fab fa-whatsapp"></i> Ask a question</a><a class="btn btn-ghost btn-sm" href="'+mail('Question about '+o.domain,'Hello MayoTechX,\n\nI have a question about '+o.domain+':\n\n')+'"><i class="fas fa-envelope"></i> Email</a></div>');
    $$('[data-req]',d).forEach(function(b){ b.addEventListener('click',function(){ var a=list('pub'); if(a.indexOf(o.id)<0){a.push(o.id);setList('pub',a);} quote('pub',b.getAttribute('data-req')); }); });
    track('publisher_view',{domain:o.domain});
  }

  /* ---------- publisher marketplace ---------- */
  var PER=20;
  function marketplace(){
    var app=$('#mkApp'); if(!app) return;
    var f=$('#mkFilters',app), body=$('#mkBody',app), cards=$('#mkCards',app), cnt=$('#mkCount',app), pg=$('#mkPager',app), sortSel=$('#mkSort',app), page=1, all=[];
    loading(body,8);
    load('publishers','publishersCsvUrl').then(function(rows){
      all=rows.map(pub).filter(active); DATA.pub=all; renderBar();
      opts(f.niche,uniq(all.map(function(o){return o.niche+';'+o.secondary_niches})),'All niches');
      opts(f.country,uniq(all.map(function(o){return o.country})),'All countries');
      opts(f.language,uniq(all.map(function(o){return o.language})),'All languages');
      var qs=new URLSearchParams(location.search); ['q','niche','country','language'].forEach(function(k){ if(qs.get(k)&&f[k]) f[k].value=qs.get(k); });
      var tot=$('#mkTotal'); if(tot) tot.textContent=all.length;
      apply();
    }).catch(function(){ failed(body,8,'publisher list'); cards.innerHTML=''; });
    var timer;
    function apply(){
      var q=(f.q.value||'').toLowerCase().trim(), mDA=+f.da.value||0, mPA=+f.pa.value||0, mDR=+f.dr.value||0, maxP=+f.maxp.value||0, mT=+f.tmin.value||0;
      var res=all.filter(function(o){
        if(q && (o.domain+' '+o.niche+' '+o.secondary_niches+' '+o.country+' '+o.language).toLowerCase().indexOf(q)<0) return false;
        if(f.niche.value && (o.niche+';'+o.secondary_niches).split(/\s*[;|]\s*/).indexOf(f.niche.value)<0) return false;
        if(f.country.value && o.country!==f.country.value) return false;
        if(f.language.value && o.language!==f.language.value) return false;
        if(mDA && !(o.da>=mDA)) return false; if(mPA && !(o.pa>=mPA)) return false; if(mDR && !(o.dr>=mDR)) return false;
        if(maxP && !(o.pr!=null && o.pr<=maxP)) return false; if(mT && !(o.tv>=mT)) return false;
        if(f.gp.checked && !o.gp) return false; if(f.ne.checked && !o.ne) return false; if(f.dp.checked && !o.dp) return false;
        return true; });
      var sp=sortSel.value.split(':'), k=sp[0], dir=+sp[1];
      res.sort(function(a,b){ var x=a[k], y=b[k]; if(x==null&&y==null) return 0; if(x==null) return 1; if(y==null) return -1; return (typeof x==='string'?x.localeCompare(y):x-y)*dir; });
      var pages=Math.max(1,Math.ceil(res.length/PER)); if(page>pages) page=pages;
      var view=res.slice((page-1)*PER,page*PER);
      cnt.innerHTML='<b>'+res.length+'</b> of '+all.length+' publishers';
      if(!res.length){ var e='<div class="mk-state"><i class="fas fa-magnifying-glass"></i><p>No listed publisher matches these filters. Our wider network is shared on request.</p><a class="btn btn-gold btn-sm" href="#" data-empty>Request a custom list</a></div>'; body.innerHTML='<tr><td colspan="8">'+e+'</td></tr>'; cards.innerHTML=e; $$('[data-empty]',app).forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();quote('pub');})}); }
      else {
        body.innerHTML=view.map(function(o){ return '<tr><td><button type="button" class="site-cell" data-pd="'+esc(o.id)+'">'+fav(o.domain)+'<span><b>'+esc(o.domain)+'</b><small>'+esc(o.language)+' · '+esc(o.country)+'</small></span></button></td><td><span class="tag">'+esc(o.niche)+'</span></td>'+
          '<td><span class="metric-pill'+(o.dr>=80?' hi':'')+'">'+(o.dr==null?'—':o.dr)+'</span></td><td><span class="metric-pill'+(o.da>=80?' hi':'')+'">'+(o.da==null?'—':o.da)+'</span></td><td>'+fmtN(o.tv)+'</td>'+
          '<td class="avs">'+chip(o.gp,'GP')+chip(o.ne,'NE')+chip(o.dp,'PR')+'</td><td>'+(money(o.pr,o.currency)?'<b>'+money(o.pr,o.currency)+'</b>':'<span class="muted">Request price</span>')+'</td><td class="acts">'+slBtn('pub',o.id)+'</td></tr>'; }).join('');
        cards.innerHTML=view.map(function(o){ return '<article class="mk-card"><button type="button" class="site-cell" data-pd="'+esc(o.id)+'">'+fav(o.domain)+'<span><b>'+esc(o.domain)+'</b><small>'+esc(o.niche)+' · '+esc(o.country)+' · '+esc(o.language)+'</small></span></button>'+
          '<div class="mk-m"><span><b>'+(o.dr==null?'—':o.dr)+'</b>DR</span><span><b>'+(o.da==null?'—':o.da)+'</b>DA</span><span><b>'+fmtN(o.tv)+'</b>Traffic</span><span><b>'+(money(o.pr,o.currency)||'—')+'</b>Price</span></div>'+
          '<div class="avs">'+chip(o.gp,'Guest post')+chip(o.ne,'Niche edit')+chip(o.dp,'Digital PR')+'</div><div class="mk-cact">'+slBtn('pub',o.id)+'<button type="button" class="btn btn-gold btn-sm" data-pd="'+esc(o.id)+'">Details</button></div></article>'; }).join('');
      }
      pg.innerHTML=pages>1?('<button type="button" data-p="'+(page-1)+'"'+(page===1?' disabled':'')+' aria-label="Previous page"><i class="fas fa-chevron-left"></i></button><span>Page '+page+' of '+pages+'</span><button type="button" data-p="'+(page+1)+'"'+(page===pages?' disabled':'')+' aria-label="Next page"><i class="fas fa-chevron-right"></i></button>'):'';
    }
    function later(){ clearTimeout(timer); timer=setTimeout(function(){ page=1; apply(); track('marketplace_search',{q:f.q.value}); },120); }
    f.addEventListener('input',later); f.addEventListener('change',function(){ page=1; apply(); track('filter_use',{}); });
    f.addEventListener('submit',function(e){ e.preventDefault(); page=1; apply(); app.classList.remove('filters-open'); });
    sortSel.addEventListener('change',function(){ page=1; apply(); });
    $('#mkReset',app).addEventListener('click',function(){ f.reset(); page=1; apply(); });
    pg.addEventListener('click',function(e){ var b=e.target.closest('[data-p]'); if(b&&!b.disabled){ page=+b.getAttribute('data-p'); apply(); app.scrollIntoView({behavior:'smooth',block:'start'}); } });
    app.addEventListener('click',function(e){ var b=e.target.closest('[data-pd]'); if(b){ var o=all.filter(function(x){return x.id===b.getAttribute('data-pd')})[0]; if(o) details(o); } });
    $$('[data-filters]',app).forEach(function(b){ b.addEventListener('click',function(){ app.classList.toggle('filters-open'); }); });
    $$('[data-quote]').forEach(function(b){ b.addEventListener('click',function(e){ e.preventDefault(); quote('pub'); }); });
  }

  /* ---------- directory marketplace ---------- */
  function directories(){
    var app=$('#dirApp'); if(!app) return;
    var f=$('#dirFilters',app), body=$('#dirBody',app), cards=$('#dirCards',app), cnt=$('#dirCount',app), all=[];
    loading(body,7);
    load('directories','directoriesCsvUrl').then(function(rows){
      all=rows.filter(active); DATA.dir=all; renderBar();
      opts(f.country,uniq(all.map(function(o){return o.country.split(' / ').join(';')})),'All countries');
      opts(f.category,uniq(all.map(function(o){return o.category})),'All categories');
      opts(f.industry,uniq(all.map(function(o){return o.industry})),'All industries');
      opts(f.language,uniq(all.map(function(o){return o.language.split(' / ').join(';')})),'All languages');
      apply();
    }).catch(function(){ failed(body,7,'directory list'); });
    function apply(){
      var q=(f.q.value||'').toLowerCase().trim(), type=f.type.value;
      var res=all.filter(function(o){
        if(q && (o.name+' '+o.website+' '+o.industry+' '+o.country+' '+o.city_coverage).toLowerCase().indexOf(q)<0) return false;
        if(f.country.value && o.country.split(' / ').indexOf(f.country.value)<0 && !(o.country==='Global')) return false;
        if(f.category.value && o.category!==f.category.value) return false;
        if(f.industry.value && o.industry!==f.industry.value) return false;
        if(f.language.value && o.language.split(' / ').indexOf(f.language.value)<0 && o.language!=='Multilingual') return false;
        if(type==='free' && !/^free/i.test(o.listing_type)) return false;
        if(type==='paid' && /^free$/i.test(o.listing_type)) return false;
        if(f.cmin.value && !(num(o.dr)>=+f.cmin.value)) return false;
        return true; });
      cnt.innerHTML='<b>'+res.length+'</b> of '+all.length+' directories';
      if(!res.length){ var e='<div class="mk-state"><i class="fas fa-magnifying-glass"></i><p>No directory matches. Tell us your country and industry and we will research relevant listings.</p></div>'; body.innerHTML='<tr><td colspan="7">'+e+'</td></tr>'; cards.innerHTML=e; return; }
      body.innerHTML=res.map(function(o){ return '<tr><td><div class="site-cell">'+fav(o.name)+'<span><b>'+esc(o.name)+'</b><small dir="ltr">'+esc(o.website)+'</small></span></div></td><td>'+esc(o.country)+'</td><td><span class="tag">'+esc(o.category)+'</span></td><td>'+esc(o.industry)+'</td><td>'+esc(o.listing_type)+'</td><td>'+(o.dr?'<span class="metric-pill">'+esc(o.dr)+'</span>':'<span class="muted">—</span>')+'</td><td class="acts">'+slBtn('dir',o.id)+'</td></tr>'; }).join('');
      cards.innerHTML=res.map(function(o){ return '<article class="mk-card"><div class="site-cell">'+fav(o.name)+'<span><b>'+esc(o.name)+'</b><small>'+esc(o.country)+' · '+esc(o.industry)+'</small></span></div><div class="mk-m two"><span><b>'+esc(o.category)+'</b>Category</span><span><b>'+esc(o.listing_type)+'</b>Listing</span></div>'+(o.requirements?'<p class="muted mk-note">'+esc(o.requirements)+'</p>':'')+'<div class="mk-cact">'+slBtn('dir',o.id)+'</div></article>'; }).join('');
    }
    f.addEventListener('input',apply); f.addEventListener('change',apply);
    f.addEventListener('submit',function(e){e.preventDefault();apply();app.classList.remove('filters-open');});
    $('#dirReset',app).addEventListener('click',function(){f.reset();apply();});
    $$('[data-filters]',app).forEach(function(b){ b.addEventListener('click',function(){ app.classList.toggle('filters-open'); }); });
    $$('[data-dquote]').forEach(function(b){ b.addEventListener('click',function(e){ e.preventDefault(); quote('dir',b.getAttribute('data-dquote')||undefined); }); });
  }

  /* ---------- Smart Site Finder 2.0 ---------- */
  var SYN={tech:['tech','technology','software','saas','it','ai','app','gadgets','digital'],news:['news','media','magazine','press','journal','general'],business:['business','finance','startup','marketing','economy'],finance:['finance','money','fintech','crypto','banking','investing'],health:['health','medical','fitness','wellness'],travel:['travel','tourism','hotels'],lifestyle:['lifestyle','fashion','beauty','home','food'],sports:['sports','sport','football','cricket'],gaming:['gaming','games','casino','igaming'],education:['education','learning','university']};
  function topical(o,words){
    if(!words.length) return 0.6;
    var n=(o.niche+' '+o.secondary_niches).toLowerCase();
    var best=0; words.forEach(function(w){ if(n.indexOf(w)>=0){best=1;return;} for(var k in SYN){ if(SYN[k].indexOf(w)>=0 && (n.indexOf(k)>=0||SYN[k].some(function(s){return n.indexOf(s)>=0}))) best=Math.max(best,0.7); } });
    return best||0.1;
  }
  function freshness(o){ if(!o.upd) return 0.2; var d=(Date.now()-new Date(o.upd).getTime())/864e5; return isNaN(d)?0.2:(d<=90?1:d<=180?0.6:0.3); }
  function matchScore(o,b){
    var words=(b.niche||'').toLowerCase().split(/[^a-z0-9À-ɏ]+/).filter(function(w){return w.length>1});
    var p={
      topic:[35,topical(o,words)],
      country:[15,!b.country?0.8:(o.country===b.country?1:(o.country==='Global'?0.6:0.1))],
      language:[15,!b.language?0.8:(o.language===b.language?1:0)],
      budget:[15,!b.budget?0.8:(o.pr==null?0.5:(o.pr<=b.budget?1:0))],
      authority:[10,(function(){ var s=1; if(b.dr) s=Math.min(s,o.dr==null?0.3:(o.dr>=b.dr?1:Math.max(0,1-(b.dr-o.dr)/20))); if(b.da) s=Math.min(s,o.da==null?0.3:(o.da>=b.da?1:Math.max(0,1-(b.da-o.da)/20))); if(b.traffic) s=Math.min(s,o.tv==null?0.3:(o.tv>=b.traffic?1:0.3)); return s; })()],
      editorial:[5,b.type==='Niche Edit'?(o.ne?1:0.3):b.type==='Digital PR'?(o.dp?1:0.3):(o.gp?1:0.3)],
      freshness:[5,freshness(o)]};
    var t=0; for(var k in p) t+=p[k][0]*p[k][1];
    return {s:Math.max(1,Math.min(99,Math.round(t))),p:p};
  }
  var PL={topic:'Topical relevance',country:'Country fit',language:'Language fit',budget:'Budget fit',authority:'Authority & traffic',editorial:'Placement availability',freshness:'Metric freshness'};
  function finder(){
    var app=$('#finderApp'); if(!app) return;
    var f=$('#finderForm',app), out=$('#finderOut',app), all=[];
    var qs=new URLSearchParams(location.search); if(qs.get('topic')) f.niche.value=qs.get('topic');
    out.innerHTML='<div class="mk-state"><span class="spin"></span>Loading inventory…</div>';
    load('publishers','publishersCsvUrl').then(function(rows){
      all=rows.map(pub).filter(active); DATA.pub=all; renderBar();
      opts(f.country,uniq(all.map(function(o){return o.country})),'Any country');
      opts(f.language,uniq(all.map(function(o){return o.language})),'Any language');
      run();
    }).catch(function(){ failed(out,0,'publisher list'); });
    function run(){
      if(!all.length){ out.innerHTML='<div class="mk-state"><i class="fas fa-inbox"></i><p>Our public inventory is being updated. Send your brief and we will match publishers manually.</p><button type="button" class="btn btn-gold btn-sm" data-qq>Send my brief</button></div>'; $('[data-qq]',out).onclick=function(){quote('pub')}; return; }
      var b={niche:f.niche.value,country:f.country.value,language:f.language.value,dr:+f.dr.value||0,da:+f.da.value||0,traffic:+f.traffic.value||0,budget:+f.budget.value||0,type:f.type.value};
      var res=all.map(function(o){var m=matchScore(o,b);return {o:o,s:m.s,p:m.p}}).sort(function(a,c){return c.s-a.s}).slice(0,8);
      out.innerHTML='<div class="fo-head"><p>Top matches for <b>'+esc(b.niche||'any topic')+'</b>'+(b.dr?' · DR '+b.dr+'+':'')+(b.budget?' · up to $'+b.budget:'')+'</p><button type="button" class="btn btn-ghost btn-sm" data-addall><i class="fas fa-layer-group"></i> Shortlist top 5</button></div>'+
        res.map(function(m,i){ var o=m.o; return '<div class="match"><span class="pct" aria-label="Match score '+m.s+'%">'+m.s+'<small>%</small></span><div class="info"><button type="button" class="site-cell" data-pd="'+esc(o.id)+'"><span><b>'+esc(o.domain)+'</b><small>'+esc(o.niche)+' · DR '+(o.dr==null?'—':o.dr)+' · DA '+(o.da==null?'—':o.da)+' · '+fmtN(o.tv)+' traffic · '+esc(o.country)+' · '+(money(o.pr,o.currency)||'Request price')+'</small></span></button>'+
          '<details class="why-m"><summary>Why this match</summary><ul>'+Object.keys(m.p).map(function(k){ return '<li><span>'+PL[k]+'</span><i><b style="width:'+Math.round(m.p[k][1]*100)+'%"></b></i><em>'+Math.round(m.p[k][0]*m.p[k][1])+'/'+m.p[k][0]+'</em></li>'; }).join('')+'</ul></details></div><div class="m-act">'+slBtn('pub',o.id)+'</div></div>'; }).join('')+
        '<p class="fo-note"><i class="fas fa-circle-info"></i> The match score is a shortlisting aid based on topic, country, language, budget, authority and how recently metrics were checked. It is not a prediction of rankings or SEO value.</p>'+
        '<div class="fo-cta"><button type="button" class="btn btn-gold" data-qq><i class="fas fa-paper-plane"></i> Request quotation</button><a class="btn btn-wa" target="_blank" rel="noopener" href="'+wa('Hello MayoTechX, please send me a custom publisher list.\nNiche: '+(b.niche||'-')+'\nCountry: '+(b.country||'any')+'\nLanguage: '+(b.language||'any')+'\nMin DR: '+(b.dr||'any')+'\nBudget per placement: '+(b.budget?'$'+b.budget:'-')+'\nPlacement: '+b.type+(f.url.value?'\nWebsite: '+f.url.value:''))+'"><i class="fab fa-whatsapp"></i> Get a full custom list</a></div>';
      $('[data-qq]',out).onclick=function(){ quote('pub',b.type); };
      $('[data-addall]',out).onclick=function(){ var a=list('pub'); res.slice(0,5).forEach(function(m){ if(a.indexOf(m.o.id)<0) a.push(m.o.id); }); setList('pub',a); };
    }
    f.addEventListener('submit',function(e){e.preventDefault();run();track('marketplace_search',{tool:'finder'});});
    f.addEventListener('change',run);
    out.addEventListener('click',function(e){ var bt=e.target.closest('[data-pd]'); if(bt){ var o=all.filter(function(x){return x.id===bt.getAttribute('data-pd')})[0]; if(o) details(o); } });
  }

  /* ---------- home preview ---------- */
  function preview(){
    var box=$('#mkPreview'); if(!box) return;
    var inp=$('#mkPrevQ'), all=[];
    load('publishers','publishersCsvUrl').then(function(rows){ all=rows.map(pub).filter(active); DATA.pub=all; $$('[data-inv-count]').forEach(function(e){e.textContent=all.length}); draw(); }).catch(function(){ box.innerHTML='<p class="muted">Inventory is shared on request.</p>'; });
    function draw(){
      var q=(inp&&inp.value||'').toLowerCase();
      var res=all.filter(function(o){return !q||(o.domain+' '+o.niche+' '+o.country+' '+o.language).toLowerCase().indexOf(q)>=0}).sort(function(a,b){return (b.dr||0)-(a.dr||0)}).slice(0,5);
      box.innerHTML=res.length?res.map(function(o){ return '<a class="pv-row" href="'+BASE+'marketplace.html?q='+encodeURIComponent(o.domain)+'"><span class="pv-site">'+fav(o.domain)+'<span><b>'+esc(o.domain)+'</b><small>'+esc(o.niche)+' · '+esc(o.country)+'</small></span></span><span class="pv-m"><b>'+(o.dr==null?'—':o.dr)+'</b>DR</span><span class="pv-m"><b>'+(o.da==null?'—':o.da)+'</b>DA</span><span class="pv-m"><b>'+fmtN(o.tv)+'</b>Traffic</span><span class="pv-p">'+(money(o.pr,o.currency)||'Request price')+'</span></a>'; }).join(''):'<p class="muted" style="padding:14px">No listed site matches “'+esc(q)+'”. <a href="'+BASE+'smart-finder.html?topic='+encodeURIComponent(q)+'">Try the Smart Site Finder</a>.</p>';
    }
    if(inp) inp.addEventListener('input',draw);
    var go=$('#mkPrevGo'); if(go) go.addEventListener('click',function(){ location.href=BASE+'marketplace.html?q='+encodeURIComponent(inp.value); });
  }

  function boot(){
    marketplace(); directories(); finder(); preview();
    if(!DATA.pub.length && (list('pub').length||list('dir').length)){ load('publishers','publishersCsvUrl').then(function(r){DATA.pub=r.map(pub).filter(active);renderBar();}).catch(function(){}); load('directories','directoriesCsvUrl').then(function(r){DATA.dir=r.filter(active);renderBar();}).catch(function(){}); }
    renderBar();
    $$('a[href^="https://wa.me"]').forEach(function(a){ a.addEventListener('click',function(){ track('whatsapp_click',{href:a.pathname}); }); });
    $$('a[href^="mailto:"]').forEach(function(a){ a.addEventListener('click',function(){ track('email_click',{}); }); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
