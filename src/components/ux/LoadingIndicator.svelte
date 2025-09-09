<script lang="ts">
  import { onMount, onDestroy } from "svelte"

  // Daftar teks acak untuk ditampilkan saat loading
  const loadingTexts = [
    "Sabar ya, lagi mikir...",
    "Lagi cari jawaban paling oke nih...",
    "Tunggu bentar, lagi proses...",
    "Bentar lagi kelar deh...",
    "Lagi nyari inspirasi nih...",
    "Tunggu sebentar yaa...",
    "Lagi dirakit nih jawabannya...",
    "Proses dulu ya...",
    "Lagi mikir keras nih...",
    "Sabar sedikit lagi selesai...",
    "Lagi cari referensi terbaik...",
    "Tunggu ya, lagi diatur...",
    "Lagi proses kreatif nih...",
    "Bentar lagi dapet jawabannya...",
    "Lagi nyari sudut pandang terbaik...",
    "Sabar ya lagi hampir selesai...",
    "Lagi cari info paling akurat...",
    "Tunggu sejenak ya...",
    "Lagi susun jawaban terbaik...",
    "Proses berpikir sedang berjalan...",
    "Lagi cari solusi paling pas...",
    "Sabar ya, lagi hampir ketemu...",
    "Lagi kumpulkan semua ide...",
    "Tunggu bentar lagi selesai...",
    "Lagi cari pendekatan terbaik...",
    "Proses kreatif sedang berjalan...",
    "Lagi nyari jawaban paling cocok...",
    "Sabar ya lagi mikir...",
    "Lagi susun alur terbaik...",
    "Tunggu sebentar lagi kelar...",
    "Lagi cari data paling relevan...",
    "Proses pencarian sedang berjalan...",
    "Lagi kumpulkan wawasan terbaik...",
    "Sabar ya lagi proses akhir...",
    "Lagi cari formula paling tepat...",
    "Tunggu ya bentar lagi selesai...",
    "Lagi susun strategi terbaik...",
    "Proses analisis sedang berjalan...",
    "Lagi cari pendekatan unik...",
    "Sabar ya lagi hampir dapet...",
    "Lagi kumpulkan semua referensi...",
    "Tunggu sejenak lagi kelar...",
    "Lagi cari metode paling efektif...",
    "Proses sintesis sedang berjalan...",
    "Lagi nyari solusi inovatif...",
    "Sabar ya lagi tahap akhir...",
    "Lagi susun kerangka terbaik...",
    "Tunggu bentar lagi selesai...",
    "Lagi cari perspektif paling fresh...",
    "Proses evaluasi sedang berjalan...",
    "Lagi kumpulkan semua insight...",
    "Sabar ya lagi hampir selesai...",
    "Lagi cari teknik paling tepat...",
    "Tunggu ya bentar lagi kelar...",
    "Lagi susun konsep terbaik...",
    "Proses integrasi sedang berjalan...",
    "Lagi nyari pendekatan holistik...",
    "Sabar ya lagi tahap finishing...",
    "Lagi kumpulkan semua sumber...",
    "Tunggu sebentar lagi selesai...",
    "Lagi cari metode paling inovatif...",
    "Proses penyempurnaan sedang berjalan...",
    "Lagi nyari solusi paling efektif...",
    "Sabar ya lagi hampir selesai...",
    "Lagi susun pendekatan terbaik...",
    "Tunggu ya bentar lagi kelar...",
    "Lagi cari angle paling menarik...",
    "Proses penyusunan sedang berjalan...",
    "Lagi kumpulkan semua keahlian...",
    "Sabar ya lagi tahap akhir...",
    "Lagi cari teknik paling unik...",
    "Tunggu sejenak lagi selesai...",
    "Lagi susun rencana terbaik...",
    "Proses pengembangan sedang berjalan...",
    "Lagi nyari pendekatan paling fresh...",
    "Sabar ya lagi hampir kelar...",
    "Lagi kumpulkan semua pengetahuan...",
    "Tunggu bentar lagi selesai...",
    "Lagi cari metode paling holistik...",
    "Proses penyempurnaan akhir sedang berjalan...",
    "Maaf lagi berak dulu",
  ]

  // State untuk teks loading dan animasi titik
  let currentText = ""
  let dots = ""
  let dotIntervalId: number
  let textIntervalId: number

  // Fungsi untuk memilih teks acak
  function getRandomText(): string {
    const randomIndex = Math.floor(Math.random() * loadingTexts.length)
    return loadingTexts[randomIndex].replace("...", "")
  }

  // Inisialisasi teks acak saat komponen dimuat
  onMount(() => {
    currentText = getRandomText()

    // Mulai animasi titik
    dotIntervalId = window.setInterval(() => {
      dots = dots.length >= 3 ? "" : dots + "."
    }, 500)

    // Ubah teks acak setiap 5 detik
    textIntervalId = window.setInterval(() => {
      currentText = getRandomText()
      // Reset animasi titik saat teks berubah
      dots = ""
    }, 5000)
  })

  // Bersihkan interval saat komponen dihancurkan
  onDestroy(() => {
    if (dotIntervalId) {
      clearInterval(dotIntervalId)
    }
    if (textIntervalId) {
      clearInterval(textIntervalId)
    }
  })
</script>

<div class="flex items-center">
  <div class="runner">
    <svg viewBox="0 0 100 100">
      <!-- Kepala -->
      <circle cx="50" cy="20" r="10" fill="#333" />
      <!-- Badan -->
      <line x1="50" y1="30" x2="50" y2="60" stroke="#333" stroke-width="3" />
      <!-- Lengan Kiri -->
      <line
        x1="50"
        y1="40"
        x2="35"
        y2="50"
        stroke="#333"
        stroke-width="3"
        class="arm"
      />
      <!-- Lengan Kanan -->
      <line
        x1="50"
        y1="40"
        x2="65"
        y2="50"
        stroke="#333"
        stroke-width="3"
        class="arm"
      />
      <!-- Kaki Kiri -->
      <line
        x1="50"
        y1="60"
        x2="40"
        y2="75"
        stroke="#333"
        stroke-width="3"
        class="leg"
      />
      <!-- Kaki Kanan -->
      <line
        x1="50"
        y1="60"
        x2="60"
        y2="75"
        stroke="#333"
        stroke-width="3"
        class="leg"
      />
    </svg>
  </div>
  <i class="fa fa-spin fa-spinner mr-2"></i>
  <span>{currentText} {dots}</span>
</div>

<style>
  .runner {
    width: 100px;
    height: 100px;
    position: relative;
    animation: bounce 0.5s infinite alternate;
  }

  .runner svg {
    width: 100%;
    height: 100%;
  }

  .leg {
    transform-origin: top center;
    animation: runLeg 0.5s infinite alternate;
  }

  .arm {
    transform-origin: top center;
    animation: runArm 0.5s infinite alternate-reverse;
  }

  @keyframes runLeg {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(30deg);
    }
  }

  @keyframes runArm {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-30deg);
    }
  }

  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-10px);
    }
  }
</style>
