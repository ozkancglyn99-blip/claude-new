/* ==========================================================
   AYARLAR — düğün bilgilerine göre burayı güncelle
   ========================================================== */
const WEDDING_DATE = "2027-12-12T19:00:00"; // Geri sayım hedef tarihi/saati

/* ==========================================================
   ELEMENTLER
   ========================================================== */
const envelopeScreen = document.getElementById("envelope-screen");
const muhurButon     = document.getElementById("muhurButon");
const zarfKapak      = document.getElementById("zarfKapak");
const davetiyeKarti  = document.getElementById("davetiyeKarti");
const invitation     = document.getElementById("invitation");

/* ==========================================================
   ZARF AÇILIŞ SEKANSI
   ========================================================== */
let isOpening = false;

muhurButon.addEventListener("click", () => {
  if (isOpening) return;
  isOpening = true;

  // 1) Mühür dönerek ve solarak kayboluyor
  muhurButon.classList.add("is-clicked");

  // 2) Kısa bir gecikmeyle kapak menteşeden yukarı açılıyor
  setTimeout(() => {
    zarfKapak.classList.add("is-open");
  }, 350);

  // 3) Kapak açılır açılmaz kart zarfın içinden yukarı kayıyor
  setTimeout(() => {
    davetiyeKarti.classList.add("is-out");
  }, 350 + 550);

  // 4) Kart yerleşince zarf ekranı kayboluyor, davetiye içeriği açılıyor
  setTimeout(() => {
    envelopeScreen.classList.add("is-hidden");
    invitation.removeAttribute("aria-hidden");
    invitation.classList.add("is-visible");
    document.body.style.overflowY = "auto";
  }, 350 + 550 + 900);
});

// Zarf açılış ekranındayken sayfanın kaymasını engelle
document.body.style.overflow = "hidden";

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
