/* =========================================================
   MayoTechX Assistant
   • Answers common questions from the knowledge base below.
   • Anything it can't answer is handed to the team on WhatsApp.
   • To switch on a full AI chatbot (Chatbase), paste your Chatbase
     chatbot ID in SITE.chatbaseId in assets/js/data.js.
   ========================================================= */
(function(){
  var KB=[
    {k:['price','cost','rate','how much','pricing','quote','budget','charges','fee'],a:'Pricing depends on the service and scope. Link building is priced per placement (by DR and niche), SEO and ads are monthly retainers, and websites, apps and software are quoted per project. Tell me what you need and our team will send a clear quote — usually within the hour.',l:[['See packages','packages.html'],['Get a quote','contact.html']]},
    {k:['seo','rank','ranking','google search','organic','search engine'],a:'Our SEO programme covers technical fixes, keyword strategy, on-page optimisation, content and white-hat link building — plus visibility in AI search like Google AI Overviews and ChatGPT. Most clients see early movement in 6–12 weeks.',l:[['SEO services','seo.html'],['Technical SEO','technical-seo.html'],['Local SEO','local-seo.html']]},
    {k:['link','backlink','guest post','guest posting','niche edit','dr','da','publisher'],a:'We place guest posts and niche edits on vetted, real-traffic publishers, with DR, DA and traffic shown before you buy and live URLs reported after. You can browse sites in our Marketplace or use the Smart Finder.',l:[['Marketplace','marketplace.html'],['Smart Finder','smart-finder.html'],['Guest posting','guest-posting.html']]},
    {k:['pr','press','news','media','publication','feature'],a:'Our Digital PR team places editorial features on news and media outlets worldwide — strong authority signals for Google and AI search.',l:[['Digital PR','digital-pr.html']]},
    {k:['google ads','ppc','adwords','search ads','performance max','shopping ads'],a:'We manage Google Search, Performance Max, Shopping and YouTube campaigns, optimised to your cost per lead or ROAS. You keep ownership of the ad account.',l:[['Google Ads','google-ads.html']]},
    {k:['meta','facebook','instagram','fb ads','social ads'],a:'We run full-funnel Facebook and Instagram campaigns: creative, audiences, Pixel and Conversions API, with weekly testing and ROAS reporting.',l:[['Meta Ads','meta-ads.html']]},
    {k:['tiktok'],a:'We create native-feeling TikTok videos, Spark Ads and creator content, then test hooks quickly to find winners.',l:[['TikTok Ads','tiktok-ads.html']]},
    {k:['website','web development','web site','landing page','redesign','next.js','react'],a:'We design and build fast, custom, SEO-ready websites — typically 3–6 weeks for a corporate site. You get a site you can edit, with hosting and support available.',l:[['Web development','web-development.html'],['UI/UX design','ui-ux-design.html']]},
    {k:['wordpress','wp','elementor','woocommerce','plugin','theme'],a:'We build custom WordPress themes and plugins, WooCommerce stores, speed optimisation and security hardening, plus monthly maintenance plans.',l:[['WordPress','wordpress-development.html']]},
    {k:['shopify','ecommerce','e-commerce','online store','store'],a:'We build Shopify and WooCommerce stores with high-converting product pages, payments, shipping, email flows and full tracking.',l:[['E-commerce','ecommerce-development.html']]},
    {k:['app','mobile','android','ios','flutter','react native'],a:'We build iOS and Android apps with Flutter or React Native (native when needed), including backend, payments, push notifications and store launch.',l:[['Mobile apps','mobile-apps.html']]},
    {k:['software','saas','mvp','portal','dashboard','crm','erp','system','platform'],a:'We design and build custom software and SaaS — from MVPs to enterprise platforms — with full code ownership transferred to you. Dedicated teams are available monthly.',l:[['Custom software','custom-software.html']]},
    {k:['ai','chatbot','automation','automate','gpt','claude','bot','whatsapp bot'],a:'We build AI chatbots for websites and WhatsApp, trained on your business, and automate workflows between your apps to save staff hours.',l:[['AI & automation','ai-automation.html']]},
    {k:['white label','white-label','reseller','resell','agency partner','partner'],a:'Agencies can resell our link building, SEO, ads, websites and apps under their own brand. Reports are unbranded and we never contact your clients.',l:[['White-label','white-label.html']]},
    {k:['time','how long','turnaround','deadline','fast','delivery','days'],a:'Typical timelines: guest posts 3–10 working days, technical SEO audit 5–10 days, corporate website 3–6 weeks, ads live within a few days of approval. Larger software projects are scoped with milestones.',l:[]},
    {k:['payment','pay','paypal','payoneer','wise','card','invoice','bank'],a:'We accept PayPal, Payoneer, Wise and card payments. Larger projects are billed in milestones.',l:[]},
    {k:['refund','guarantee','money back','replace','removed'],a:'If an agreed placement can\'t be published, you can choose a replacement or a refund for it. Links removed within the agreed guarantee period are replaced free.',l:[['Refund policy','refund-policy.html']]},
    {k:['contact','whatsapp','email','call','talk','human','team','reach'],a:'You can reach our team on WhatsApp at '+SITE.phone+' or email '+SITE.email+'. We reply seven days a week.',l:[['Contact page','contact.html']]},
    {k:['where','location','country','office','timezone','time zone'],a:'We are a global, remote-first team working with clients across North America, Europe, the Middle East and Asia — and we schedule calls in your time zone.',l:[['About us','about.html']]},
    {k:['hello','hi','hey','salam','assalam','good morning','good evening'],a:'Hello! I\'m the MayoTechX assistant. Ask me about SEO, link building, ads, websites, apps, software or AI — or tell me what you\'re trying to achieve.',l:[]}
  ];
  var CHIPS=['What do you offer?','How much does it cost?','Guest post prices','Build a website','Google Ads','AI chatbot'];
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function wa(t){return 'https://wa.me/'+SITE.whatsapp+'?text='+encodeURIComponent(t)}
  function answer(q){
    var s=q.toLowerCase(), best=null, bs=0;
    if(/what (do|services)|offer|services/.test(s)) return {a:'We are a full-service technology company: SEO, link building and digital PR; Google, Meta and TikTok ads; web, WordPress and e-commerce development; custom software, mobile apps and AI automation — all under one roof.',l:[['All services','services.html'],['Get a quote','contact.html']]};
    KB.forEach(function(e){ var sc=0; e.k.forEach(function(k){ var re=new RegExp('(^|[^a-z])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(s|es)?($|[^a-z])'); if(re.test(s)) sc+=k.length>3?2:1; }); if(sc>bs){bs=sc;best=e;} });
    return best;
  }
  function init(){
    if(SITE.chatbaseId){ window.embeddedChatbotConfig={chatbotId:SITE.chatbaseId,domain:'www.chatbase.co'}; var sc=document.createElement('script'); sc.src='https://www.chatbase.co/embed.min.js'; sc.defer=true; sc.setAttribute('chatbotId',SITE.chatbaseId); sc.setAttribute('domain','www.chatbase.co'); document.body.appendChild(sc); return; }
    var btn=document.createElement('button'); btn.className='ai-launch'; btn.type='button'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','aiPanel');
    btn.innerHTML='<span class="ai-dot"><i class="fas fa-wand-magic-sparkles"></i></span><span class="lbl">Ask MayoTechX</span>';
    var p=document.createElement('section'); p.className='ai-panel'; p.id='aiPanel'; p.setAttribute('aria-label','MayoTechX assistant');
    p.innerHTML='<div class="ai-head"><span class="ai-dot"><i class="fas fa-wand-magic-sparkles"></i></span><div><b>MayoTechX Assistant</b><small>Instant answers · team on WhatsApp</small></div><button type="button" aria-label="Close"><i class="fas fa-xmark"></i></button></div><div class="ai-log" id="aiLog" aria-live="polite"></div><div class="ai-chips">'+CHIPS.map(function(c){return '<button type="button">'+esc(c)+'</button>'}).join('')+'</div><form class="ai-form"><input id="aiIn" autocomplete="off" placeholder="Ask anything about our services…" aria-label="Your question"><button type="submit" aria-label="Send"><i class="fas fa-paper-plane"></i></button></form>';
    document.body.appendChild(p); document.body.appendChild(btn);
    var log=p.querySelector('#aiLog'), inp=p.querySelector('#aiIn');
    function add(html,who){var d=document.createElement('div');d.className='msg '+who;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
    function ask(q){
      if(!q.trim()) return; add(esc(q),'me'); inp.value='';
      var t=add('<span class="typing"><i></i><i></i><i></i></span>','bot');
      setTimeout(function(){
        var r=answer(q), html;
        if(r){ html=esc(r.a)+(r.l&&r.l.length?'<br>'+r.l.map(function(x){return '<a href="'+x[1]+'">'+esc(x[0])+'</a>'}).join(' · '):'')+'<br><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="'+wa('Hi MayoTechX, '+q)+'"><i class="fab fa-whatsapp"></i> Ask the team</a>'; }
        else { html='Good question — let me connect you with a specialist who can answer that properly.<br><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="'+wa('Hi MayoTechX, I have a question: '+q)+'"><i class="fab fa-whatsapp"></i> Send to our team</a>'; }
        t.innerHTML=html; log.scrollTop=log.scrollHeight;
      },550);
    }
    var opened=false;
    function toggle(o){ p.classList.toggle('open',o); btn.setAttribute('aria-expanded',o); if(o){ if(!opened){opened=true; add('Hi! I\'m the MayoTechX assistant. Ask me about our services, pricing, timelines or how we work.','bot');} setTimeout(function(){inp.focus()},200);} }
    btn.addEventListener('click',function(){toggle(!p.classList.contains('open'))});
    p.querySelector('.ai-head button').addEventListener('click',function(){toggle(false)});
    p.querySelector('.ai-form').addEventListener('submit',function(e){e.preventDefault();ask(inp.value)});
    p.querySelectorAll('.ai-chips button').forEach(function(b){b.addEventListener('click',function(){ask(b.textContent)})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape') toggle(false)});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
