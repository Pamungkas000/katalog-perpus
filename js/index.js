let books = JSON.parse(localStorage.getItem('books')) || [];

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function fileToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

/* =======================
   RENDER DAFTAR BUKU
======================= */
function renderBooks() {
  const list = document.getElementById('bookList');
  if (!list) return;

  list.innerHTML = '';

  books.forEach((b, i) => {
    list.innerHTML += `
      <div class="card book-item" style="margin-bottom:20px; padding:20px; border-radius:8px; display:flex; align-items:center; width:80%;">
        <img 
          src="${b.cover || 'https://via.placeholder.com/100x150'}" 
          class="book-cover"
          alt="Cover ${b.judul}">

        <div class="book-info" style="margin-left:20px;">
          <strong>${b.judul}</strong><br>
          <small>${b.penulis} (${b.tahun})</small><br>

          <button onclick="showDetail(${i})">Detail</button>
          <button onclick="editBook(${i})">Edit</button>
          <button onclick="deleteBook(${i})">Hapus</button>
        </div>
      </div>
    `;
  });
}

/* =======================
   DETAIL + REKOMENDASI
======================= */
function showDetail(i) {
  const detail = document.getElementById('detail');
  const rekom = document.getElementById('recommendation');
  const b = books[i];

  detail.innerHTML = `
    <h3>${b.judul}</h3>
    <p><strong>Penulis:</strong> ${b.penulis}</p>
    <p><strong>Tahun:</strong> ${b.tahun}</p>
    <p><strong>Kategori:</strong> ${b.kategori}</p>
    <p>${b.deskripsi || '-'}</p>
    <img src="${b.cover || 'https://via.placeholder.com/200x300'}" style="max-width:200px;">
  `;

  // === SISTEM REKOMENDASI ===
  const rekomendasi = books.filter(
    (book, index) => book.kategori === b.kategori && index !== i
  );

  if (rekomendasi.length === 0) {
    rekom.innerHTML = 'Tidak ada rekomendasi buku lain.';
    return;
  }

  rekom.innerHTML = '';
  rekomendasi.forEach(book => {
    rekom.innerHTML += `
      <div style="margin-bottom:10px; padding:8px; border-bottom:1px solid #ccc;">
        <strong>${book.judul}</strong><br>
        <small>${book.penulis}</small>
      </div>
    `;
  });
}

/* =======================
   CRUD
======================= */
function deleteBook(i) {
  if (confirm('Hapus buku?')) {
    books.splice(i, 1);
    saveBooks();
    renderBooks();
    document.getElementById('detail').innerHTML = 'Pilih buku';
    document.getElementById('recommendation').innerHTML = 'Pilih buku untuk melihat rekomendasi';
  }
}

function editBook(i) {
  localStorage.setItem('editIndex', i);
  location.href = 'tambah.html';
}

/* =======================
   FORM TAMBAH / EDIT
======================= */
const form = document.getElementById('bookForm');

if (form) {
  const idInput = document.getElementById('id');
  const judul = document.getElementById('judul');
  const penulis = document.getElementById('penulis');
  const tahun = document.getElementById('tahun');
  const kategori = document.getElementById('kategori');
  const deskripsi = document.getElementById('deskripsi');
  const coverInput = document.getElementById('cover');
  const preview = document.getElementById('preview');

  let coverBase64 = '';

  coverInput.addEventListener('change', () => {
    const file = coverInput.files[0];
    if (file) {
      fileToBase64(file, base64 => {
        coverBase64 = base64;
        preview.src = base64;
      });
    }
  });

  const editIndex = localStorage.getItem('editIndex');

  if (editIndex !== null) {
    const b = books[editIndex];
    idInput.value = editIndex;
    judul.value = b.judul;
    penulis.value = b.penulis;
    tahun.value = b.tahun;
    kategori.value = b.kategori;
    deskripsi.value = b.deskripsi || '';
    coverBase64 = b.cover || '';
    preview.src = coverBase64;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = {
      judul: judul.value,
      penulis: penulis.value,
      tahun: tahun.value,
      kategori: kategori.value,
      deskripsi: deskripsi.value,
      cover: coverBase64
    };

    if (idInput.value !== '') books[idInput.value] = data;
    else books.push(data);

    saveBooks();
    localStorage.removeItem('editIndex');
    location.href = 'index.html';
  });
}

renderBooks();
