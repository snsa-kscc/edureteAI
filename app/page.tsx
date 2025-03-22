import Head from "next/head";
import Script from "next/script";
import Link from "next/link";

export default function Home() {
  return (
    <html lang="hr">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link href="/assets/vendors/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>
        <link href="/assets/css/font-awesome.min.css" rel="stylesheet"/>
        <link href="/assets/vendors/themify-icon/themify-icons.css" rel="stylesheet"/>
        <link href="/assets/vendors/icomoon/style.css" rel="stylesheet"/>
        <link href="/assets/vendors/slick/slick.css" rel="stylesheet"/>
        <link href="/assets/vendors/slick/slick-theme.css" rel="stylesheet"/>
        <link href="/assets/vendors/animation/animate.css" rel="stylesheet"/>
        <link href="/assets/vendors/magnify-pop/magnific-popup.css" rel="stylesheet"/>
        <link href="/assets/css/style.css" rel="stylesheet"/>
        <link href="/assets/css/responsive.css" rel="stylesheet"/>

        <title>Edurete AI</title>
      </head>
      <body>
        <div data-scroll-animation="true">
        <div className="body_wrapper">
          <nav className="navbar navbar-expand-lg sticky_nav">
            <div className="container d-flex justify-content-between">
              <a className="navbar-brand" href="index.html"><img src="/assets/img/logo.svg" alt="logo"/></a>
              <Link href="/sign-in" className="saas_btn wow fadeInUp" data-wow-delay="0.2s"
                    style={{padding: '10px 20px'}}>
                <div className="btn_text"><span>Isprobaj besplatno</span><span>Prijavi se</span></div>
              </Link>
            </div>
          </nav>
          <section className="saas_banner_area" data-bg-color="#F7F8FA">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-5">
                  <div className="saas_banner_content">
                    <h1 className="wow fadeInLeft">Tvoj novi osobni matematički asistent</h1>
                    <Link href="/sign-in" className="saas_btn wow fadeInUp" data-wow-delay="0.2s">
                      <div className="btn_text"><span>Isprobaj besplatno</span><span>Isprobaj besplatno</span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="saas_banner_img wow fadeInRight" data-wow-delay="0.2s">
                    <img src="/assets/img/home-one/main.png" alt=""/>
                    <a href="https://www.youtube.com/watch?v=ryM9NmE_x1Y"
                       className="video_popup popup-youtube">
                      <i className="fa fa-play"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="saas_features_area">
            <div className="container">
              <div className="section_title text-center">
                <h2 className="title-animation">Trebaš pomoć s matematikom? Tu sam za tebe!</h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">Znam da matematika ponekad može biti teška i
                  frustrirajuća, ali ne brini – tu sam da ti pomognem da je savladaš s lakoćom!</p>
              </div>
              <div className="row flex-row-reverse saas_features_item one">
                <div className="col-lg-6">
                  <div className="saas_features_img" data-bg-color="#E6D8F5">
                    <div className="img_small wow fadeInUp">
                      <img data-parallax='{"y": 40}' src="/assets/img/home-one/features_img_two.png" alt=""/>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="saas_features_content wow fadeInLeft" data-wow-delay="0.2s">
                    <h2>Što nudim?</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
                    <ul className="list-unstyled saas_list">
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Objašnjenja koja "sjedaju": Zaboravi na dosadne lekcije!
                      </li>
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Rješavanje zadataka korak po korak: Pokazat ću ti kako se rješavaju zadaci
                      </li>
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Pomoć pri učenju za testove: Pripremit ću te za testove i ispite, tako da se osjećaš
                        samouvjereno
                        i spremno
                      </li>
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Individualni pristup: Svaki učenik je poseban
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row saas_features_item two">
                <div className="col-lg-6">
                  <div className="saas_features_img" data-bg-color="#ADDEF0">
                    <div className="img_small wow fadeInUp" data-wow-delay="0.2s">
                      <img data-parallax='{"y": 80, "x": -20}' src="/assets/img/home-one/section-2.png" alt=""/>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="saas_features_content wow fadeInRight" data-wow-delay="0.1s">
                    <h6>Sales Analytics</h6>
                    <h2>Zašto odabrati mene?</h2>
                    <ul className="list-unstyled saas_list">
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Iskustvo: Imam 2 godine iskustva u pomaganju učenicima s matematikom
                      </li>
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Strpljenje: Razumijem da učenje ponekad traje, i tu sam da te podržim na svakom koraku
                      </li>
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Uspjeh: Moji učenici postižu bolje rezultate i s više samopouzdanja pristupaju matematici
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row flex-row-reverse saas_features_item three">
                <div className="col-lg-6">
                  <div className="saas_features_img saas_banner_img" data-bg-color="#B3F7D5">
                    <img className="img_small wow fadeInUp" data-wow-delay="0.3s" src="/assets/img/home-one/main.png"/>
                    <a href="https://www.youtube.com/watch?v=0HM9b5kvhio"
                       className="video_popup popup-youtube">
                      <i className="fa fa-play"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="saas_features_content wow fadeInLeft" data-wow-delay="0.2s">
                    <h6>Business Analytics</h6>
                    <h2>Kako funkcionira?</h2>
                    <ul className="list-unstyled saas_list">
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Javi mi se: Pošalji mi poruku s opisom problema s kojim se suočavaš
                      </li>
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Dogovorimo se: Pronaći ćemo vrijeme koje ti odgovara za online konzultacije
                      </li>
                      <li>
                        <div className="icon"><img src="/assets/img/home-one/check.png" alt=""/></div>
                        Učimo zajedno: Kroz interaktivnu sesiju, objasnit ću ti sve što ti je potrebno da savladaš
                        gradivo
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="testimonial_area_one sec_padding">
            <div className="container">
              <div className="section_title text-center">
                <h2 className="title-animation">Recenzije naših korisnika</h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">Manual time entry is prone to errors and can
                  negatively impact your company's reputation with paycheck errors. When it's manual, it's prone
                  to error, and the</p>
              </div>
            </div>
            <div className="testimonial_slider_two wow fadeInUp" data-wow-delay="0.2s">
              <div className="item">
                <div className="t_logo d-flex justify-content-between">
                  <div className="ratting">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                </div>
                <p>“Sviđa mi se EdureteAI jer mi je više modela na raspolaganju na jednom mjestu. S obzirom da umjetna
                  inteligencija nije uvijek pouzdana, pogotovo u rješavanju matematičkih zadataka, ako jedan model ne
                  uspije riješiti zadatak, najčešće se među ostalima nađe onaj koji zna.”</p>
                <div className="client_info">
                  <img src="/assets/img/reviews/1.png"/>
                  <div className="text">
                    <h5>Katarina</h5>
                    <h6>instruktorica matematike</h6>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="t_logo d-flex justify-content-between">
                  <img src="/assets/img/home-three/google.png" alt=""/>
                  <div className="ratting">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                </div>
                <p>“Kroz proteklih godinu dana, primijetila sam kako su AI modeli znatno napredovali u testiranju
                  zadataka, posebno u brzini i točnosti.
                  AI modeli u trenutnom izdanju nude izvrstan, novi princip učenja koji osigurava jasne odgovore na
                  pitanja i objašnjenja gradiva na jednostavan i razumljiv način u svako doba dana i noći.
                  Također, vjerujem da bi bio izuzetno koristan za učenike jer pruža instantne povratne informacije
                  prilagođene potrebama pojedinca.”</p>
                <div className="client_info">
                  <img src="/assets/img/reviews/2.png"/>
                  <div className="text">
                    <h5>Tara</h5>
                    <h6>instruktorica matematike</h6>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="t_logo d-flex justify-content-between">
                  <img src="/assets/img/home-three/good.png" alt=""/>
                  <div className="ratting">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                </div>
                <p>“Kao instruktor matematike, najveću prednost naše aplikacije vidim u tome što omogućuje korištenje
                  različitih LLM-ova i modela, pružajući uvid u različite načine rješavanja istog zadatka – nekad
                  detaljno i temeljito, nekad sažeto i brzo, uz primjenu različitih metoda. Time učenici dobivaju širi
                  pregled i dublje razumijevanje matematike. Posebno mi se sviđa što je naš sistemski prompt pažljivo
                  osmišljen kako bi iz svakog modela izvukao ono najbolje, osiguravajući ne samo točne odgovore, već i
                  jasna, korisna objašnjenja koja učenicima zaista pomažu da shvate gradivo.”</p>
                <div className="client_info">
                  <img src="/assets/img/reviews/3.png"/>
                  <div className="text">
                    <h5>Gorana</h5>
                    <h6>Instruktorica matematike</h6>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="t_logo d-flex justify-content-between">
                  <div className="ratting">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                </div>
                <p>“Kod EdureteAI me iznenadila njegova svestranost i prilagodljivost zadacima koji se pred njega stave.
                  Uspješno rješava veliku većinu matematičkih i drugih zadataka. U sebi sadrži više modela koji
                  omogućuju da se istom problemu pristupi s više gledišta ili postupaka što produbljuje razumijevanje
                  problema. Veliku prednost vidim i u opciji da se personalizira pristup i način na koji EdureteAI daje
                  odgovore putem ugrađenog prozora dodatnih postavki. Ako umjetna inteligencija korisniku ipak ne pruži
                  zadovoljavajući rezultat, tu smo uvijek mi, instruktori, da ponudimo rješenje. ”</p>
                <div className="client_info">
                  <img src="/assets/img/reviews/4.png"/>
                  <div className="text">
                    <h5>Antonija</h5>
                    <h6>Instruktorica matematike</h6>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="t_logo d-flex justify-content-between">
                  <div className="ratting">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                </div>
                <p>“Prednost EdureteAI-a je u tome što pružamo više opcija za rješavanje zadataka, prilagođenih
                  različitim stilovima učenja. Nalazimo se u vremenu kada priprema za maturu postaje optimalnija nego
                  ikada prije, omogućujući učenicima učinkovitije usvajanje gradiva i bolje rezultate.”</p>
                <div className="client_info">
                  <img src="/assets/img/reviews/5.png"/>
                  <div className="text">
                    <h5>Mihael</h5>
                    <h6>Instruktor matematike</h6>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="t_logo d-flex justify-content-between">
                  <div className="ratting">
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                    <i className="fa fa-star" aria-hidden="true"></i>
                  </div>
                </div>
                <p>“Najveća prednost aplikacije EdureteAI koju sam primijetila je mogućnost pružanja pomoći u rješavanju i
                  objašnjenju teorije jednostavnijih i kompliciranijih matematičkih zadataka u doba dana kada
                  profesionalni stvarni instruktori inače nisu dostupni. Drugu prednost koja je dosta izražena je
                  mogućnost korištenja više modela pomoću kojih se mogu dobiti različiti postupci rješavanja istog
                  zadatak. ”</p>
                <div className="client_info">
                  <img src="/assets/img/reviews/6.png"/>
                  <div className="text">
                    <h5>Anđela</h5>
                    <h6>Instruktorica matematike</h6>
                  </div>
                </div>
              </div>


            </div>
          </section>

          <section className="saas_price_area sec_padding">
            <div className="container">
              <div className="section_title text-center">
                <h2>Odaberi svoj plan</h2>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6">
                  <div className="saas_price_item">
                    <div className="price_header">
                      <h3>0,00 EUR</h3>
                      <h2>Besplatno</h2>
                    </div>
                    <ul className="list-unstyled">
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> 10 tokena</li>
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> Odabrani snimci za
                        lakše učenje
                      </li>
                    </ul>
                    <a href="#" className="price_btn">Isprobaj</a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="saas_price_item">
                    <div className="price_header">
                      <h3>9,00 EUR</h3>
                      <h2>Samo AI</h2>
                    </div>
                    <ul className="list-unstyled">
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> 500 tokena</li>
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> Odabrani snimci za
                        lakše učenje
                      </li>
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> <span
                        style={{color: 'red'}}>Posebna promo akcija za prvih 100 učenika</span> - 2 X 30 minuta sa
                        instruktorom
                      </li>
                    </ul>
                    <a href="#" className="price_btn">Isprobaj</a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="saas_price_item">
                    <div className="price_header">
                      <h3>39,00 EUR</h3>
                      <h2>Instruktor + AI</h2>
                    </div>
                    <ul className="list-unstyled">
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> 500 tokena</li>
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> Odabrani snimci za
                        lakše učenje
                      </li>
                      <li><img className="d-inline" src="/assets/img/home-one/check_3.png" alt=""/> 2 X 30 minuta svaki
                        mjesec sa
                        instruktorom
                      </li>
                    </ul>
                    <a href="#" className="price_btn">Isprobaj</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="saas_faq_area sec_padding">
            <div className="container">
              <div className="section_title text-center">
                <h2 className="title-animation">Često postavljana pitanja</h2>
                <p className="wow fadeInUp" data-wow-delay="0.4s">Find questions and answers related to the design
                  system,<br className="d-none d-lg-block"/> purchase, updates, and support.</p>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="accordion faq_inner faq_inner_two ps-4" id="accordionExampleTwo">
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.5s">
                      <h2 className="accordion-header" id="headingSeven">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseSeven" aria-expanded="true"
                                aria-controls="collapseSeven">
                          Zašto odabrati EdureteAI?
                        </button>
                      </h2>
                      <div id="collapseSeven" className="accordion-collapse collapse show"
                           aria-labelledby="headingSeven" data-bs-parent="#accordionExampleTwo"
                           style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>Ova platforma pruža sveobuhvatnu podršku u učenju matematike, kombinirajući snagu naprednih
                            AI asistenata i iskusnih instruktora. Matematički AI asistent dostupan je 24/7 za pomoć u
                            pripremi za ispite i provjere znanja. Nudi primjere zadataka, savjete za rješavanje i
                            detaljna objašnjenja korak po korak. Također, može generirati dodatne zadatke različitih
                            razina težine i provjeriti rješenja korisnika, pružajući povratnu informaciju o pogreškama i
                            načinima ispravka.</p>
                          <p>Osim AI asistenta, platforma omogućuje brz i jednostavan pristup iskusnim instruktorima
                            matematike. Ako je potrebno dodatno pojašnjenje ili personalizirana pomoć, korisnik može
                            dogovoriti individualni sat. Cilj je pružiti cjelovitu podršku, spajajući prednosti umjetne
                            inteligencije s individualiziranim pristupom i stručnošću ljudskih instruktora</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.6s">
                      <h2 className="accordion-header" id="headingEight">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseEight" aria-expanded="false"
                                aria-controls="collapseEight">
                          Kako mi EdureteAI može pomoći u učenju matematike?
                        </button>
                      </h2>
                      <div id="collapseEight" className="accordion-collapse collapse"
                           aria-labelledby="headingEight" data-bs-parent="#accordionExampleTwo"
                           style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>Platforma omogućuje detaljna objašnjenja matematičkih koncepata i rješavanje zadataka korak
                            po korak. Svaki problem započinje kratkim teorijskim pregledom, nakon čega slijedi jasno
                            strukturirano rješenje razloženo na manje dijelove. Komunikacija je prilagođena učenicima –
                            koristi se prijateljski i opušten ton, slično kao kad kolega objašnjava nešto drugom kolegi.
                            Pitanja postavljena tijekom rješavanja pomažu provjeriti razumijevanje i potiču
                            interakciju.</p>
                          <p>Nakon riješenog zadatka dostupni su dodatni zadaci za vježbu kako bi se učvrstilo znanje.
                            Učenike se potiče da slobodno postavljaju pitanja jer nema glupih pitanja – svako pitanje
                            pomaže boljem razumijevanju. Cilj je stvoriti ugodno i poticajno okruženje za učenje, gdje
                            se učenici osjećaju sigurno tražiti pojašnjenja kad god im je potrebno.</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.7s">
                      <h2 className="accordion-header" id="headingNine">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseNine" aria-expanded="false"
                                aria-controls="collapseNine">
                          Što ako primjetim grešku u rješenju?
                        </button>
                      </h2>
                      <div id="collapseNine" className="accordion-collapse collapse" aria-labelledby="headingNine"
                           data-bs-parent="#accordionExampleTwo" style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>Ako korisnik primijeti grešku, može odmah ukazati na nju u chatu i zatražiti pojašnjenje
                            ili ispravak. AI asistent će analizirati problem, ispraviti eventualnu pogrešku i objasniti
                            gdje je do nje došlo. Ako je potrebno, moguće je postaviti dodatna pitanja ili tražiti
                            alternativni pristup rješavanju zadatka.</p>
                          <p>Iako se koriste napredni modeli umjetne inteligencije, u složenijim zadacima može doći do
                            pogrešaka. Ako rješenje nije zadovoljavajuće ili postoje dodatne nedoumice, uvijek se može
                            zatražiti pomoć instruktora, čija je stručnost nezamjenjiva u obrazovnom procesu.</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.8s">
                      <h2 className="accordion-header" id="headingTen">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
                          Što ako ne razumijem objašnjenje?
                        </button>
                      </h2>
                      <div id="collapseTen" className="accordion-collapse collapse" aria-labelledby="headingTen"
                           data-bs-parent="#accordionExampleTwo" style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>Ako objašnjenje nije dovoljno jasno, može se prilagoditi na više načina. Može se prijeći s
                            općenitih objašnjenja na konkretne primjere ili obrnuto, ovisno o tome što korisniku više
                            odgovara. Složeniji zadaci mogu se razložiti na manje dijelove i analizirati postupno, korak
                            po korak, kako bi se smanjila složenost.</p>
                          <p>Ako poteškoće i dalje postoje, moguće je zajedno proći kroz dodatne, slične zadatke jer
                            vježbanje na primjerima često pomaže u učvršćivanju razumijevanja. Nema glupih pitanja –
                            svako pitanje doprinosi boljem shvaćanju gradiva, a što je pitanje preciznije, to će pomoć
                            biti učinkovitija. Također, ako je potrebno dodatno pojašnjenje, uvijek se može konzultirati
                            instruktor matematike.</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.9s">
                      <h2 className="accordion-header" id="headingEleven">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseEleven" aria-expanded="false"
                                aria-controls="collapseEleven">
                          Po čemu je EdureteAI poseban u odnosu na druge alate za učenje matematike?
                        </button>
                      </h2>
                      <div id="collapseEleven" className="accordion-collapse collapse"
                           aria-labelledby="headingEleven" data-bs-parent="#accordionExampleTwo"
                           style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>EdureteAI je poseban jer je razvijen u bliskoj suradnji s iskusnim instruktorima
                            matematike. Kontinuirano surađuje s instruktorima matematike kako bi se usavršavao i pružao
                            još kvalitetniju podršku.</p>
                          <p>Dodatna prednost je što nudi više različitih modela, a korisnici mogu usporedno razgovarati
                            s dva modela, što omogućuje dobivanje različitih pristupa i objašnjenja za isti problem. Za
                            najbolje rezultate, preporučuje se kombinacija EdureteAI-a i instruktora matematike.
                            Odabirom paketa s instruktorom, korisnik dobiva personaliziranu podršku i pomoć u rješavanju
                            najzahtjevnijih zadataka.</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.9s">
                      <h2 className="accordion-header" id="headingFe1">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseFe1" aria-expanded="false"
                                aria-controls="collapseFe1">
                          Kako najbolje komunicirati s AI asistentima?
                        </button>
                      </h2>
                      <div id="collapseFe1" className="accordion-collapse collapse"
                           aria-labelledby="headingFe1" data-bs-parent="#accordionExampleTwo"
                           style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>EdureteAI komunicira prvenstveno na hrvatskom jeziku, koristeći terminologiju hrvatskih
                            škola. Razumije i matematičke termine na engleskom. Ako korisnik pošalje termin na nekom
                            drugom jeziku, EdureteAI će pokušati prepoznati ga i povezati s odgovarajućim hrvatskim
                            pojmom, ali ne može garantirati preciznost za sve jezike.</p>
                          <p>Korisnik može poslati sliku ili tekst zadatka/pitanja s kojim ima problema. Važno je da
                            slika bude jasna i čitljiva kako bi EdureteAI mogao točno pročitati sve dijelove zadatka.
                            Korisnik može ispraviti EdureteAI ako nešto krivo pročita ili ne razumije. Također, korisnik
                            može tražiti dodatne primjere, zadatke za vježbu, provjeru svog rješenja ili pojašnjenje
                            određenog koraka.</p>
                          <p>Korisnik uvijek može naznačiti na kojoj razini treba objašnjenje (osnovno, detaljno ili
                            napredno) te može slobodno prekinuti EdureteAI ako nešto nije jasno ili želi da uspori i
                            pojednostavi objašnjenje.</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.9s">
                      <h2 className="accordion-header" id="headingFe2">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseFe2" aria-expanded="false"
                                aria-controls="collapseFe2">
                          Koje gradivo matematike EdureteAI pokriva?
                        </button>
                      </h2>
                      <div id="collapseFe2" className="accordion-collapse collapse"
                           aria-labelledby="headingFe2" data-bs-parent="#accordionExampleTwo"
                           style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>Obuhvaća cjelokupnu srednjoškolsku matematiku, uključujući algebru, geometriju,
                            trigonometriju, diferencijalni i integralni račun, vjerojatnost i statistiku. Ako korisnik
                            treba pomoć s nečim izvan toga, može slobodno pitati i AI asistenti će pokušati ponuditi
                            objašnjenje u granicama svojih mogućnosti. Iako će dati najbolje moguće rješenje na temelju
                            dostupnih podataka, za složenije ili specijalizirane teme možda neće uvijek moći pružiti
                            potpuno točan ili detaljan odgovor.</p>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item wow fadeInUp" data-wow-delay="0.9s">
                      <h2 className="accordion-header" id="headingFe112">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseFe112" aria-expanded="false"
                                aria-controls="collapseFe112">
                          Od čega se EdureteAI sastoji i kako ga prilagoditi svojim potrebama?
                        </button>
                      </h2>
                      <div id="collapseFe112" className="accordion-collapse collapse"
                           aria-labelledby="headingFe112" data-bs-parent="#collapseFe112"
                           style={{visibility: 'visible'}}>
                        <div className="accordion-body">
                          <p>EdureteAI je jedinstveni matematički asistent koji nudi pristup različitim naprednim
                            sustavima umjetne inteligencije u jednom alatu. Unutar platforme, korisnici mogu odabrati
                            između različitih AI sustava (Gemini, Claude, DeepSeek, GPT) za dobivanje objašnjenja
                            matematičkih koncepata.</p>
                          <p>Cilj je pružiti najbolje moguće iskustvo učenja matematike kroz pristup različitim AI
                            sustavima. Korisnici mogu odabrati bilo koji od ponuđenih sustava prema svojim preferencijama.
                            Dodatna mogućnost prilagodbe je poseban okvir za dodatne upute, pomoću kojeg se EdureteAI može
                            prilagoditi specifičnim potrebama svakog učenika, što omogućuje personalizirano iskustvo
                            učenja.
                          </p>
                          <p></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="promo_content promo_content_bg text-center">
                <img className="shap_one" src="/assets/img/home-one/shapes.png" alt=""/>
                <img className="shap_two" src="/assets/img/home-one/zigzag.png" alt=""/>
                <h2 className="title-animation">Spreman/na za početak?</h2>
                <p className="wow fadeInUp" data-wow-delay="0.5s">Klikni ovdje da me kontaktiraš i zakažeš svoju prvu
                  konzultaciju!</p>
                <a href="#" className="saas_btn wow fadeInUp" data-wow-delay="0.6s">
                  <div className="btn_text"><span>Sada</span><span>Kontaktiraj me</span>
                  </div>
                </a>
              </div>
            </div>
          </section>
        </div>

        <script src="/assets/js/jquery-3.6.0.min.js"></script>


        <Script src="/assets/vendors/bootstrap/js/popper.min.js"/>
        <Script src="/assets/vendors/bootstrap/js/bootstrap.min.js"/>
        <Script src="/assets/vendors/slick/slick.min.js"/>
        <Script src="/assets/vendors/parallax/jquery.parallax-scroll.js"/>
        <Script src="/assets/vendors/wow/wow.min.js"/>
        <Script src="/assets/js/gsap.min.js"/>
        <Script src="/assets/js/SplitText.js"/>
        <Script src="/assets/js/ScrollTrigger.min.js"/>
        <Script src="/assets/js/SmoothScroll.js"/>
        <Script src="/assets/vendors/magnify-pop/jquery.magnific-popup.min.js"/>
        <Script src="/assets/js/custom.js"/>
      </div>
      </body>
    </html>
  )
}
