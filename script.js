/* ===================================================================
   KONFIGURASI — EDIT SEMUA DATA PRIBADI DI SINI SAJA
   =================================================================== */
const CONFIG = {
  nickname: "Sayang",                 // nama panggilan pacar
  sender: "Dika",                      // nama pengirim
  birthday: "",                       // contoh: "17 Oktober 2026" (kosongkan jika tidak ingin tampil)
  pageTitle: "A Little Blue Garden for You",
  title: "Happy Birthday, My Favorite Person 💙",

  photo: "assets/images/girlfriend.jpg",   // <-- GANTI: foto wajah pacar

  letter: `Selamat ulang tahun, sayangku.

Hari ini adalah hari ketika seseorang yang begitu istimewa hadir di dunia, Hari dimana bidadari dan malaikat ikut turun menyambut kelahiranmu.  Aku mungkin tidak selalu bisa memberikan hal-hal yang sempurna, tetapi aku ingin kamu tahu bahwa kehadiranmu membuat banyak hal sederhana terasa jauh lebih indah.

Semoga di usia ke-20 tahun mu, kamu selalu menemukan alasan untuk tersenyum, keberanian untuk mengejar semua impianmu, dan ketenangan di setiap langkah yang kamu ambil.

Terima kasih telah menjadi dirimu sendiri. Semoga dunia selalu memperlakukanmu dengan lembut, seperti caramu membuat hari-hariku terasa lebih hangat.

Happy birthday, my love, my future wife. I hope this little blue garden reminds you how special you are to me. 💙`,

  secretMessage: "Pesan rahasia: kalau dunia terasa berat, ingat yaa sayang bahwa ada satu orang yang selalu bangga pada Sayang. Dika. 💙",

  // <-- GANTI: foto-foto kenangan (tambah/kurangi sesuai kebutuhan)
  memories: [
    { src: "assets/images/memory-1.jpg", caption: "Hari pertama cerita kita dimulai" },
    { src: "assets/images/memory-2.jpg", caption: "Senyum favoritku" },
    { src: "assets/images/memory-3.jpg", caption: "Petualangan kita malam itu" }
  ],

  video: "assets/videos/our-memory.mp4",     // <-- GANTI: video kenangan
  music: "assets/audio/birthday-song.mp3",   // <-- GANTI: musik latar

  reasons: [
    "Senyummu membuat hari terburukku jadi baik-baik saja.",
    "Kamu mendengarkan ceritaku dengan tulus, bahkan saat aku bercerita hal sepele.",
    "Kamu cantik, perhatian, lembut, dan kuat dalam waktu yang sama.",
    "Tawa kecilmu adalah suara favoritku.",
    "Bersamamu, hal sederhana terasa menjadi lebih istimewa."
  ],

  wish: `Aku hanya ingin kamu tahu.

Akan ada bagian dirimu dalam diriku, Selalu

Dan aku bersyukur untuk itu

Menjadi apapun kamu nantinya

Dimanapun kamu berada di dunia ini

Aku mengirimkan cinta untukmu. 💙`
};

/* ===================================================================
   UTILITAS
   =================================================================== */
const $ = (s) => document.querySelector(s);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Gambar placeholder jika file tidak ditemukan
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='#eaf4ff'/><text x='200' y='210' font-size='90' text-anchor='middle'>🌷</text><text x='200' y='290' font-size='20' text-anchor='middle' fill='#4a8fd4' font-family='sans-serif'>Foto belum ditambahkan</text></svg>`);
function safeImg(img) { img.addEventListener("error", () => { img.onerror = null; img.src = FALLBACK; }, { once: true }); }

/* Isi teks dari CONFIG */
document.title = CONFIG.pageTitle;
document.querySelectorAll("[data-bind]").forEach((el) => (el.textContent = CONFIG[el.dataset.bind]));
$("#title").textContent = CONFIG.title;
$("#dateText").textContent = CONFIG.birthday;
const photo = $("#profilePhoto");
photo.src = CONFIG.photo; safeImg(photo);

/* ===================================================================
   KELOPAK JATUH & HATI (jumlah dibatasi agar ringan)
   =================================================================== */
const PETALS = ["🌸", "💙", "🌼", "🪻", "✨"];
function spawnPetal() {
  if (document.hidden) return;
  const p = document.createElement("span");
  p.className = "petal"; p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
  p.style.animationDuration = 9 + Math.random() * 6 + "s";
  $("#petals").appendChild(p);
  setTimeout(() => p.remove(), 15000);
}
if (!reduceMotion) setInterval(() => { if ($("#petals").children.length < 14) spawnPetal(); }, 1100);

function burstHearts(x, y, n = 7, emojis = ["💙", "🌸", "✨"]) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "heart-pop"; h.textContent = emojis[i % emojis.length];
    h.style.left = x + "px"; h.style.top = y + "px";
    h.style.setProperty("--dx", (Math.random() * 140 - 70) + "px");
    h.style.animationDelay = i * 60 + "ms";
    $("#hearts").appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }
}
const burstFrom = (el) => { const r = el.getBoundingClientRect(); burstHearts(r.left + r.width / 2, r.top + r.height / 2); };

/* ===================================================================
   AMPLOP
   =================================================================== */
const envelope = $("#envelope");
let opened = false;
function openEnvelope() {
  if (opened) return; opened = true;
  envelope.classList.add("open");
  $("#sway").style.animationPlayState = "paused";
  burstFrom(envelope);
  setTimeout(() => {
    $("#intro").classList.add("out");
    setTimeout(() => {
      $("#intro").hidden = true; $("#main").hidden = false;
      window.scrollTo({ top: 0 });
      $("#title").classList.add("show");
      startLetter();
    }, 900);
  }, reduceMotion ? 100 : 2300);
}
envelope.addEventListener("click", openEnvelope); // <button>: Enter/Space otomatis berfungsi

/* ===================================================================
   SURAT (efek mesin tik)
   =================================================================== */
let typeTimer = null;
function typeInto(el, text, speed = 22) {
  clearInterval(typeTimer); el.textContent = "";
  if (reduceMotion) { el.textContent = text; return; }
  let i = 0;
  typeTimer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(typeTimer);
  }, speed);
}
function startLetter() { typeInto($("#letterText"), CONFIG.letter); }
$("#readBtn").addEventListener("click", (e) => { burstFrom(e.currentTarget); clearInterval(typeTimer); $("#letterText").textContent = CONFIG.letter; });
$("#replayBtn").addEventListener("click", (e) => { burstFrom(e.currentTarget); startLetter(); });
$("#secretBtn").addEventListener("click", (e) => {
  const card = $("#secretCard");
  card.hidden = false; card.textContent = CONFIG.secretMessage;
  card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
  burstFrom(e.currentTarget);
});

/* ===================================================================
   MODAL
   =================================================================== */
const modal = $("#modal"), modalBody = $("#modalBody");
let lastFocus = null, reasonIndex = 0;

const builders = {
  memories() {
    $("#modalTitle").textContent = "Our Memories";
    modalBody.innerHTML = `<div class="gallery-view"><div class="gallery" id="gallery"></div>
      <div class="nav"><button class="btn ghost" id="prevPic" aria-label="Foto sebelumnya">‹ Sebelumnya</button>
      <button class="btn ghost" id="nextPic" aria-label="Foto berikutnya">Berikutnya ›</button></div></div>`;
    const g = $("#gallery");
    CONFIG.memories.forEach((m) => {
      const f = document.createElement("figure"); f.className = "polaroid";
      const img = document.createElement("img"); img.src = m.src; img.alt = m.caption; img.loading = "lazy"; safeImg(img);
      const c = document.createElement("p"); c.textContent = m.caption;
      f.append(img, c); g.appendChild(f);
    });
    const step = () => g.clientWidth * 0.8;
    $("#prevPic").onclick = () => g.scrollBy({ left: -step(), behavior: "smooth" });
    $("#nextPic").onclick = () => g.scrollBy({ left: step(), behavior: "smooth" });
  },
  moments() {
    $("#modalTitle").textContent = "Little Moments";
    modalBody.innerHTML = `<video id="vid" controls playsinline preload="metadata"></video><p class="note" id="vidNote" hidden>Video belum ditemukan. Taruh file di assets/videos/our-memory.mp4</p>`;
    const v = $("#vid"); v.src = CONFIG.video;
    v.addEventListener("error", () => { v.hidden = true; $("#vidNote").hidden = false; });
  },
  reasons() {
    $("#modalTitle").textContent = "Reasons I Love You";
    modalBody.innerHTML = `<div class="reason-card" id="reasonCard">Ketuk tombol untuk membuka alasan 💙</div><button class="btn" id="nextReason">Alasan berikutnya 💙</button>`;
    const show = () => {
      const card = $("#reasonCard"); card.textContent = CONFIG.reasons[reasonIndex % CONFIG.reasons.length]; reasonIndex++;
      card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
      burstFrom($("#nextReason"));
    };
    $("#nextReason").onclick = show;
  },
  wish() {
    $("#modalTitle").textContent = "A Wish for You";
    modalBody.innerHTML = `<div class="wish-text" id="wishText"></div>`;
    typeInto($("#wishText"), CONFIG.wish, 25);
  }
};

function openModal(name, trigger) {
  lastFocus = trigger; builders[name]();
  modal.hidden = false; document.body.classList.add("lock");
  $("#modalClose").focus();
  burstFrom(trigger);
}
function closeModal() {
  clearInterval(typeTimer);
  const v = $("#vid"); if (v) v.pause();
  modal.hidden = true; modalBody.innerHTML = ""; document.body.classList.remove("lock");
  if (lastFocus) lastFocus.focus();
}
document.querySelectorAll(".flower-btn").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.modal, b)));
$("#modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

/* ===================================================================
   MUSIK (tidak autoplay; mulai setelah tombol ditekan)
   =================================================================== */
const audio = new Audio(CONFIG.music); audio.loop = true; audio.preload = "none";
const musicBtn = $("#musicBtn");
function setMusic(on) { musicBtn.classList.toggle("on", on); musicBtn.setAttribute("aria-pressed", on); musicBtn.setAttribute("aria-label", on ? "Jeda musik" : "Putar musik"); }
musicBtn.addEventListener("click", async () => {
  try {
    if (audio.paused) { await audio.play(); setMusic(true); } else { audio.pause(); setMusic(false); }
  } catch (err) {
    setMusic(false); alert("Musik tidak ditemukan. Taruh file di assets/audio/birthday-song.mp3");
  }
});
