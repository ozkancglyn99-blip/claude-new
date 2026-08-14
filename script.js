/* ==========================================================
   AYARLAR — düğün bilgilerine göre burayı güncelle
   ========================================================== */
const WEDDING_DATE = "2027-12-12T19:00:00"; // Geri sayım hedef tarihi/saati

/* ==========================================================
   ELEMENTLER
   ========================================================== */
const envelopeScreen = document.getElementById("envelope-screen");
const envelopeStage  = document.getElementById("envelopeStage");
const sealHit        = document.getElementById("sealHit");
const sealFlash      = document.getElementById("sealFlash");
const invitation     = document.getElementById("invitation");
const bgMusic        = document.getElementById("bgMusic");
const musicToggle    = document.getElementById("musicToggle");
const envelopeEl     = document.querySelector(".envelope");

/* ==========================================================
   MÜHÜR KIRILMA + ZARF AÇILIŞ SEKANSI
   ========================================================== */
let isOpening = false;

sealHit.addEventListener("click", () => {
  if (isOpening) return;
  isOpening = true;

  // 1) Müzik, mühür kırılma anında başlıyor (kullanıcı etkileşimi olduğu
  //    için tarayıcı otomatik oynatma kısıtlamasına takılmaz)
  bgMusic.currentTime = 0;
  bgMusic.play().catch(() => {
    // Tarayıcı yine de engellerse sessizce geç, kullanıcı müzik
    // butonundan manuel başlatabilir
  });

  // 2) Mühür kırılıyor: altın ışık patlaması + zarfın hafif sarsılması
  sealFlash.classList.add("is-breaking");
  envelopeEl.classList.add("is-shaking");
  sealHit.style.pointerEvents = "none";

  // 3) Zarf sahnesi büyüyerek eriyor
  setTimeout(() => {
    envelopeStage.classList.add("is-opening");
  }, 380);

  // 4) Zarf ekranı kayboluyor, davetiye içeriği beliriyor
  setTimeout(() => {
    envelopeScreen.classList.add("is-hidden");
    invitation.removeAttribute("aria-hidden");
    invitation.classList.add("is-visible");
    document.body.style.overflowY = "auto";
  }, 380 + 900);
});

// Zarf açılış ekranındayken sayfanın kaymasını engelle
document.body.style.overflow = "hidden";

/* ==========================================================
   SCROLL İLE İÇERİ KAYARAK BELİREN BÖLÜMLER
   ========================================================== */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ==========================================================
   DÜĞÜN HEDİYESİ — IBAN KOPYALAMA
   ========================================================== */
const giftIban   = document.getElementById("gift-iban");
const giftCopy    = document.getElementById("gift-copy");
const giftCopied = document.getElementById("gift-copied");

giftCopy.addEventListener("click", async () => {
  const ibanText = giftIban.textContent.replace(/\s/g, "");
  try {
    await navigator.clipboard.writeText(ibanText);
  } catch (err) {
    // Panoya erişim engellenirse manuel seçim için metni işaretle
    const range = document.createRange();
    range.selectNode(giftIban);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
  giftCopy.textContent = "Kopyalandı";
  giftCopy.classList.add("is-copied");
  giftCopied.textContent = "IBAN panoya kopyalandı, teşekkür ederiz!";
  setTimeout(() => {
    giftCopy.textContent = "Kopyala";
    giftCopy.classList.remove("is-copied");
  }, 2200);
});

/* ==========================================================
   MÜZİK AÇ/KAPA BUTONU
   ========================================================== */
musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicToggle.classList.remove("is-muted");
  } else {
    bgMusic.pause();
    musicToggle.classList.add("is-muted");
  }
});

/* ==========================================================
   GERİ SAYIM
   ========================================================== */
const cdDays  = document.getElementById("cd-days");
const cdHours = document.getElementById("cd-hours");
const cdMins  = document.getElementById("cd-mins");
const cdSecs  = document.getElementById("cd-secs");

function updateCountdown() {
  const target = new Date(WEDDING_DATE).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = "00";
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins  = Math.floor((diff / (1000 * 60)) % 60);
  const secs  = Math.floor((diff / 1000) % 60);

  cdDays.textContent  = String(days).padStart(2, "0");
  cdHours.textContent = String(hours).padStart(2, "0");
  cdMins.textContent  = String(mins).padStart(2, "0");
  cdSecs.textContent  = String(secs).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================================================
   LCV (RSVP)
   ========================================================== */
const rsvpYes = document.getElementById("rsvpYes");
const rsvpNo  = document.getElementById("rsvpNo");
const rsvpThanks = document.getElementById("rsvpThanks");

function handleRsvp(choice, btnClicked, btnOther) {
  btnClicked.classList.add("is-selected");
  btnOther.classList.remove("is-selected");

  rsvpThanks.textContent =
    choice === "yes"
      ? "Katılımınız için teşekkür ederiz, sizi aramızda görmekten mutluluk duyacağız!"
      : "Bildiriminiz için teşekkür ederiz, sizi özleyeceğiz.";

  // Not: Bu sadece arayüz geri bildirimidir. Yanıtı kalıcı olarak
  // kaydetmek için burada bir form servisine (Google Form, e-posta
  // API'si vb.) istek gönderilmesi gerekir.
}

rsvpYes.addEventListener("click", () => handleRsvp("yes", rsvpYes, rsvpNo));
rsvpNo.addEventListener("click", () => handleRsvp("no", rsvpNo, rsvpYes));
