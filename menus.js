/* i-Snex menu data. De Specht: official 2026 afhaalmenu PDF. Bie Immink: menu text supplied by IPEX, prices incl. VAT. Kebab van Erhan: confirmed assortment, prices not publicly listed. */
(() => {
  const item = (name, price, options = null, description = '', unit = '') => ({ name, price, options, description, unit });
  const select = (label, choices, required = true) => ({ label, type: 'select', choices, required });
  const toggle = (label, choices) => ({ label, type: 'toggle', choices, required: true });
  const extra = (label, choices) => ({ label, type: 'checks', choices, required: false });
  const categories = (data) => Object.entries(data).map(([name, items]) => ({ name, items }));

  window.ISNEX_MENUS = {
    specht: {
      name: 'Cafetaria De Specht', short: 'De Specht', town: 'Goor', emoji: '🍟', accent: '#d98a3b', className: 'specht',
      description: 'Cafetaria & lunchroom · van patat en snacks tot broodjes, burgers en complete menu’s.',
      sourceUrl: 'https://cafetariadespecht.nl/wp-content/uploads/2026/10/A3_Afhaalmenu_2026_compressed.pdf',
      sourceLabel: 'Officiële afhaalkaart · 2026',
      heroImage: 'https://cafetariadespecht.nl/wp-content/uploads/2024/11/De-Specht-12.jpg',
      categories: categories({
        'Patat & aardappels': [
          item('Patat klein',2.70), item('Patat middel',3.00), item('Patat groot',3.40), item('Familiezak 4 personen',12.00),
          item('Aardappelschijfjes',3.60), item('Krulfriet',3.60),
          item('Grote patat Waterfiets',7.60,null,'Patat speciaal met 2 frikandellen'),
          item('Grote patat Huifkar',7.60,null,'Patat oorlog met 2 bamischijven')
        ],
        'Patat specialiteiten': [
          item('Boerensaus',6.75,null,'Met paprika, spek, uien en champignons in saus'), item('Stoofvlees',6.75,null,'Met bosui'),
          item('Grote patat beenham',8.50,null,'Met honingmosterdsaus en gedroogde ui'), item('Grote patat shoarma',9.75,{options:[select('Saus',['Knoflooksaus','Whiskeysaus'])]},'Met bosui en saus naar keuze'),
          item('Grote patat chili chicken',9.00,null,'Met kipfilet, paprika, spek, uien, champignons, BBQ-saus en geraspte kaas'),
          item('Grote patat pulled pork',9.00,null,'Met BBQ-saus en ui'), item('Kapsalon',10.50,{options:[select('Saus',['Knoflooksaus','Whiskeysaus','Anders / opmerking'],false)]},'Met shoarma, kaas, groente, ui en saus naar keuze'),
          item('Truffelfriet Italiaanse kaas',8.00,null,'Grote patat met truffelmayonaise, Italiaanse kaas en bosui')
        ],
        'Sausjes': [
          ...['Mayonaise','Curry','Ketchup','Speciaal','Oorlog','Pindasaus','Joppiesaus','Mosterd','Vlammen saus','Huisgemaakte ravigotesaus','Honingmosterdsaus','Peper saus','BBQ saus','Jamballasaus','Shaslicksaus','Zigeuner-/Jägersaus','Knoflooksaus','Appelmoes','Champignonsaus','Zoetzure saus','Whiskeysaus','Brandermayonaise','Truffelmayonaise'].map(n=>item(n,null,{options:[select('Formaat',['Halve koffiebeker','Koffiebeker'])]},'Prijs niet vermeld op de afhaalkaart 2026'))
        ],
        'Snacks': [
          ...[['Frikandel',2.20],['Frikandel speciaal',3.00],['XXL frikandel',3.55],['XXL frikandel speciaal',4.85],['Viandel',2.65],['Kroket',2.25],['Van Dobben kroket',2.75],['Kalfskroket',2.75],['Goulashkroket',2.75],['Satékroket',2.75],['Bamischijf',2.50],['Pittige bamischijf',2.75],['Nasischijf',2.35],['Berehap',3.25],['Gehaktbal',3.80],['Boerenbrok',2.75],['Hete donder',2.75],['Picanto',2.75],['Mexicano',2.75],['Trio',2.75],['Loempia',3.65],['Vietnamese loempia’s (2 st.)',3.25],['Braadworst',2.95],['Knakworst',2.30],['Shoarmarol',2.75],['Satérol',2.55],['Smulrol',2.75],['Kaassoufflé',2.45],['XXL kaassoufflé',3.15],['Kipcorn',2.60],['Kikastick',2.75],['Ragouzi',2.65],['Kaaskroket',2.55],['Eierbal',3.05]].map(([n,p])=>item(n,p))
        ],
        'Bittergarnituur': [
          ...[['Mini snacks (8 st.)',4.50],['Hotwings (6 st.)',4.60],['Bitterballen (6 st.)',3.40],['Kipnuggets (8 st.)',3.50],['Chickenstrips (4 st.)',3.65],['Uienringen (8 st.)',3.10],['Vlammetjes (6 st.)',3.40],['Torpedo garnalen (6 st.)',7.00],['Bucket: hotwings, strips & nuggets',12.95]].map(([n,p])=>item(n,p, n==='Bucket: hotwings, strips & nuggets'?{options:[select('Saus',['Mayonaise','Curry','Knoflooksaus','BBQ saus'])]}:null))
        ],
        'Vleesgerechten': [
          item('Spareribs portie',11.00), item('Spareribs XXL portie',16.00),
          item('Halve haan',8.00), item('Varkensschnitzel',6.00), item('Kipschnitzel van de bakplaat',7.50,{options:[select('Saus',['Champignonsaus','Jägersaus','Zigeunersaus','Peper saus'])]}),
          item('Shaslick (190 gr.)',6.50), item('Saté kip',7.25)
        ],
        'Vegetarische snacks': [item('Loempia',3.60),item('Bamischijf',2.70),item('Groentekroket',2.75),item('Mini loempia’s (6 st.)',3.50)],
        'Glutenvrije mogelijkheden': [item('Patat',2.70),item('Kroket',3.10),item('Frikandel',3.10)],
        'Menu’s': [
          item('Kip schnitzel menu',15.00,{options:[select('Saus',['Champignonsaus','Jägersaus','Zigeunersaus','Peper saus'])]},'Geserveerd met patat en slaatje'),
          item('Saté kip menu',14.50,null,'Inclusief satésaus · met patat en slaatje'), item('Halve haan menu',16.00,null,'Met patat en slaatje'),
          item('Hotwings menu (6 st.)',14.00,null,'Met patat en slaatje'), item('Wings en ribs menu',16.00,null,'4 hotwings en ½ spareribs'),
          item('Varkensschnitzel menu',14.00,{options:[select('Saus',['Champignonsaus','Jägersaus','Zigeunersaus','Peper saus'])]}),
          item('Shaslick menu',14.50,null,'190 gr. · shaslicksaus'), item('Pulled pork menu',14.50,null,'Inclusief BBQ-saus en ui'),
          item('Shoarma menu',16.00,{options:[select('Saus',['Knoflooksaus','Whiskeysaus'])]}), item('Bouwvakkers menu',14.00,null,'Gehaktbal'),
          item('Boerenfriet menu',14.50,null,'Gebakken ei, spek, paprika, champignons en ui in saus'), item('Torpedo garnalen menu',14.00,null,'6 stuks · krokante korst, chilisaus'),
          item('Spare-ribs menu',16.00), item('Spare-ribs XXL menu',21.00), item('Juul’s Special',19.50,null,'Iberico ribfingers, Korean BBQ-saus, gedroogde ui, bosui en sla'),
          item('Kidsbox De Bonte Specht',8.50,{options:[select('Snack',['Frikandel','Kroket','Kipnuggets','Bitterballen']),select('Drinken',['Sisi','Cola','Appelsap'])]},'Patat, mayonaise, ketchup, druifjes en een cadeautje')
        ],
        'Broodjes koud': [
          item('Stoete zalm',8.00,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin'])]},'Gerookte zalm, guacamole, rode ui, sla en dillemayonaise'),
          item('Stoete tonijn',8.00,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin'])]},'Tonijn, tonijnmayonaise, kappertjes, rode ui, augurk, sla en tomaat'),
          item('Stoete burrata',8.00,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin']),extra('Extra',['Serranoham + €2,50'])]},'Burrata, cherrytomaat, groene pesto, sla, rode ui, balsamico en zonnebloempitten'),
          item('Stoete Good te Passe',6.75,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin'])]},'Ham, sla, kaas, tomaat, komkommer, ei, rundvleessalade en ravigotesaus'),
          item('Stoete Brie van Mie',7.50,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin']),select('Bereiding',['Normaal','Vegetarisch'])]},'Brie, honing, walnoten, tijm, sla en uitgebakken spek'),
          item('Kip’n op stoete',8.00,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin'])]},'Gerookte kip, uitgebakken spek, pestomayonaise, zongedroogde tomaat, sla en zonnebloempitten'),
          item('Stoete rauw fleish',7.50,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin'])]},'Filet Americain, sla, gekookt ei, dillesaus en rode ui'),
          item('Stoete rosbief',7.50,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin'])]},'Rosbief, Parmezaan, zongedroogde tomaat, truffelmayonaise en sla'),
          item('Stoete carpaccio',8.75,{options:[select('Broodkeuze',['Waldkorn','Brioche brood','Italiaanse bol','Baguette wit','Ciabatta bruin']),select('Saus',['Truffelmayonaise','Pestomayonaise'])]},'Rundercarpaccio, pijnboompitten, zongedroogde tomaat, sla en Parmezaan')
        ],
        'Broodjes warm': [
          item('Indy’s Special',9.00,null,'Brioche, chickenstrips, sla, komkommer, rode ui, Parmezaan en jamballasaus'),
          item('Tuna Melt',9.95,null,'Baguette, tonijnsalade, kappertjes, rode ui, augurk, tonijnmayonaise, sla en tomaat; burrata uit de oven'),
          item('Juul’s Special',9.00,null,'Iberico ribfingers, Korean BBQ-saus, gedroogde ui, bosui en sla'),
          item('Baguette chili chicken',9.00,null,'Kipfilet, spek, kaas, champignons, paprika, ui, sla en chilisaus'),
          item('Baguette mexicano',5.25,null,'Sla, rode ui en jamballasaus'),
          item('Broodje gehaktbal',5.00),item('Broodje kroketburger',3.65),item('Broodje Van Dobben kroket',3.65),
          item('Flaguette pulled pork',7.95,null,'Sla, ui en BBQ-saus'),item('Baguette beenham',6.95,null,'Honingmosterdsaus'),
          item('Flaguette shoarma',7.95,{options:[select('Saus',['Knoflooksaus','Whiskeysaus'])]},'Met bosui en sla'),
          item('Tosti ham/kaas',5.00,null,'Ketchup en garnituur'),item('Broodje kipburger',3.75),item('Cheeseburger',3.95)
        ],
        'Burgers los': [
          item('Beefburger los',null,null,'Burger ook los verkrijgbaar; losse prijs niet vermeld op de afhaalkaart 2026'),
          item('Big Nick burger los',null,null,'Losse prijs niet vermeld op de afhaalkaart 2026'),
          item('Guacamole burger los',null,null,'Losse prijs niet vermeld op de afhaalkaart 2026'),
          item('BBQ chicken burger los',null,null,'Losse prijs niet vermeld op de afhaalkaart 2026'),
          item('Vega burger los',null,null,'Losse prijs niet vermeld op de afhaalkaart 2026'),
          item('Spechtburger los',null,null,'Losse prijs niet vermeld op de afhaalkaart 2026'),
          item('Hamburger los',null,null,'Losse prijs niet vermeld op de afhaalkaart 2026')
        ],
        'Burgermenu’s': [
          item('Beefburger menu',14.50,null,'Runderburger met relish, spek, augurk, tomaat, sla, rode ui, ei en kaas'),
          item('Big Nick burger menu',14.50,null,'Brandermayonaise, sla, spek, tomaat, augurk, kaas en gefrituurde uienringen'),
          item('Guacamole burger menu',14.50,null,'Runderburger met guacamole, burrata, spek, augurk, tomaat, sla en rode ui'),
          item('BBQ chicken burger menu',14.50,null,'Kipburger met tomaat, sla, kaas, gekarameliseerde ui, spek en BBQ-saus'),
          item('Vega burger menu',12.00,null,'Spinazie-kaasburger met Heksenkaas, pijnboompitten, Parmezaan, tomaat en sla'),
          item('Spechtburger menu',12.50,null,'Gepaneerde varkensburger met sla, curry, gedroogde ui en remouladesaus'),
          item('Hamburger menu',12.50,null,'Varkens-/runderburger met sla en speciaalsaus')
        ],
        'Maaltijdsalades': [
          item('Zalm salade',11.00,null,'Gerookte zalm, komkommer, ei, mosterd-dille dressing, rode ui, kappertjes, cherrytomaat en Parmezaan'),
          item('Rundercarpaccio salade',11.00,{options:[select('Dressing',['Balsamico','Truffelmayonaise'])]},'Carpaccio, pijnboompitten, Parmezaan, zongedroogde tomaat en rode ui'),
          item('Ceasarsalade',11.00,null,'Brandermayonaise, gerookte kip, spek, rode ui, ei, croutons, cherrytomaat, Parmezaan en komkommer'),
          item('Salade burrata',11.00,{options:[extra('Extra',['Serranoham + €2,50'])]},'Burrata, cherrytomaat, groene pesto, sla, rode ui, balsamico en zonnebloempitten'),
          item('Slaatje',3.95),item('Rauwkostslaatje',2.95)
        ],
        'Dranken': [
          item('Petfles cola / cola zero / Fanta / Spa blauw',3.25,{options:[select('Drinken',['Cola','Cola zero','Fanta','Spa blauw'])]}),item('Petfles melk',2.95),item('Red Bull / suikervrij',3.30,{options:[select('Variant',['Red Bull','Red Bull suikervrij'])]}),item('Blik bier',2.95),item('Krat bier gekoeld incl. statiegeld',25.00),
          item('Milkshake klein',3.00,{options:[select('Smaak',['Aardbei','Banaan','Chocolade','Karamel','Vanille','Cassis','Latte macchiato','Tropical'])]}),
          item('Milkshake middel',3.50,{options:[select('Smaak',['Aardbei','Banaan','Chocolade','Karamel','Vanille','Cassis','Latte macchiato','Tropical'])]}),
          item('Milkshake groot',4.00,{options:[select('Smaak',['Aardbei','Banaan','Chocolade','Karamel','Vanille','Cassis','Latte macchiato','Tropical'])]})
        ]
      })
    },

    bie: {
      name:'Bie Immink', short:'Bie Immink', town:'Enter', emoji:'🐟', accent:'#b46e45', className:'bie',
      description:'Ambacht, smaak & beleving · verse vis, eigen rokerij, vlees en patat.',
      sourceUrl:'https://bieimmink.nl/menu/', sourceLabel:'Officiële menukaart · Bie Immink',
      disclaimer:'Alle prijzen zijn inclusief btw. Vis en vlees per kilo of per 100 gram worden op gewicht afgerekend; het bedrag op de bon kan daardoor iets afwijken. Prijzen kunnen wijzigen.',
      heroImage:'https://media-r2.1twente.nl/Images/_imageSlider/BIE_IMMINK_BINNENKANT_2026-10-07-150840_oqsy-cut.png',
      categories: categories({
        'Patat & aardappelschijfjes': [item('Patat normaal',2.75),item('Patat groot',3.95),item('Gezinszak 2 personen',5.50),item('Gezinszak 4 personen',10.50),item('Gezinszak 5 personen',13.00),item('Aardappelschijfjes normaal',3.25),item('Aardappelschijfjes groot',4.75)],
        'Snacks': [item('Frikandel',2.25),item('Kroket',2.25),item('Kalfskroket',2.50),item('Bamischijf',2.50),item('Kipcorn',2.50),item('Kaassoufflé',2.30),item('Gehaktbal uit de jus',3.50,null,'Uit eigen keuken'),item('Bolletje',0.75)],
        'Gebakken vis': [item('Lekkerbek',5.50),item('Kibbeling klein',5.50),item('Kibbeling groot',8.40),item('Visfriet klein',5.50),item('Visfriet groot',8.40),item('Garnalen (10 stuks)',5.50),item('Garnalen (15 stuks)',8.40)],
        'Vissnacks': [item('Viskroket',2.25),item('Garnalenkroket',3.00)],
        'Broodje vis': [item('Broodje haring',3.75),item('Broodje paling',9.50),item('Broodje zalm',6.50)],
        'Menu’s': [item('Lekkerbekmenu',12.50),item('Kibbelingmenu',12.50),item('Gehaktbalmenu',8.75),item('Sparerib menu',12.50)],
        'Uit de grill': [item('Kippenbout gegaard (per stuk)',2.99),item('Kippenbout gegaard (3 stuks)',8.75),item('Kippenbout vers (per kilo)',4.75,null,'Per kilo', 'kg'),item('Spareribs gegaard (per kilo)',15.00,null,'Per kilo','kg'),item('Spareribs vers (per kilo)',11.20,null,'Per kilo','kg'),item('Kippenborrelpoten gegaard (per kilo)',8.50,null,'Per kilo','kg'),item('Kippenborrelpoten gegaard (10 stuks)',5.50),item('Kippenborrelpoten gegaard (20 stuks)',10.00),item('Kippenborrelpoten vers (per kilo)',5.45,null,'Per kilo','kg')],
        'Rokerij & visbank': [
          item('Paling (per kilo)',49.90,null,'Uit eigen rokerij · per kilo','kg'),item('Palingfilet (per 100 gram)',8.50,null,'Uit eigen rokerij · per 100 gram','100 g'),
          item('Gerookte zalmzijde (per zijde)',35.00,null,'Per zijde'),item('Zalmfilet koud gerookt (per 100 gram)',6.99,null,'Uit eigen rokerij · per 100 gram','100 g'),
          item('Zalmsteaks (per kilo)',37.50,null,'Per kilo','kg'),item('Zalmbuikjes (per kilo)',27.50,null,'Per kilo','kg'),item('Verse zalmzijde (per 100 gram)',2.55,null,'Per 100 gram','100 g'),
          item('Makreel (per 100 gram)',1.89,null,'Per 100 gram','100 g'),item('Makreelfilet (per 100 gram)',3.29,null,'Per 100 gram','100 g'),item('Verse kabeljauwfilet (per 100 gram)',3.59,null,'Per 100 gram','100 g'),
          item('Haring (per stuk)',3.00),item('Haring (5 stuks)',12.50)
        ],
        'Slagerij': [
          ...[['Kipfilet (per kilo)',12.00],['Speklappen (per kilo)',9.50],['Karbonade (per kilo)',9.00],['Procureurlapjes (per kilo)',10.50],['Verse worst grof (per kilo)',8.00],['Verse worst fijn (per kilo)',8.00],['Rundergehakt (per kilo)',14.00],['Half om half gehakt (per kilo)',10.00],['Sucade (per kilo)',25.00],['Braadvlees (per kilo)',18.00],['Schnitzels (per kilo)',12.50],['Gehaktballen (per stuk)',2.00],['Slavinken (per stuk)',1.95],['Rundervinken (per stuk)',2.25],['Boomstammetjes (per stuk)',2.25],['Cordon bleus (per stuk)',2.25],['Hamburgers (per stuk)',1.35],['Bakleverworst (500 gram)',4.50],['Bloedworst (500 gram)',4.20],['Boerenbakleverworst (750 gram)',8.40]].map(([n,p])=>item(n,p,null,n.includes('per kilo')?'Prijs per kilo':n.includes('per stuk')?'Per stuk':n.includes('gram)')?'Vaste verpakking':'',n.includes('per kilo')?'kg':n.includes('per stuk')?'stuk':n.includes('gram)')?'verpakking':''))
        ],
        'Maaltijden': [item('Bami (per kilo)',11.20,null,'Kant-en-klaar, alleen opwarmen','kg'),item('Nasi (per kilo)',11.20,null,'Kant-en-klaar, alleen opwarmen','kg'),item('Gehaktballetjes in ketjap (per kilo)',16.80,null,'Kant-en-klaar, alleen opwarmen','kg')],
        'Sauzen': [
          item('Mayonaise klein',0.80),item('Mayonaise groot',1.40),item('Curry klein',0.80),item('Curry groot',1.40),item('Speciaal klein',0.95),item('Speciaal groot',1.90),item('Joppiesaus klein',0.95),item('Joppiesaus groot',1.90),
          item('Kruidenketchup klein',1.20),item('Kruidenketchup groot',2.10),item('Pindasaus klein',1.20),item('Pindasaus groot',2.10),item('Ravigotte klein',0.75),item('Ravigotte groot',1.50),item('Knoflooksaus klein',0.75),item('Knoflooksaus groot',1.50),item('Piri piri klein',0.75),item('Piri piri groot',1.50)
        ],
        'Drinken': [item('Cola',2.25),item('Cola zero',2.25),item('Fanta orange',2.25),item('Rivella',2.30),item('Water',2.00),item('Vitaminewater',2.55)]
      })
    },

    kebab: {
      name:'Kebab van Erhan', short:'Kebab van Erhan', town:'Enter', emoji:'🥙', accent:'#c45b3d', className:'kebab',
      description:'Vers gesneden döner · kip of kalf · broodje, box, dürüm en lahmacun.',
      sourceUrl:'https://www.instagram.com/kebab_van_erhan/', sourceLabel:'Instagram Kebab van Erhan',
      socialLinks:['https://www.instagram.com/kebab_van_erhan/','https://www.facebook.com/p/Kebab-van-Erhan-100049790695923/?locale=nl_NL'],
      heroImage:'',
      categories: categories({
        'Döner': [item('Döner kebab',null,{options:[toggle('Vleessoort',['Kip','Kalf'])]},'Vers gesneden döner kebab')],
        'Broodjes & boxen': [item('Broodje kebab',null,{options:[toggle('Vleessoort',['Kip','Kalf'])]}),item('Dönerbox',null,{options:[toggle('Vleessoort',['Kip','Kalf'])]})],
        'Wraps & Turkse pizza': [item('Wrap / Dürüm',null,{options:[toggle('Vleessoort',['Kip','Kalf'])]}),item('Lahmacun (Turkse pizza)',null,{options:[select('Vlees (optioneel)',['Geen','Kip','Kalf'],false)]})],
        'Sauzen': [item('Knoflooksaus',null)],
        'Cadeaubonnen': [item('Cadeaubon vanaf €10',10,null,'Voor een hoger bedrag: vermeld het gewenste bedrag bij de bestelopmerking')]
      })
    }
  };
})();
