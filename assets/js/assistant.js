/* =========================================================
   MayoTechX Assistant  (EN / AR / DE)
   • Answers 40+ topics instantly from the knowledge base below.
   • Guided "Get an estimate" flow that sends a full brief to WhatsApp.
   • Anything it can't answer goes to the team on WhatsApp.
   • To switch on a full AI chatbot (Chatbase), paste your Chatbase
     chatbot ID in SITE.chatbaseId in assets/js/data.js.
   ========================================================= */
(function(){
  var DE_=document.documentElement;
  var LANG=(DE_.lang||'en').slice(0,2); if(['en','ar','de','fr','it','ja','zh'].indexOf(LANG)<0) LANG='en';
  var TRP=(DE_.getAttribute('data-tr')||'').split(',').filter(Boolean), BASE_=DE_.getAttribute('data-base')||'';
  function href(slug){ return TRP.indexOf(slug)>=0 ? slug : BASE_+slug; }
  function T(o){ return (o&&(o[LANG]||o.en))||''; }

  var UI={
    launch:{en:'Ask MayoTechX',ar:'اسأل MayoTechX',de:'Fragen Sie MayoTechX'},
    title:{en:'MayoTechX Assistant',ar:'مساعد MayoTechX',de:'MayoTechX Assistent'},
    sub:{en:'Instant answers · 24/7 · team on WhatsApp',ar:'إجابات فورية · على مدار الساعة · الفريق على واتساب',de:'Sofortantworten · 24/7 · Team per WhatsApp'},
    hello:{en:'Hi! I\'m the MayoTechX assistant. Ask me anything about our services, prices, timelines or how we work — or get a quick estimate.',ar:'مرحبًا! أنا مساعد MayoTechX. اسألني عن خدماتنا أو الأسعار أو المدة أو طريقة عملنا — أو احصل على تقدير سريع.',de:'Hallo! Ich bin der MayoTechX-Assistent. Fragen Sie mich zu Leistungen, Preisen, Zeitrahmen oder unserer Arbeitsweise — oder holen Sie sich eine schnelle Einschätzung.'},
    ph:{en:'Ask anything…',ar:'اكتب سؤالك…',de:'Ihre Frage…'},
    ask_team:{en:'Ask the team',ar:'اسأل الفريق',de:'Team fragen'},
    send_team:{en:'Send to our team',ar:'أرسل إلى فريقنا',de:'An unser Team senden'},
    unknown:{en:'Good question — a specialist can answer that properly. Send it to our team and you\'ll get a reply within minutes.',ar:'سؤال ممتاز — سيجيبك أحد المختصين بدقة. أرسله إلى فريقنا وستصلك الإجابة خلال دقائق.',de:'Gute Frage — das beantwortet ein Spezialist am besten. Senden Sie sie an unser Team, die Antwort kommt in wenigen Minuten.'},
    transcript:{en:'Send this chat to the team',ar:'أرسل هذه المحادثة للفريق',de:'Diesen Chat ans Team senden'},
    tip:{en:'Questions? Ask me anything',ar:'لديك سؤال؟ اسألني',de:'Fragen? Fragen Sie mich'},
    est_q1:{en:'Great — let\'s scope it. Which service do you need?',ar:'رائع — لنحدد المشروع. ما الخدمة التي تحتاجها؟',de:'Gerne — lassen Sie uns das eingrenzen. Welche Leistung brauchen Sie?'},
    est_q2:{en:'What budget range do you have in mind (USD)?',ar:'ما نطاق الميزانية المتوقع (بالدولار)؟',de:'Welchen Budgetrahmen planen Sie (USD)?'},
    est_q3:{en:'And your timeline?',ar:'وما المدة المطلوبة؟',de:'Und Ihr Zeitrahmen?'},
    est_q4:{en:'Last step: your name and website or company (optional). Type it below, or tap “Skip”.',ar:'الخطوة الأخيرة: اسمك وموقعك أو شركتك (اختياري). اكتبه بالأسفل أو اضغط «تخطي».',de:'Letzter Schritt: Ihr Name und Ihre Website oder Firma (optional). Unten eintippen oder „Überspringen“.'},
    est_done:{en:'Perfect. Here\'s your brief — send it on WhatsApp and our team will reply with a plan and quote.',ar:'ممتاز. هذا ملخص طلبك — أرسله على واتساب وسيرد فريقنا بخطة وعرض سعر.',de:'Perfekt. Hier ist Ihr Briefing — senden Sie es per WhatsApp, und unser Team antwortet mit Plan und Angebot.'},
    est_send:{en:'Send brief on WhatsApp',ar:'أرسل الطلب على واتساب',de:'Briefing per WhatsApp senden'},
    skip:{en:'Skip',ar:'تخطي',de:'Überspringen'},
    svc:{en:['SEO','Link building / PR','Google / Meta Ads','Website / WordPress','E-commerce store','Custom software / SaaS','Mobile app','AI chatbot / automation','Not sure yet'],
         ar:['SEO','بناء روابط / علاقات عامة','إعلانات Google / Meta','موقع / WordPress','متجر إلكتروني','برمجيات مخصصة / SaaS','تطبيق جوال','روبوت دردشة / أتمتة','لست متأكدًا'],
         de:['SEO','Linkbuilding / PR','Google / Meta Ads','Website / WordPress','Online-Shop','Individualsoftware / SaaS','Mobile App','KI-Chatbot / Automatisierung','Noch unsicher']},
    bud:{en:['Under $1,000','$1k – $5k','$5k – $20k','$20k – $50k','$50k+'],ar:['أقل من 1,000$','1 – 5 آلاف$','5 – 20 ألف$','20 – 50 ألف$','أكثر من 50 ألف$'],de:['Unter 1.000 $','1k – 5k $','5k – 20k $','20k – 50k $','50k+ $']},
    time:{en:['ASAP','Within 1 month','1–3 months','Just exploring'],ar:['في أقرب وقت','خلال شهر','1 – 3 أشهر','أستكشف فقط'],de:['So schnell wie möglich','Innerhalb 1 Monat','1–3 Monate','Nur informieren']},
    chips:{en:['Get an estimate','What do you offer?','How much does it cost?','Build a website','Google Ads','AI chatbot','Talk to a human'],
           ar:['احصل على تقدير','ماذا تقدمون؟','كم التكلفة؟','بناء موقع','إعلانات Google','روبوت دردشة','تحدث مع شخص'],
           de:['Schätzung erhalten','Was bieten Sie an?','Was kostet das?','Website erstellen','Google Ads','KI-Chatbot','Mit einem Menschen sprechen']}
  };
  var PG={ 'services.html':{en:'All services',ar:'جميع الخدمات',de:'Alle Leistungen'},'packages.html':{en:'Packages',ar:'الباقات',de:'Pakete'},'contact.html':{en:'Get a quote',ar:'اطلب عرضًا',de:'Angebot anfordern'},
    'seo.html':{en:'SEO',ar:'خدمات SEO',de:'SEO'},'local-seo.html':{en:'Local SEO',ar:'SEO المحلي',de:'Local SEO'},'technical-seo.html':{en:'Technical SEO',ar:'SEO التقني',de:'Technisches SEO'},'content-writing.html':{en:'Content writing',ar:'كتابة المحتوى',de:'SEO-Content'},
    'link-building.html':{en:'Link building',ar:'بناء الروابط',de:'Linkbuilding'},'guest-posting.html':{en:'Guest posting',ar:'مقالات الضيف',de:'Gastbeiträge'},'niche-edits.html':{en:'Niche edits',ar:'روابط داخل مقالات',de:'Niche Edits'},'digital-pr.html':{en:'Digital PR',ar:'العلاقات العامة الرقمية',de:'Digital PR'},'white-label.html':{en:'White-label',ar:'العلامة البيضاء',de:'White-Label'},
    'google-ads.html':{en:'Google Ads',ar:'إعلانات Google',de:'Google Ads'},'meta-ads.html':{en:'Meta Ads',ar:'إعلانات Meta',de:'Meta Ads'},'tiktok-ads.html':{en:'TikTok Ads',ar:'إعلانات TikTok',de:'TikTok Ads'},
    'web-development.html':{en:'Web development',ar:'تطوير المواقع',de:'Webentwicklung'},'wordpress-development.html':{en:'WordPress',ar:'WordPress',de:'WordPress'},'ecommerce-development.html':{en:'E-commerce',ar:'المتاجر الإلكترونية',de:'E-Commerce'},'custom-software.html':{en:'Custom software',ar:'البرمجيات المخصصة',de:'Individualsoftware'},'mobile-apps.html':{en:'Mobile apps',ar:'تطبيقات الجوال',de:'Apps'},'ui-ux-design.html':{en:'UI/UX design',ar:'تصميم UI/UX',de:'UI/UX-Design'},'ai-automation.html':{en:'AI & automation',ar:'الذكاء الاصطناعي والأتمتة',de:'KI & Automatisierung'},
    'marketplace.html':{en:'Marketplace',ar:'سوق الناشرين',de:'Marktplatz'},'smart-finder.html':{en:'Smart Finder',ar:'الباحث الذكي',de:'Smart Finder'},'publishers.html':{en:'Become a publisher',ar:'انضم كناشر',de:'Publisher werden'},'refund-policy.html':{en:'Refund policy',ar:'سياسة الاسترداد',de:'Rückerstattung'},'privacy-policy.html':{en:'Privacy policy',ar:'سياسة الخصوصية',de:'Datenschutz'},'about.html':{en:'About us',ar:'من نحن',de:'Über uns'},'seo-tools.html':{en:'Free SEO tools',ar:'أدوات SEO مجانية',de:'SEO-Tools'},'faq.html':{en:'FAQ',ar:'الأسئلة الشائعة',de:'FAQ'} };

  /* ---------- knowledge base ---------- */
  var KB=[
    {id:'offer',k:['what do you offer','what do you do','services','offer','service list','ماذا تقدمون','الخدمات','خدماتكم','leistungen','was bieten','angebot'],
     a:{en:'We are a full-service technology company with five practices: Search & Growth (SEO, local, technical, content), Authority & Links (link building, guest posts, niche edits, digital PR, white-label), Paid Media (Google, Meta, TikTok ads), Engineering (websites, WordPress, e-commerce, custom software, mobile apps, UI/UX) and AI & Automation (chatbots and workflows).',
        ar:'نحن شركة تقنية متكاملة بخمسة أقسام: البحث والنمو (SEO المحلي والتقني والمحتوى)، السلطة والروابط (بناء الروابط ومقالات الضيف والعلاقات العامة والعلامة البيضاء)، الإعلانات المدفوعة (Google وMeta وTikTok)، الهندسة البرمجية (المواقع وWordPress والمتاجر والبرمجيات والتطبيقات وUI/UX)، والذكاء الاصطناعي والأتمتة.',
        de:'Wir sind ein Full-Service-Technologieunternehmen mit fünf Bereichen: Search & Wachstum (SEO, Local, Technik, Content), Autorität & Links (Linkbuilding, Gastbeiträge, Niche Edits, Digital PR, White-Label), Paid Media (Google, Meta, TikTok), Engineering (Websites, WordPress, Shops, Individualsoftware, Apps, UI/UX) sowie KI & Automatisierung.'},
     l:['services.html','contact.html'],f:['price','website','ai']},
    {id:'price',k:['price','cost','rate','how much','pricing','quote','budget','charges','fee','expensive','السعر','الأسعار','التكلفة','كم','ميزانية','عرض سعر','preis','preise','kosten','kostet','budget'],
     a:{en:'Pricing depends on scope. Link building is priced per placement (by DR and niche), SEO and ads are monthly retainers, and websites, apps and software are quoted per project with milestones. Tap “Get an estimate” and I\'ll put together a brief for our team — you usually get a quote within hours.',
        ar:'السعر يعتمد على نطاق العمل. بناء الروابط لكل رابط (حسب DR والمجال)، وSEO والإعلانات باشتراك شهري، والمواقع والتطبيقات والبرمجيات بعرض سعر لكل مشروع على مراحل. اضغط «احصل على تقدير» وسأجهز ملخصًا لفريقنا — عادةً يصلك العرض خلال ساعات.',
        de:'Der Preis hängt vom Umfang ab. Linkbuilding pro Platzierung (nach DR und Nische), SEO und Ads als monatlicher Retainer, Websites, Apps und Software als Projektangebot mit Meilensteinen. Tippen Sie auf „Schätzung erhalten“ — Sie bekommen meist innerhalb weniger Stunden ein Angebot.'},
     l:['packages.html','contact.html'],f:['estimate','payment','time']},
    {id:'seo',k:['seo','rank','ranking','google search','organic','search engine','first page','سيو','محركات البحث','الترتيب','الصفحة الأولى','suchmaschine','sichtbarkeit'],
     a:{en:'Our SEO programme covers technical fixes, keyword strategy, on-page optimisation, content and white-hat link building — plus visibility in AI search like Google AI Overviews and ChatGPT. Most clients see early movement in 6–12 weeks and meaningful growth in 4–6 months.',
        ar:'برنامج SEO لدينا يشمل الإصلاحات التقنية واستراتيجية الكلمات والتحسين داخل الصفحة والمحتوى وبناء روابط نظيفة — بالإضافة للظهور في بحث الذكاء الاصطناعي مثل Google AI Overviews وChatGPT. يرى معظم العملاء تحسنًا خلال 6–12 أسبوعًا ونموًا واضحًا خلال 4–6 أشهر.',
        de:'Unser SEO-Programm umfasst technische Fixes, Keyword-Strategie, OnPage-Optimierung, Content und White-Hat-Linkbuilding — plus Sichtbarkeit in der KI-Suche (Google AI Overviews, ChatGPT). Erste Bewegungen meist nach 6–12 Wochen, deutliches Wachstum nach 4–6 Monaten.'},
     l:['seo.html','technical-seo.html','local-seo.html'],f:['links','content','guarantee']},
    {id:'local',k:['local seo','google maps','map pack','google business','gmb','near me','خرائط','جوجل ماب','النشاط التجاري','lokal','maps'],
     a:{en:'Local SEO gets you into the Google Maps “map pack”: Google Business Profile optimisation, citations, a genuine review process, location pages and local links. Great for clinics, law firms, restaurants, real estate and multi-branch businesses.',
        ar:'SEO المحلي يضعك في نتائج خرائط Google: تحسين ملف النشاط التجاري، الأدلة المحلية، نظام تقييمات حقيقي، صفحات للمواقع وروابط محلية. مثالي للعيادات والمحاماة والمطاعم والعقارات والفروع المتعددة.',
        de:'Local SEO bringt Sie ins Google-Maps-„Local Pack“: Google-Unternehmensprofil, Citations, ein seriöser Bewertungsprozess, Standortseiten und lokale Links — ideal für Praxen, Kanzleien, Gastronomie, Immobilien und Filialisten.'},
     l:['local-seo.html'],f:['seo','price']},
    {id:'tech',k:['technical seo','core web vitals','page speed','site speed','slow website','slow site','indexing','crawl','migration','سرعة الموقع','الفهرسة','بطيء','ladezeit','indexierung','geschwindigkeit'],
     a:{en:'Technical SEO fixes what silently caps rankings: crawl and index issues, redirects, duplicates, schema, site architecture and Core Web Vitals. Our developers can implement fixes on WordPress, Shopify or custom stacks. Audits take 5–10 working days.',
        ar:'SEO التقني يصلح ما يحد من ترتيبك بصمت: مشاكل الزحف والفهرسة والتحويلات والتكرار وSchema وبنية الموقع وCore Web Vitals. مطورونا ينفذون الإصلاحات على WordPress أو Shopify أو أي نظام. التدقيق يستغرق 5–10 أيام عمل.',
        de:'Technisches SEO behebt, was Rankings ausbremst: Crawling, Indexierung, Weiterleitungen, Duplikate, Schema, Architektur und Core Web Vitals. Unsere Entwickler setzen Fixes direkt um. Audits dauern 5–10 Werktage.'},
     l:['technical-seo.html'],f:['seo','website']},
    {id:'content',k:['content','article','articles','blog','copywriting','writer','writing','محتوى','مقالات','كتابة','مدونة','inhalte','texte','artikel'],
     a:{en:'Our editors write original, search-intent content: blog articles, landing pages, product copy and refreshes of old pages — with headings, internal links and schema included. We write in English, Arabic and German.',
        ar:'محررونا يكتبون محتوى أصليًا مبنيًا على نية البحث: مقالات وصفحات هبوط ووصف منتجات وتحديث الصفحات القديمة — مع العناوين والروابط الداخلية وSchema. نكتب بالعربية والإنجليزية والألمانية.',
        de:'Unsere Redakteure schreiben originelle, suchintentionsbasierte Inhalte: Blogartikel, Landingpages, Produkttexte und Content-Refreshes — inkl. Struktur, interner Links und Schema. Auf Deutsch, Englisch und Arabisch.'},
     l:['content-writing.html'],f:['seo','links']},
    {id:'links',k:['link','links','backlink','backlinks','guest post','guest posts','guest posting','link building','dr','da','authority','روابط','باك لينك','مقالات ضيف','مقالات الضيف','بناء روابط','gastbeitrag','gastbeiträge','linkbuilding'],
     a:{en:'We place guest posts and niche edits on vetted, real-traffic publishers. You see DR, DA, traffic, country and language before you buy, and get the live URL after publishing — typically within 3–10 working days. Browse our Marketplace or let our team build a managed monthly campaign.',
        ar:'ننشر مقالات ضيف وروابط داخل مقالات على ناشرين حقيقيين وموثوقين. ترى DR وDA والزيارات والدولة واللغة قبل الشراء، وتحصل على الرابط المباشر بعد النشر — عادةً خلال 3–10 أيام عمل.',
        de:'Wir platzieren Gastbeiträge und Niche Edits auf geprüften Publishern mit echtem Traffic. DR, DA, Traffic, Land und Sprache sehen Sie vorab, die Live-URL nach Veröffentlichung — meist in 3–10 Werktagen.'},
     l:['marketplace.html','link-building.html','guest-posting.html'],f:['safe','price','pr']},
    {id:'safe',k:['white hat','whitehat','safe','pbn','spam','penalty','آمنة','آمن','عقوبة','سبام','sicher','abstrafung'],
     a:{en:'Yes — white-hat only. Real websites with real traffic, checked for indexing and spam signals. No PBNs, link farms or automated spam, and a natural anchor mix to keep your profile safe.',
        ar:'نعم — روابط نظيفة فقط. مواقع حقيقية بزيارات حقيقية، مفحوصة للفهرسة وإشارات السبام. بدون PBN أو مزارع روابط، ونصوص روابط طبيعية لحماية موقعك.',
        de:'Ja — ausschließlich White-Hat. Echte Websites mit echtem Traffic, geprüft auf Indexierung und Spam-Signale. Keine PBNs, Linkfarmen oder Spam, dazu ein natürlicher Anker-Mix.'},
     l:['link-building.html'],f:['links','refund']},
    {id:'niche',k:['niche edit','niche edits','insertion','link insertion','روابط داخل','إدراج رابط','linkeinfügung'],
     a:{en:'Niche edits place your link inside an existing, aged and indexed article that already has authority — often faster than a new guest post.',ar:'نضع رابطك داخل مقال قديم ومفهرس ويملك سلطة بالفعل — غالبًا أسرع من مقال ضيف جديد.',de:'Bei Niche Edits setzen wir Ihren Link in einen bestehenden, etablierten und indexierten Artikel — oft schneller als ein neuer Gastbeitrag.'},
     l:['niche-edits.html'],f:['links','price']},
    {id:'pr',k:['pr','press','press release','news','media','publication','feature','forbes','علاقات عامة','بيان صحفي','أخبار','إعلام','presse','pressemitteilung','medien'],
     a:{en:'Our Digital PR team secures editorial features on news and media outlets — strong authority and brand signals for Google and AI search. We also publish press releases and founder stories.',
        ar:'فريق العلاقات العامة الرقمية يحصل لك على ظهور في المواقع الإخبارية والإعلامية — إشارات سلطة قوية لـ Google وبحث الذكاء الاصطناعي. نوزع أيضًا البيانات الصحفية وقصص المؤسسين.',
        de:'Unser Digital-PR-Team sichert redaktionelle Features in News- und Medienportalen — starke Autoritätssignale für Google und KI-Suche. Auch Pressemitteilungen und Gründerstorys.'},
     l:['digital-pr.html'],f:['links','price']},
    {id:'wl',k:['white label','white-label','reseller','resell','agency','agency partner','partner','علامة بيضاء','وكالة','إعادة بيع','agentur','wiederverkauf'],
     a:{en:'Agencies can resell our link building, SEO, ads, websites and apps under their own brand. Reports are unbranded and we never contact your clients. Partner pricing is available for volume.',
        ar:'يمكن للوكالات إعادة بيع خدماتنا في بناء الروابط وSEO والإعلانات والمواقع والتطبيقات باسمها. التقارير بدون علامتنا ولا نتواصل مع عملائك أبدًا، مع أسعار شركاء للكميات.',
        de:'Agenturen können Linkbuilding, SEO, Ads, Websites und Apps unter eigener Marke weiterverkaufen. Reports sind ungebrandet, wir kontaktieren Ihre Kunden nie. Partnerpreise bei Volumen.'},
     l:['white-label.html'],f:['links','price']},
    {id:'gads',k:['google ads','ppc','adwords','search ads','performance max','pmax','shopping ads','youtube ads','إعلانات جوجل','إعلانات google','جوجل أدز','sea','suchmaschinenwerbung'],
     a:{en:'We manage Google Search, Performance Max, Shopping and YouTube campaigns, optimised to your cost per lead or ROAS, with full conversion tracking (GA4, GTM). You keep ownership of the ad account. Search campaigns can bring leads within days.',
        ar:'ندير حملات Google للبحث وPerformance Max والتسوق وYouTube وفق تكلفة العميل أو العائد، مع تتبع كامل للتحويلات (GA4 وGTM). تبقى ملكية الحساب لك، وقد تأتي النتائج خلال أيام.',
        de:'Wir steuern Google-Search-, Performance-Max-, Shopping- und YouTube-Kampagnen nach Kosten pro Lead oder ROAS, inkl. Conversion-Tracking (GA4, GTM). Das Werbekonto gehört Ihnen.'},
     l:['google-ads.html'],f:['meta','price','estimate']},
    {id:'meta',k:['meta','facebook','instagram','fb ads','social ads','social media ads','فيسبوك','إنستغرام','انستقرام','ميتا'],
     a:{en:'We run full-funnel Facebook and Instagram campaigns: creative, audiences, Pixel and Conversions API, with weekly creative testing and clear ROAS reporting. We create the ad creatives too.',
        ar:'ندير حملات فيسبوك وإنستغرام متكاملة: التصاميم والجماهير وPixel وCAPI، مع اختبارات أسبوعية وتقارير عائد واضحة. ونصمم الإعلانات أيضًا، بالعربية والإنجليزية.',
        de:'Wir betreuen Full-Funnel-Kampagnen auf Facebook und Instagram: Creatives, Zielgruppen, Pixel und CAPI, mit wöchentlichen Tests und ROAS-Reporting. Creatives erstellen wir mit.'},
     l:['meta-ads.html'],f:['tiktok','gads','price']},
    {id:'tiktok',k:['tiktok','snapchat','snap','short video','reels','تيك توك','سناب','سناب شات'],
     a:{en:'We create native-feeling TikTok videos, Spark Ads and creator content, and test hooks quickly to find winners. For the Gulf we also run Snapchat Ads.',
        ar:'ننتج فيديوهات TikTok بأسلوب طبيعي وSpark Ads ومحتوى مؤثرين، ونختبر بسرعة لإيجاد الإعلانات الرابحة. وفي الخليج ندير إعلانات Snapchat أيضًا.',
        de:'Wir produzieren native TikTok-Videos, Spark Ads und Creator-Content und testen Hooks schnell. Für den Golfraum auch Snapchat Ads.'},
     l:['tiktok-ads.html'],f:['meta','price']},
    {id:'website',k:['website','web development','web site','landing page','redesign','next.js','react','site','موقع','مواقع','تصميم موقع','صفحة هبوط','webseite','homepage','webdesign'],
     a:{en:'We design and build fast, custom, SEO-ready websites — typically 3–6 weeks for a corporate site. Bilingual builds (English, Arabic RTL, German), an easy CMS, hosting and care plans are available.',
        ar:'نصمم ونبني مواقع سريعة ومخصصة وجاهزة لـ SEO — عادةً 3–6 أسابيع لموقع الشركة. نوفر مواقع ثنائية اللغة (عربي من اليمين لليسار وإنجليزي)، ونظام إدارة سهل، واستضافة وصيانة.',
        de:'Wir gestalten und entwickeln schnelle, individuelle, SEO-fertige Websites — meist 3–6 Wochen für eine Unternehmensseite. Mehrsprachig, mit einfachem CMS, Hosting und Wartung.'},
     l:['web-development.html','ui-ux-design.html'],f:['wordpress','time','estimate']},
    {id:'wordpress',k:['wordpress','wp','elementor','woocommerce','plugin','theme','ووردبريس','وردبريس'],
     a:{en:'We build custom WordPress themes and plugins, WooCommerce stores, speed optimisation and security hardening, plus monthly maintenance plans.',ar:'نبني قوالب وإضافات WordPress مخصصة ومتاجر WooCommerce، مع تحسين السرعة والحماية وخطط صيانة شهرية.',de:'Wir entwickeln individuelle WordPress-Themes und -Plugins, WooCommerce-Shops, Speed-Optimierung und Sicherheits-Härtung — plus monatliche Wartung.'},
     l:['wordpress-development.html'],f:['website','support']},
    {id:'shop',k:['shopify','ecommerce','e-commerce','online store','store','shop','متجر','متجر إلكتروني','شوبيفاي','onlineshop'],
     a:{en:'We build Shopify and WooCommerce stores with high-converting product pages, payments, shipping, email flows and full tracking — and we can run the ads and SEO afterwards.',ar:'نبني متاجر Shopify وWooCommerce بصفحات منتجات عالية التحويل والدفع والشحن ورسائل البريد والتتبع الكامل — ثم ندير الإعلانات وSEO.',de:'Wir bauen Shopify- und WooCommerce-Shops mit konvertierenden Produktseiten, Payment, Versand, E-Mail-Flows und Tracking — und übernehmen danach Ads und SEO.'},
     l:['ecommerce-development.html'],f:['meta','seo','estimate']},
    {id:'app',k:['app','apps','mobile','android','ios','iphone','flutter','react native','play store','app store','تطبيق','تطبيقات','أندرويد','ايفون'],
     a:{en:'We build iOS and Android apps with Flutter or React Native (native when needed), including backend, payments, push notifications, and App Store / Play Store launch.',ar:'نبني تطبيقات iOS وAndroid بـ Flutter أو React Native (أو Native عند الحاجة) مع الخلفية والدفع والإشعارات والنشر على المتاجر.',de:'Wir entwickeln iOS- und Android-Apps mit Flutter oder React Native (bei Bedarf nativ) inkl. Backend, Payment, Push und Store-Launch.'},
     l:['mobile-apps.html'],f:['software','estimate']},
    {id:'software',k:['software','saas','mvp','portal','dashboard','crm','erp','system','platform','web app','برمجيات','برنامج','نظام','منصة','لوحة تحكم','plattform','individualsoftware'],
     a:{en:'We design and build custom software and SaaS — from MVPs to enterprise platforms — with secure APIs, cloud infrastructure, integrations and QA. You get full code and IP ownership. Dedicated teams are available monthly.',
        ar:'نصمم ونبني برمجيات مخصصة وSaaS — من MVP إلى منصات المؤسسات — مع APIs آمنة وبنية سحابية وتكاملات واختبار. تملك الكود والملكية الفكرية بالكامل، ويتوفر فريق مخصص شهريًا.',
        de:'Wir entwickeln Individualsoftware und SaaS — vom MVP bis zur Enterprise-Plattform — mit sicheren APIs, Cloud, Integrationen und QA. Code und IP gehören Ihnen. Dedizierte Teams monatlich.'},
     l:['custom-software.html'],f:['team','own','estimate']},
    {id:'design',k:['ui','ux','design','figma','prototype','branding','تصميم','واجهة','هوية','gestaltung','prototyp'],
     a:{en:'Our UI/UX team designs websites and products in Figma — research, wireframes, clickable prototypes and a design system your developers can build from.',ar:'فريق UI/UX يصمم المواقع والمنتجات على Figma — بحث ومخططات ونماذج قابلة للتجربة ونظام تصميم جاهز للتطوير.',de:'Unser UI/UX-Team gestaltet Websites und Produkte in Figma — Research, Wireframes, klickbare Prototypen und ein Designsystem.'},
     l:['ui-ux-design.html'],f:['website','software']},
    {id:'ai',k:['ai','chatbot','chat bot','automation','automate','gpt','chatgpt','claude','bot','whatsapp bot','agent','ذكاء اصطناعي','الذكاء الاصطناعي','روبوت','شات بوت','أتمتة','ki','automatisierung'],
     a:{en:'We build AI chatbots for websites and WhatsApp (official Business API), trained on your services, prices and documents — plus workflow automation that connects your apps and removes repetitive work. Like this assistant, but trained on your business.',
        ar:'نبني روبوتات دردشة ذكية للموقع وواتساب (عبر API الرسمي) مدربة على خدماتك وأسعارك ومستنداتك — مع أتمتة تربط تطبيقاتك وتزيل المهام المتكررة. مثل هذا المساعد، لكن مدرب على عملك.',
        de:'Wir bauen KI-Chatbots für Website und WhatsApp (offizielle Business API), trainiert auf Ihre Leistungen, Preise und Dokumente — plus Workflow-Automatisierung. Wie dieser Assistent, nur für Ihr Unternehmen.'},
     l:['ai-automation.html'],f:['price','estimate']},
    {id:'time',k:['time','how long','turnaround','deadline','fast','delivery','days','weeks','urgent','مدة','المدة','كم يستغرق','متى','سريع','أيام','dauer','wie lange','lieferzeit','schnell'],
     a:{en:'Typical timelines: guest posts 3–10 working days, technical SEO audit 5–10 days, corporate website 3–6 weeks, e-commerce store 4–8 weeks, ads live within a few days, MVP software 6–12 weeks. Larger projects are planned in milestones.',
        ar:'المدد المعتادة: مقالات الضيف 3–10 أيام عمل، تدقيق SEO التقني 5–10 أيام، موقع الشركة 3–6 أسابيع، المتجر 4–8 أسابيع، الإعلانات خلال أيام، وبرمجيات MVP من 6 إلى 12 أسبوعًا.',
        de:'Typische Zeiträume: Gastbeiträge 3–10 Werktage, technisches SEO-Audit 5–10 Tage, Unternehmenswebsite 3–6 Wochen, Shop 4–8 Wochen, Ads live in wenigen Tagen, MVP 6–12 Wochen.'},
     l:[],f:['price','process']},
    {id:'payment',k:['payment','pay','paypal','payoneer','wise','card','visa','mastercard','invoice','bank','transfer','الدفع','دفع','باي بال','فاتورة','بطاقة','zahlung','bezahlen','rechnung','überweisung'],
     a:{en:'We accept PayPal, Payoneer, Wise, Visa and Mastercard. Larger projects are billed in milestones, retainers monthly. You get an invoice for every payment.',ar:'نقبل PayPal وPayoneer وWise وVisa وMastercard. المشاريع الكبيرة تُدفع على مراحل والاشتراكات شهريًا، مع فاتورة لكل دفعة.',de:'Wir akzeptieren PayPal, Payoneer, Wise, Visa und Mastercard. Größere Projekte in Meilensteinen, Retainer monatlich — jeweils mit Rechnung.'},
     l:[],f:['refund','price']},
    {id:'refund',k:['refund','money back','replace','removed','استرداد','استرجاع','rückerstattung','geld zurück'],
     a:{en:'If an agreed placement can\'t be published, you choose a replacement or a refund. Links removed within the agreed guarantee period are replaced free. Project milestones are only billed once you approve them.',ar:'إذا تعذر نشر رابط متفق عليه تختار بديلًا أو استردادًا. الروابط المحذوفة خلال فترة الضمان تُستبدل مجانًا، ومراحل المشاريع تُدفع بعد موافقتك.',de:'Kann eine Platzierung nicht veröffentlicht werden, wählen Sie Ersatz oder Rückerstattung. Entfernte Links ersetzen wir in der Garantiezeit kostenlos. Meilensteine werden erst nach Freigabe berechnet.'},
     l:['refund-policy.html'],f:['payment','safe']},
    {id:'guarantee',k:['guarantee','guaranteed','results','case study','case studies','portfolio','examples','reviews','نتائج','ضمان','أعمالكم','نماذج','garantie','referenzen','ergebnisse','beispiele'],
     a:{en:'No honest company can guarantee Google rankings, so we don\'t. We commit to a clear plan, transparent reporting and measurable KPIs, and we\'re happy to walk you through relevant work and results on a call.',
        ar:'لا توجد شركة صادقة تضمن ترتيب Google، لذلك لا نفعل. نلتزم بخطة واضحة وتقارير شفافة ومؤشرات قابلة للقياس، ويسعدنا عرض أعمال ونتائج مشابهة في مكالمة.',
        de:'Seriös kann niemand Google-Rankings garantieren — wir auch nicht. Wir verpflichten uns zu einem klaren Plan, transparentem Reporting und messbaren KPIs und zeigen Ihnen gern passende Referenzen im Gespräch.'},
     l:['contact.html'],f:['process','human']},
    {id:'own',k:['own','ownership','source code','code','ip','intellectual property','account access','الملكية','الكود','حقوق','eigentum','quellcode','rechte'],
     a:{en:'You own everything: websites, source code, designs, content and ad accounts. We work inside your accounts and transfer full IP on delivery.',ar:'كل شيء ملكك: المواقع والكود والتصاميم والمحتوى وحسابات الإعلانات. نعمل داخل حساباتك وننقل الملكية الفكرية كاملة عند التسليم.',de:'Alles gehört Ihnen: Websites, Quellcode, Designs, Inhalte und Werbekonten. Wir arbeiten in Ihren Konten und übertragen die IP vollständig.'},
     l:[],f:['nda','software']},
    {id:'nda',k:['nda','confidential','privacy','secure','security','gdpr','dsgvo','data protection','سرية','اتفاقية عدم إفصاح','أمان','خصوصية','datenschutz','vertraulich','sicherheit','avv'],
     a:{en:'We\'re happy to sign an NDA before you share details. We follow least-access practices, keep client data private, and for EU clients can work GDPR-aligned with EU hosting and a data processing agreement.',ar:'يسعدنا توقيع اتفاقية عدم إفصاح قبل مشاركة التفاصيل. نطبق أقل صلاحيات ممكنة ونحافظ على سرية بياناتك.',de:'Gern unterschreiben wir vorab eine NDA. Wir arbeiten nach dem Need-to-know-Prinzip, auf Wunsch DSGVO-konform mit EU-Hosting und AVV.'},
     l:['privacy-policy.html'],f:['own','human']},
    {id:'process',k:['process','how do you work','how it works','steps','report','reporting','communication','updates','meeting','كيف تعملون','الخطوات','التقارير','التواصل','ablauf','wie arbeiten','prozess'],
     a:{en:'Four steps: Discover (your business, numbers, goals) → Strategy (roadmap, milestones, KPIs) → Build & launch (weekly progress you can see) → Measure & scale (transparent reporting). You get one dedicated point of contact and updates on WhatsApp, email or calls.',
        ar:'أربع خطوات: الاكتشاف (عملك وأرقامك وأهدافك) ← الاستراتيجية (خارطة ومراحل ومؤشرات) ← البناء والإطلاق (تقدم أسبوعي واضح) ← القياس والتوسع (تقارير شفافة). لديك مسؤول تواصل واحد وتحديثات عبر واتساب أو البريد أو المكالمات.',
        de:'Vier Schritte: Analyse → Strategie (Roadmap, Meilensteine, KPIs) → Umsetzung & Launch (wöchentlich sichtbarer Fortschritt) → Messen & skalieren. Ein fester Ansprechpartner, Updates per WhatsApp, E-Mail oder Call.'},
     l:['about.html'],f:['time','estimate']},
    {id:'support',k:['maintenance','support','hosting','host','server','update','bug','fix','دعم','صيانة','استضافة','wartung'],
     a:{en:'Yes — we offer hosting, monitoring, backups, security updates and monthly care plans for websites, stores and apps, or we deploy to your own servers.',ar:'نعم — نوفر الاستضافة والمراقبة والنسخ الاحتياطي وتحديثات الحماية وخطط صيانة شهرية للمواقع والمتاجر والتطبيقات، أو ننشر على خوادمك.',de:'Ja — Hosting, Monitoring, Backups, Sicherheitsupdates und monatliche Wartungspläne für Websites, Shops und Apps, oder Deployment auf Ihre Server.'},
     l:['wordpress-development.html'],f:['website','price']},
    {id:'team',k:['dedicated team','hire developer','hire developers','outsourcing','outsource','staff augmentation','فريق مخصص','توظيف مطور','تعهيد','dediziertes team','entwickler mieten'],
     a:{en:'You can hire a dedicated team — developers, designers, marketers, QA and a PM — working in your time zone as an extension of your company, billed monthly per seat. Scale up or down as needed.',ar:'يمكنك التعاقد مع فريق مخصص — مطورون ومصممون ومسوقون واختبار ومدير مشروع — يعمل حسب توقيتك كامتداد لشركتك، بفاتورة شهرية لكل عضو.',de:'Sie können ein dediziertes Team buchen — Entwickler, Designer, Marketer, QA und PM — in Ihrer Zeitzone, monatlich pro Person, flexibel skalierbar.'},
     l:['custom-software.html'],f:['software','price']},
    {id:'marketplace',k:['marketplace','publisher list','site list','sites list','metrics','sell links','become a publisher','publisher','سوق','قائمة المواقع','ناشر','marktplatz','seitenliste'],
     a:{en:'Our Marketplace lists vetted publishers with DR, DA, traffic, country and language, and the Smart Finder scores sites for your niche. Own a website? Apply on our “Become a Publisher” page.',ar:'سوق الناشرين يعرض مواقع موثوقة مع DR وDA والزيارات والدولة واللغة، والباحث الذكي يقيّم المواقع حسب مجالك. لديك موقع؟ قدّم في صفحة «انضم كناشر».',de:'Unser Marktplatz listet geprüfte Publisher mit DR, DA, Traffic, Land und Sprache; der Smart Finder bewertet Seiten für Ihre Nische. Eigene Website? Bewerben Sie sich als Publisher.'},
     l:['marketplace.html','smart-finder.html','publishers.html'],f:['links','price']},
    {id:'audit',k:['free audit','audit','consultation','free call','strategy call','analysis','free','تدقيق مجاني','استشارة','مكالمة مجانية','مجاني','kostenlos','beratung','erstgespräch'],
     a:{en:'Yes — book a free strategy call and we\'ll review your site, ads or idea and suggest the fastest wins. You can also try our free SEO tools.',ar:'نعم — احجز مكالمة استراتيجية مجانية وسنراجع موقعك أو إعلاناتك أو فكرتك ونقترح أسرع المكاسب. يمكنك أيضًا تجربة أدوات SEO المجانية.',de:'Ja — buchen Sie ein kostenloses Strategiegespräch: Wir prüfen Website, Ads oder Idee und zeigen die schnellsten Hebel. Oder testen Sie unsere kostenlosen SEO-Tools.'},
     l:['contact.html','seo-tools.html'],f:['estimate','process']},
    {id:'langs',k:['arabic','german','urdu','language','languages','english','عربي','العربية','ألماني','لغة','deutsch','sprache','arabisch','englisch'],
     a:{en:'We work in English, Arabic and German (and Urdu). We build bilingual sites, write content and run ads in these languages.',ar:'نعمل بالعربية والإنجليزية والألمانية (والأردية). نبني مواقع ثنائية اللغة ونكتب المحتوى وندير الإعلانات بهذه اللغات.',de:'Wir arbeiten auf Deutsch, Englisch und Arabisch (sowie Urdu) — mehrsprachige Websites, Content und Ads.'},
     l:[],f:['website','seo']},
    {id:'where',k:['where','location','country','office','based','timezone','time zone','uae','dubai','saudi','usa','uk','germany','أين','موقعكم','مكتب','دولة','توقيت','الإمارات','السعودية','standort','büro','zeitzone','deutschland'],
     a:{en:'We are a global, remote-first company serving clients across North America, Europe, the Middle East and Asia — and we schedule calls in your time zone.',ar:'نحن شركة عالمية تعمل عن بُعد وتخدم العملاء في أمريكا الشمالية وأوروبا والشرق الأوسط وآسيا — ونحدد المكالمات حسب توقيتك.',de:'Wir sind ein globales Remote-first-Unternehmen mit Kunden in Nordamerika, Europa, Nahost und Asien — Termine in Ihrer Zeitzone.'},
     l:['about.html'],f:['human','process']},
    {id:'founder',k:['founder','owner','ceo','who are you','about you','company','nadeem','المؤسس','من أنتم','الرئيس التنفيذي','gründer','wer seid','über euch','inhaber'],
     a:{en:'MayoTechX was founded by Nadeem Mayo, a search, growth and web specialist with years of experience delivering SEO and link building for agencies in the US, UK and Canada. You can reach the CEO office at '+SITE.ceoEmail+'.',
        ar:'أسس MayoTechX نديم مايو، خبير البحث والنمو وتطوير المواقع بخبرة سنوات في تنفيذ SEO وبناء الروابط لوكالات في أمريكا وبريطانيا وكندا. مكتب الرئيس التنفيذي: '+SITE.ceoEmail+'.',
        de:'MayoTechX wurde von Nadeem Mayo gegründet — Spezialist für Suche, Wachstum und Web mit langjähriger Agentur-Erfahrung in den USA, UK und Kanada. CEO-Büro: '+SITE.ceoEmail+'.'},
     l:['about.html'],f:['process','human']},
    {id:'jobs',k:['job','jobs','career','careers','vacancy','hiring','intern','cv','resume','وظيفة','وظائف','توظيف','سيرة ذاتية','karriere','stelle','bewerbung'],
     a:{en:'We\'re always happy to meet great people. Send your CV and portfolio to '+SITE.email+' with the role in the subject line.',ar:'يسعدنا التعرف على المواهب. أرسل سيرتك الذاتية وأعمالك إلى '+SITE.email+' مع ذكر الوظيفة في العنوان.',de:'Wir lernen gern gute Leute kennen. Senden Sie CV und Portfolio an '+SITE.email+' mit der Rolle im Betreff.'},
     l:[],f:['founder']},
    {id:'discount',k:['discount','cheap','cheaper','deal','coupon','خصم','أرخص','عرض خاص','rabatt','günstig','gutschein'],
     a:{en:'We focus on value rather than the lowest price, but bundles (e.g. website + SEO, or ads + landing pages), retainers and volume link orders come with better rates. Ask the team for a bundle quote.',ar:'نركز على القيمة لا أقل سعر، لكن الباقات (موقع + SEO أو إعلانات + صفحات هبوط) والاشتراكات وطلبات الروابط الكبيرة لها أسعار أفضل. اطلب عرض باقة من الفريق.',de:'Wir setzen auf Wert statt Billigpreis — Bundles (z. B. Website + SEO), Retainer und größere Linkpakete erhalten aber bessere Konditionen. Fragen Sie nach einem Bundle-Angebot.'},
     l:['packages.html'],f:['estimate','price']},
    {id:'human',k:['contact','whatsapp','email','call','phone','talk','human','person','representative','reach','تواصل','واتساب','اتصال','بريد','شخص','موظف','kontakt','anrufen','mensch','telefon','e-mail'],
     a:{en:'You can reach our team directly on WhatsApp at '+SITE.phone+' or by email at '+SITE.email+'. We reply seven days a week, usually within minutes.',ar:'يمكنك التواصل مع فريقنا مباشرة على واتساب '+SITE.phone+' أو عبر البريد '+SITE.email+'. نرد سبعة أيام في الأسبوع، غالبًا خلال دقائق.',de:'Sie erreichen unser Team direkt per WhatsApp unter '+SITE.phone+' oder per E-Mail an '+SITE.email+' — 7 Tage die Woche, meist innerhalb von Minuten.'},
     l:['contact.html'],f:['estimate']},
    {id:'thanks',k:['thanks','thank you','thx','bye','شكرا','شكرًا','مع السلامة','danke','tschüss'],
     a:{en:'You\'re welcome! If anything else comes up, I\'m here — or message the team on WhatsApp anytime.',ar:'على الرحب والسعة! إن احتجت أي شيء آخر فأنا هنا — أو راسل الفريق على واتساب في أي وقت.',de:'Gern geschehen! Bei weiteren Fragen bin ich da — oder schreiben Sie dem Team jederzeit per WhatsApp.'},l:[],f:[]},
    {id:'hello',k:['hello','hi','hey','salam','assalam','good morning','good evening','مرحبا','السلام عليكم','أهلا','هلا','hallo','guten tag','servus','moin'],
     a:{en:'Hello! Ask me about SEO, links, ads, websites, apps, software or AI — or tap “Get an estimate” for a quick quote.',ar:'أهلًا بك! اسألني عن SEO والروابط والإعلانات والمواقع والتطبيقات والبرمجيات والذكاء الاصطناعي — أو اضغط «احصل على تقدير».',de:'Hallo! Fragen Sie mich zu SEO, Links, Ads, Websites, Apps, Software oder KI — oder tippen Sie auf „Schätzung erhalten“.'},
     l:[],f:['offer','estimate']}
  ];
  var FOLLOW={
    price:{en:'How much does it cost?',ar:'كم التكلفة؟',de:'Was kostet das?'},estimate:{en:'Get an estimate',ar:'احصل على تقدير',de:'Schätzung erhalten'},
    website:{en:'Build a website',ar:'بناء موقع',de:'Website erstellen'},ai:{en:'AI chatbot',ar:'روبوت دردشة',de:'KI-Chatbot'},links:{en:'Guest posts & links',ar:'مقالات الضيف والروابط',de:'Gastbeiträge & Links'},
    content:{en:'Content writing',ar:'كتابة المحتوى',de:'Content'},guarantee:{en:'Do you guarantee results?',ar:'هل تضمنون النتائج؟',de:'Garantieren Sie Ergebnisse?'},seo:{en:'SEO',ar:'SEO',de:'SEO'},
    safe:{en:'Are links safe?',ar:'هل الروابط آمنة؟',de:'Sind die Links sicher?'},pr:{en:'Digital PR',ar:'العلاقات العامة',de:'Digital PR'},meta:{en:'Meta Ads',ar:'إعلانات Meta',de:'Meta Ads'},gads:{en:'Google Ads',ar:'إعلانات Google',de:'Google Ads'},
    tiktok:{en:'TikTok / Snapchat',ar:'TikTok / Snapchat',de:'TikTok / Snapchat'},wordpress:{en:'WordPress',ar:'WordPress',de:'WordPress'},time:{en:'How long does it take?',ar:'كم المدة؟',de:'Wie lange dauert es?'},
    support:{en:'Hosting & support',ar:'الاستضافة والدعم',de:'Hosting & Support'},software:{en:'Custom software',ar:'برمجيات مخصصة',de:'Individualsoftware'},team:{en:'Dedicated team',ar:'فريق مخصص',de:'Dediziertes Team'},
    own:{en:'Who owns the code?',ar:'من يملك الكود؟',de:'Wem gehört der Code?'},nda:{en:'Can you sign an NDA?',ar:'هل توقعون اتفاقية سرية؟',de:'Unterschreiben Sie eine NDA?'},payment:{en:'Payment methods',ar:'طرق الدفع',de:'Zahlungsarten'},
    refund:{en:'Refunds & guarantee',ar:'الاسترداد والضمان',de:'Rückerstattung & Garantie'},process:{en:'How do you work?',ar:'كيف تعملون؟',de:'Wie arbeiten Sie?'},human:{en:'Talk to a human',ar:'تحدث مع شخص',de:'Mit einem Menschen sprechen'},
    offer:{en:'What do you offer?',ar:'ماذا تقدمون؟',de:'Was bieten Sie an?'},founder:{en:'Who founded MayoTechX?',ar:'من أسس الشركة؟',de:'Wer hat MayoTechX gegründet?'}
  };

  /* ---------- merge extra languages (assistant-i18n.js) ---------- */
  (function(X){ if(!X) return; Object.keys(X).forEach(function(lg){ var d=X[lg];
    if(d.ui) Object.keys(d.ui).forEach(function(k){ if(UI[k]) UI[k][lg]=d.ui[k]; });
    if(d.pg) Object.keys(d.pg).forEach(function(k){ if(PG[k]) PG[k][lg]=d.pg[k]; });
    if(d.follow) Object.keys(d.follow).forEach(function(k){ if(FOLLOW[k]) FOLLOW[k][lg]=d.follow[k]; });
    KB.forEach(function(e){ if(d.a&&d.a[e.id]) e.a[lg]=d.a[e.id]; if(d.k&&d.k[e.id]) e.k=e.k.concat(d.k[e.id]); });
  }); })(window.MX_I18N);

  /* ---------- matching ---------- */
  function norm(s){return String(s).toLowerCase().replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[?!.,؟،;:()"'“”„«»\/-]/g,' ').replace(/\s+/g,' ').trim()}
  function lev(a,b){ if(Math.abs(a.length-b.length)>1) return 2; var m=[],i,j; for(i=0;i<=a.length;i++){m[i]=[i]} for(j=0;j<=b.length;j++){m[0][j]=j}
    for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++){m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1))} return m[a.length][b.length]; }
  function score(q,e){
    var nq=norm(q), s=' '+nq+' ', words=nq.split(' '), sc=0;
    e.k.forEach(function(k){ var nk=norm(k);
      if(/[\u3040-\u30ff\u4e00-\u9fff]/.test(nk)){ if(nq.indexOf(nk)>=0) sc+=2.5; return; }
      if(s.indexOf(' '+nk+' ')>=0||(nk.length>=3&&s.indexOf(' '+nk+'s ')>=0)||s.indexOf(' ال'+nk+' ')>=0) sc+= nk.indexOf(' ')>0?4:(nk.length>=3?2.5:1.5);
      else if(nk.length>=6&&s.indexOf(nk)>=0) sc+=1.5;
      else if(nk.indexOf(' ')<0&&nk.length>=5){ for(var i=0;i<words.length;i++){ if(words[i].length>=5&&lev(words[i],nk)<=1){sc+=1.5;break;} } }
    });
    return sc;
  }
  function answer(q){
    var res=KB.map(function(e){return {e:e,s:score(q,e)}}).filter(function(r){return r.s>0}).sort(function(a,b){return b.s-a.s});
    if(!res.length) return null;
    var top=res[0].e; if(top.id==='hello'&&res.length>1&&res[1].s>=2) top=res[1].e;
    var alt=res.slice(1,3).map(function(r){return r.e.id}).filter(function(id){return id!==top.id&&id!=='hello'&&id!=='thanks'});
    return {e:top,alt:alt};
  }

  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function wa(t){return 'https://wa.me/'+SITE.whatsapp+'?text='+encodeURIComponent(t)}
  function ss(k,v){try{ if(v===undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k,v);}catch(e){return null}}

  function init(){
    if(SITE.chatbaseId){ window.embeddedChatbotConfig={chatbotId:SITE.chatbaseId,domain:'www.chatbase.co'}; var sc=document.createElement('script'); sc.src='https://www.chatbase.co/embed.min.js'; sc.defer=true; sc.setAttribute('chatbotId',SITE.chatbaseId); sc.setAttribute('domain','www.chatbase.co'); document.body.appendChild(sc); return; }
    var btn=document.createElement('button'); btn.className='ai-launch'; btn.type='button'; btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-controls','aiPanel');
    btn.innerHTML='<span class="ai-dot"><i class="fas fa-wand-magic-sparkles"></i></span><span class="lbl">'+esc(T(UI.launch))+'</span>';
    var p=document.createElement('section'); p.className='ai-panel'; p.id='aiPanel'; p.setAttribute('aria-label',T(UI.title));
    p.innerHTML='<div class="ai-head"><span class="ai-dot"><i class="fas fa-wand-magic-sparkles"></i></span><div><b>'+esc(T(UI.title))+'</b><small><i class="ai-on"></i>'+esc(T(UI.sub))+'</small></div><button type="button" class="ai-x" aria-label="Close"><i class="fas fa-xmark"></i></button></div>'+
      '<div class="ai-log" id="aiLog" aria-live="polite"></div><div class="ai-chips" id="aiChips"></div>'+
      '<form class="ai-form"><input id="aiIn" autocomplete="off" placeholder="'+esc(T(UI.ph))+'" aria-label="'+esc(T(UI.ph))+'"><button type="submit" aria-label="Send"><i class="fas fa-paper-plane"></i></button></form>'+
      '<a class="ai-tr" id="aiTr" target="_blank" rel="noopener" href="#"><i class="fab fa-whatsapp"></i> '+esc(T(UI.transcript))+'</a>';
    document.body.appendChild(p); document.body.appendChild(btn);
    var log=p.querySelector('#aiLog'), inp=p.querySelector('#aiIn'), chipsEl=p.querySelector('#aiChips'), tr=p.querySelector('#aiTr');
    var hist=[], est=null, tip=null, opened=false;

    function add(html,who,text){var d=document.createElement('div');d.className='msg '+who;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight; if(text) hist.push((who==='me'?'Me: ':'Bot: ')+text); updTr(); return d}
    function updTr(){ tr.href=wa('Hi MayoTechX, here is my chat from your website:\n\n'+hist.slice(-12).join('\n')); tr.style.display=hist.length>2?'flex':'none'; }
    function setChips(list){ chipsEl.innerHTML=''; list.forEach(function(c){ var b=document.createElement('button'); b.type='button'; b.textContent=c.label; b.addEventListener('click',function(){ if(c.fn) c.fn(); else ask(c.label); }); chipsEl.appendChild(b); }); }
    function defaultChips(){ setChips(T(UI.chips).map(function(x,i){ return {label:x,fn:i===0?function(){add(esc(x),'me',x);startEst()}:null}; })); }
    function links(arr){ return arr&&arr.length?'<div class="ai-links">'+arr.map(function(s){return '<a href="'+href(s)+'">'+esc(T(PG[s])||s)+' <i class="fas fa-arrow-right"></i></a>'}).join('')+'</div>':''; }
    function typing(cb){ var t=add('<span class="typing"><i></i><i></i><i></i></span>','bot'); setTimeout(function(){cb(t);log.scrollTop=log.scrollHeight},480); }
    function botSay(txt){ typing(function(t){ t.innerHTML=esc(txt); hist.push('Bot: '+txt); updTr(); }); }

    function ask(q){
      if(!q||!q.trim()) return; add(esc(q),'me',q); inp.value='';
      if(est) return estStep(q);
      if(/estimate|quote me|تقدير|schätzung/.test(norm(q))) return startEst();
      typing(function(t){
        var r=answer(q), ans, html;
        if(r){ ans=T(r.e.a); html=esc(ans)+links(r.e.l)+'<a class="btn btn-wa btn-sm ai-wa" target="_blank" rel="noopener" href="'+wa('Hi MayoTechX, '+q)+'"><i class="fab fa-whatsapp"></i> '+esc(T(UI.ask_team))+'</a>';
          var f=(r.e.f||[]).concat(r.alt||[]).filter(function(x,i,a){return a.indexOf(x)===i&&x!==r.e.id&&FOLLOW[x]}).slice(0,4);
          if(f.length) setChips(f.map(function(id){ var lb=T(FOLLOW[id]); return {label:lb,fn:id==='estimate'?function(){add(esc(lb),'me',lb);startEst()}:null}; })); else defaultChips();
        } else { ans=T(UI.unknown); html=esc(ans)+'<a class="btn btn-wa btn-sm ai-wa" target="_blank" rel="noopener" href="'+wa('Hi MayoTechX, I have a question: '+q)+'"><i class="fab fa-whatsapp"></i> '+esc(T(UI.send_team))+'</a>'; defaultChips(); }
        t.innerHTML=html; hist.push('Bot: '+ans); updTr();
      });
    }

    /* ---------- guided estimate ---------- */
    function pick(list){ setChips(list.map(function(x){return {label:x,fn:function(){add(esc(x),'me',x);estStep(x)}}})); }
    function startEst(){ est={step:1}; botSay(T(UI.est_q1)); pick(T(UI.svc)); }
    function estStep(v){
      if(est.step===1){ est.svc=v; est.step=2; botSay(T(UI.est_q2)); pick(T(UI.bud)); }
      else if(est.step===2){ est.bud=v; est.step=3; botSay(T(UI.est_q3)); pick(T(UI.time)); }
      else if(est.step===3){ est.time=v; est.step=4; botSay(T(UI.est_q4)); setChips([{label:T(UI.skip),fn:function(){estStep('')}}]); }
      else { est.who=v; var e=est; est=null;
        var msg='*New project brief — mayotechx.com*\n• Service: '+e.svc+'\n• Budget: '+e.bud+'\n• Timeline: '+e.time+(e.who?'\n• Name / company: '+e.who:'')+'\n• Page: '+location.pathname;
        typing(function(t){ t.innerHTML=esc(T(UI.est_done))+'<div class="ai-brief"><b>'+esc(e.svc)+'</b><span>'+esc(e.bud)+' · '+esc(e.time)+'</span>'+(e.who?'<span>'+esc(e.who)+'</span>':'')+'</div><a class="btn btn-gold btn-sm ai-wa" target="_blank" rel="noopener" href="'+wa(msg)+'"><i class="fab fa-whatsapp"></i> '+esc(T(UI.est_send))+'</a>'; hist.push('Bot: brief ready'); updTr(); });
        defaultChips(); }
    }

    function toggle(o){ p.classList.toggle('open',o); btn.setAttribute('aria-expanded',o); btn.classList.toggle('on',o); if(tip){tip.remove();tip=null;}
      if(o){ ss('mxAiSeen','1'); if(!opened){opened=true; add(esc(T(UI.hello)),'bot',T(UI.hello)); defaultChips();} setTimeout(function(){inp.focus()},200);} }
    btn.addEventListener('click',function(){toggle(!p.classList.contains('open'))});
    p.querySelector('.ai-x').addEventListener('click',function(){toggle(false)});
    p.querySelector('.ai-form').addEventListener('submit',function(e){e.preventDefault();ask(inp.value)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape') toggle(false)});
    document.querySelectorAll('[data-ask]').forEach(function(el){ el.addEventListener('click',function(ev){ ev.preventDefault(); toggle(true); var q=el.getAttribute('data-ask'); setTimeout(function(){ if(q==='estimate') startEst(); else ask(q); },300); }); });

    /* one-time greeting bubble */
    if(!ss('mxAiSeen')) setTimeout(function(){ if(opened) return; tip=document.createElement('button'); tip.type='button'; tip.className='ai-tip'; tip.textContent=T(UI.tip); tip.addEventListener('click',function(){toggle(true)}); document.body.appendChild(tip); setTimeout(function(){ if(tip){tip.remove();tip=null;} },9000); },7000);
  }
  document.addEventListener('DOMContentLoaded',init);
  window.MXAssistantAnswer=answer;
})();
