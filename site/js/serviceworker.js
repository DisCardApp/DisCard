const staticDevCoffee = "dev-coffee-site-v1";
const assets = [
    "/mainpage.html",
    "/creditcardlist.html",
    "/images/bootstrap-icons.svg",
    "/images/logo/logo_no_padding.png",
    "/images/icon/logo_s.png",
    "/images/icon/logo_m.png",
    "/images/icon/logo_l.png",
    "/images/icon/logo_xxl.png",
    "/css/cashbacksearch.css",
    "/css/creditcardlist.css",
    "/css/creditcardmodal.css",
    "/css/creditcardtile.css",
    "/css/global.css",
    "/css/signinbtn.css",
    "/js/cardrecommendation.js",
    "/js/creditcardlist.js",
    "/js/flexboxanimation.js",
    "/js/geolocation.js",
    "/js/loginflow.js",
    "/js/rakutensearch.js"
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(caches.open(staticDevCoffee).then(cache => {
        cache.addAll(assets);
    })
    );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request);
    })
    );
});