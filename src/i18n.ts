import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home.title": "Digital Gift Box",
      "home.subtitle": "Create magical, personalized digital gift experiences for your loved ones.",
      "home.createBtn": "Create a Gift",
      "home.openBtn": "Open a Gift",
      "create.title": "Create a Gift Box",
      "create.subtitle": "Fill in the details to create a magical surprise.",
      "create.giftId": "Gift ID (URL)",
      "create.giftIdPlaceholder": "e.g., happy-birthday-sarah",
      "create.password": "Secret Password",
      "create.passwordPlaceholder": "To unlock the gift",
      "create.sender": "Sender Name",
      "create.senderPlaceholder": "Who is this from?",
      "create.recipient": "Recipient Name",
      "create.recipientPlaceholder": "Who is this for?",
      "create.message": "Personal Message",
      "create.messagePlaceholder": "Write your heartfelt message here...",
      "create.theme": "Select Theme",
      "create.links": "Surprise Links (Optional)",
      "create.linkTitle": "Link Title",
      "create.linkTitlePlaceholder": "e.g., Your Spotify Playlist",
      "create.linkUrl": "URL",
      "create.linkUrlPlaceholder": "e.g., open.spotify.com/...",
      "create.addLink": "Add Another Link",
      "create.submit": "Create Gift Box",
      "create.creating": "Creating...",
      "create.success": "Gift Box Created!",
      "create.successDesc": "Your gift is ready to be shared.",
      "create.copyLink": "Copy Gift Link",
      "create.copied": "Copied!",
      "create.createAnother": "Create Another Gift",
      "create.preview": "Live Preview",
      "open.title": "Unlock Your Gift",
      "open.subtitle": "Enter the secret password to reveal your surprise.",
      "open.passwordPlaceholder": "Enter password...",
      "open.unlockBtn": "Unlock Gift",
      "open.unlocking": "Unlocking...",
      "open.error": "Incorrect password. Try again!",
      "reveal.openBtn": "Open Gift",
      "reveal.from": "From",
      "reveal.to": "To",
      "reveal.surprises": "Your Surprises",
      "reveal.musicOn": "Music On",
      "reveal.musicOff": "Music Off",
      "theme.romantic": "Romantic",
      "theme.birthday": "Birthday",
      "theme.cute": "Cute",
      "theme.minimal": "Minimal",
      "theme.galaxy": "Galaxy"
    }
  },
  id: {
    translation: {
      "home.title": "Kotak Kado Digital",
      "home.subtitle": "Buat pengalaman kado digital yang ajaib dan personal untuk orang tersayang.",
      "home.createBtn": "Buat Kado",
      "home.openBtn": "Buka Kado",
      "create.title": "Buat Kotak Kado",
      "create.subtitle": "Isi detail berikut untuk membuat kejutan ajaib.",
      "create.giftId": "ID Kado (URL)",
      "create.giftIdPlaceholder": "cth: selamat-ulang-tahun-sarah",
      "create.password": "Kata Sandi Rahasia",
      "create.passwordPlaceholder": "Untuk membuka kado",
      "create.sender": "Nama Pengirim",
      "create.senderPlaceholder": "Dari siapa kado ini?",
      "create.recipient": "Nama Penerima",
      "create.recipientPlaceholder": "Untuk siapa kado ini?",
      "create.message": "Pesan Personal",
      "create.messagePlaceholder": "Tulis pesan tulusmu di sini...",
      "create.theme": "Pilih Tema",
      "create.links": "Tautan Kejutan (Opsional)",
      "create.linkTitle": "Judul Tautan",
      "create.linkTitlePlaceholder": "cth: Playlist Spotify Kamu",
      "create.linkUrl": "URL",
      "create.linkUrlPlaceholder": "cth: open.spotify.com/...",
      "create.addLink": "Tambah Tautan Lain",
      "create.submit": "Buat Kotak Kado",
      "create.creating": "Membuat...",
      "create.success": "Kotak Kado Berhasil Dibuat!",
      "create.successDesc": "Kado kamu siap untuk dibagikan.",
      "create.copyLink": "Salin Tautan Kado",
      "create.copied": "Tersalin!",
      "create.createAnother": "Buat Kado Lain",
      "create.preview": "Pratinjau Langsung",
      "open.title": "Buka Kado Kamu",
      "open.subtitle": "Masukkan kata sandi rahasia untuk melihat kejutanmu.",
      "open.passwordPlaceholder": "Masukkan kata sandi...",
      "open.unlockBtn": "Buka Kado",
      "open.unlocking": "Membuka...",
      "open.error": "Kata sandi salah. Coba lagi!",
      "reveal.openBtn": "Buka Kado",
      "reveal.from": "Dari",
      "reveal.to": "Untuk",
      "reveal.surprises": "Kejutan Untukmu",
      "reveal.musicOn": "Musik Nyala",
      "reveal.musicOff": "Musik Mati",
      "theme.romantic": "Romantis",
      "theme.birthday": "Ulang Tahun",
      "theme.cute": "Imut",
      "theme.minimal": "Minimalis",
      "theme.galaxy": "Galaksi"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
