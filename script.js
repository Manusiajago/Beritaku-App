// Variabel untuk tombol kategori
const generalBtn = document.getElementById('general');
const politikBtn = document.getElementById('politik');
const hukumBtn = document.getElementById('hukum');
const ekonomiBtn = document.getElementById('ekonomi');
const bolaBtn = document.getElementById('bola');
const olahragaBtn = document.getElementById('olahraga');
const humanioraBtn = document.getElementById('humaniora');
const lifestyleBtn = document.getElementById('lifestyle');
const hiburanBtn = document.getElementById('hiburan');

// Variabel untuk tombol pencarian
const searchBtn = document.getElementById('searchBtn');
const newsQuery = document.getElementById('newsQuery');
const newsDetails = document.getElementById('newsDetails');

// URL API
const beritaTerbaru = "https://api-berita-indonesia.vercel.app/antara/terbaru/";
const beritaPolitik = "https://api-berita-indonesia.vercel.app/antara/politik/";
const beritaHukum = "https://api-berita-indonesia.vercel.app/antara/hukum/";
const beritaEkonomi = "https://api-berita-indonesia.vercel.app/antara/ekonomi/";
const beritaBola = "https://api-berita-indonesia.vercel.app/antara/bola/";
const beritaOlahraga = "https://api-berita-indonesia.vercel.app/antara/olahraga/";
const beritaHumaniora = "https://api-berita-indonesia.vercel.app/antara/humaniora/";
const beritaLifestyle = "https://api-berita-indonesia.vercel.app/antara/lifestyle/";
const beritaHiburan = "https://api-berita-indonesia.vercel.app/antara/hiburan/";

// Fungsi untuk menampilkan berita
function displayNews(posts) {
    newsDetails.innerHTML = ''; // Bersihkan konten sebelumnya

    posts.forEach(post => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('col-md-4', 'mb-3');
        newsItem.innerHTML = `
            <div class="card h-100">
                <img src="${post.thumbnail}" class="card-img-top" alt="${post.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <a href="${post.link}" target="_blank" class="btn btn-primary">Baca Selengkapnya</a>
                </div>
                <div class="card-footer">
                    <small class="text-muted">${new Date(post.pubDate).toLocaleDateString()}</small>
                </div>
            </div>
        `;
        newsDetails.appendChild(newsItem);
    });
}

// Fungsi untuk mengambil berita dari API
async function fetchNews(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data.posts;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// Fungsi untuk mencari berita
async function searchNews() {
    const searchQuery = newsQuery.value.toLowerCase();

    // Gunakan berita terbaru sebagai sumber pencarian
    const allNews = await fetchNews(beritaTerbaru);

    // Filter berita berdasarkan query
    const filteredNews = allNews.filter(post =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.description.toLowerCase().includes(searchQuery)
    );

    // Tampilkan hasil pencarian
    displayNews(filteredNews);
}

// Event listener untuk tombol pencarian
searchBtn.addEventListener('click', searchNews);

// Event listener untuk enter di input pencarian
newsQuery.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchNews();
    }
});

// Fungsi untuk mengambil berita berdasarkan kategori
async function fetchNewsByCategory(url) {
    try {
        const posts = await fetchNews(url);
        displayNews(posts);
    } catch (error) {
        console.error('Error fetching category news:', error);
    }
}

// Event listeners untuk kategori berita
generalBtn.addEventListener('click', () => fetchNewsByCategory(beritaTerbaru));
politikBtn.addEventListener('click', () => fetchNewsByCategory(beritaPolitik));
hukumBtn.addEventListener('click', () => fetchNewsByCategory(beritaHukum));
ekonomiBtn.addEventListener('click', () => fetchNewsByCategory(beritaEkonomi));
bolaBtn.addEventListener('click', () => fetchNewsByCategory(beritaBola));
olahragaBtn.addEventListener('click', () => fetchNewsByCategory(beritaOlahraga));
humanioraBtn.addEventListener('click', () => fetchNewsByCategory(beritaHumaniora));
lifestyleBtn.addEventListener('click', () => fetchNewsByCategory(beritaLifestyle));
hiburanBtn.addEventListener('click', () => fetchNewsByCategory(beritaHiburan));

// Tampilkan berita terbaru saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchNewsByCategory(beritaTerbaru);
});