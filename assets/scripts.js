const angkaRomaji = {
  1: 'ichi', 2: 'ni', 3: 'san', 4: 'yon', 5: 'go',
  6: 'roku', 7: 'nana', 8: 'hachi', 9: 'kyuu', 10: 'juu'
};

const soalInput = document.getElementById('soal');
const jawabanInput = document.getElementById('jawaban');
const hasilBox = document.getElementById('hasil');
const ulangButton = document.getElementById('ulang');
const digitRadio = document.getElementsByName('digit');

// Fungsi generate soal angka berdasarkan digit
function generateSoal() {
  const digit = parseInt(document.querySelector('input[name="digit"]:checked').value);
  let min = digit;
  let max = digit * 9 + digit - 1;
  const soal = Math.floor(Math.random() * (max - min + 1)) + min;
  soalInput.value = soal;
  jawabanInput.value = '';
  hasilBox.innerHTML = '';
  jawabanInput.focus();
}

// Fungsi ubah angka ke romaji dengan pelafalan khusus
function angkaKeRomaji(num) {
  if (num === 0) return '';

  let hasil = [];
  let ribu = Math.floor(num / 1000);
  let ratus = Math.floor((num % 1000) / 100);
  let puluh = Math.floor((num % 100) / 10);
  let satu = num % 10;

  // RIBUAN
  if (ribu > 0) {
    if (ribu === 1) hasil.push('sen');
    else if (ribu === 3) hasil.push('san zen'); // 3000
    else if (ribu === 8) hasil.push('has sen'); // 8000
    else hasil.push(angkaRomaji[ribu], 'sen');
  }

  // RATUSAN - pelafalan khusus
  if (ratus > 0) {
    if (ratus === 1) hasil.push('hyaku'); // 100
    else if (ratus === 3) hasil.push('san byaku'); // 300
    else if (ratus === 6) hasil.push('rop pyaku'); // 600
    else if (ratus === 8) hasil.push('hap pyaku'); // 800
    else hasil.push(angkaRomaji[ratus], 'hyaku');
  }

  // PULUHAN
  if (puluh > 0) {
    if (puluh === 1) hasil.push('juu'); // 10
    else if (puluh === 3) hasil.push('san juu'); // 30
    else hasil.push(angkaRomaji[puluh], 'juu');
  }

  // SATUAN - pakai yon dan nana biar aman
  if (satu > 0) {
    if (satu === 4) hasil.push('yon');
    else if (satu === 7) hasil.push('nana');
    else if (satu === 9) hasil.push('kyuu');
    else hasil.push(angkaRomaji[satu]);
  }

  return hasil.join(' ');
}

// Update input soal sesuai mode
function updateMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === 'otomatis') {
    soalInput.readOnly = true;
    soalInput.placeholder = "Akan di-generate otomatis";
    ulangButton.disabled = false;
    digitRadio.forEach(x => {
        x.disabled = false;
    });
    generateSoal();
  } else {
    soalInput.readOnly = false;
    soalInput.placeholder = "Isi manual di mode Kreatif";
    soalInput.value = '';
    jawabanInput.value = '';
    hasilBox.innerHTML = '';
    ulangButton.disabled = true;
    digitRadio.forEach(x => {
        x.disabled = true;
    });
    soalInput.focus();
  }
}

// Cek jawaban
document.getElementById('kirim').addEventListener('click', () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const soal = parseInt(soalInput.value);

  if (!soal || soal < 1) {
    hasilBox.innerHTML = `<div class="salah">Isi soal dulu di mode Kreatif</div>`;
    return;
  }

  const jawabanUser = jawabanInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
  const jawabanBenar = angkaKeRomaji(soal);

  if (jawabanUser.replace(/\s+/g, "") === jawabanBenar.replace(/\s+/g, "")) {
    hasilBox.innerHTML = `<div class="benar">Benar!</div><div>Jawaban: ${jawabanBenar}</div>`;
  } else {
    hasilBox.innerHTML =
      `<div class="salah">Salah</div>
       <div><b>Jawaban yang benar</b></div>
       <div class="jawaban">${soal}</div>
       <div class="benar">${jawabanBenar}</div>`;
  }

// auto reload
  /*if (mode === 'otomatis') {
    setTimeout(generateSoal, 1500);
  }*/
});

// Tombol ulang
ulangButton.addEventListener('click', () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === 'otomatis') generateSoal();
  else {
    soalInput.value = '';
    jawabanInput.value = '';
    hasilBox.innerHTML = '';
    soalInput.focus();
  }
});

// Event listener
document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', updateMode);
});
document.querySelectorAll('input[name="digit"]').forEach(radio => {
  radio.addEventListener('change', () => {
    if(document.querySelector('input[name="mode"]:checked').value === 'otomatis') generateSoal();
  });
});

// Tab switching
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Enter untuk kirim
jawabanInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('kirim').click();
});

// Init
updateMode();
