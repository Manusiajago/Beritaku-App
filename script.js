// variabel 
const generalBtn = document.getElementById('general');
const politikBtn = document.getElementById('politik');
const hukumBtn = document.getElementById('hukum');
const ekonomiBtn = document.getElementById('ekonomi');
const bolaBtn = document.getElementById('bola');
const olahragaBtn = document.getElementById('olahraga');
const humanioraBtn = document.getElementById('humaniora');
const lifestyleBtn = document.getElementById('lifestyle');
const hiburanBtn = document.getElementById('hiburan');

// search btn variable
const searchBtn = document.getElementById('searchBtn');


//queryInput
const newsQuery = document.getElementById('newsQuery');
const newsType = document.getElementById('newsType');
const newsDetails = document.getElementById('newsDetails');

//Api 
const apiUrl = 'https://api-berita-indonesia.vercel.app/';
const beritaTerbaru = "https://api-berita-indonesia.vercel.app/antara/terbaru/";
const beritaPolitik = "https://api-berita-indonesia.vercel.app/antara/politik/";
const beritaHukum = "https://api-berita-indonesia.vercel.app/antara/hukum/";
const beritaEkonomi = "https://api-berita-indonesia.vercel.app/antara/ekonomi/";
const beritaBola = "https://api-berita-indonesia.vercel.app/antara/bola/";
const beritaOlahraga = "https://api-berita-indonesia.vercel.app/antara/olahraga/";
const beritaHumaniora = "https://api-berita-indonesia.vercel.app/antara/humaniora/";
const beritaLifestyle = "https://api-berita-indonesia.vercel.app/antara/lifestyle/";
const beritaHiburan = "https://api-berita-indonesia.vercel.app/antara/hiburan/"


// Fungsi untuk menampilkan berita dengan pagination
function displayNewsWithPagination(newsPosts, currentPage = 1) {
    const itemsPerPage = 6;
    const newsDetailsContainer = document.getElementById('newsDetails');

    // menghitung total halaman
    const totalPages = Math.ceil(newsPosts.length / itemsPerPage);

    // Potong array sesuai halaman
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPosts = newsPosts.slice(startIndex, endIndex);

    // membersihkan konten sebelumya
    newsDetailsContainer.innerHTML = '';

    // menampilkan berita
    paginatedPosts.forEach(post => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('col-md-4', 'mb-3');
        newsItem.innerHTML = `
            <div class="card h-100">
                <img src="${post.thumbnail}" class="card-img-top" alt="${post.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <small class="text-muted">Publikasi: ${new Date(post.pubDate).toLocaleDateString()}</small>
                    <div class="mt-2">
                        <a href="${post.link}" target="_blank" class="btn btn-primary btn-sm">Baca Selengkapnya</a>
                    </div>
                </div>
            </div>
        `;
        newsDetailsContainer.appendChild(newsItem);
    });

    // Update pagination
    updatePagination(totalPages, currentPage, newsPosts);
}

// Fungsi untuk update pagination
function updatePagination(totalPages, currentPage, allPosts) {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    // Tentukan rentang halaman yang ditampilkan
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Penyesuaian jika jumlah halaman di awal lebih sedikit dari `maxPagesToShow`
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Tombol Previous
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item');
    if (currentPage === 1) prevLi.classList.add('disabled');
    prevLi.innerHTML = `<a class="page-link" href="#" tabindex="-1" aria-disabled="${currentPage === 1}">Previous</a>`;
    prevLi.addEventListener('click', () => {
        if (currentPage > 1) {
            displayNewsWithPagination(allPosts, currentPage - 1);
        }
    });
    paginationContainer.appendChild(prevLi);

    // Nomor Halaman
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.classList.add('page-item');
        if (i === currentPage) pageLi.classList.add('active');
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', () => {
            displayNewsWithPagination(allPosts, i);
        });
        paginationContainer.appendChild(pageLi);
    }

    // Tombol Next
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item');
    if (currentPage === totalPages) nextLi.classList.add('disabled');
    nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
    nextLi.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayNewsWithPagination(allPosts, currentPage + 1);
        }
    });
    paginationContainer.appendChild(nextLi);
}


// Fungsi untuk mengambil berita berdasarkan kategori
async function fetchNews(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Gunakan fungsi baru dengan pagination
        displayNewsWithPagination(data.data.posts);

        // Update judul kategori
        const newsTypeContainer = document.getElementById('newsType');
        newsTypeContainer.innerHTML = `
            <div class="col-12">
                <h2 class="text-center my-3">${getCategotyTitle(url)}</h2>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Event Listeners untuk navigasi kategori
document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = [
        { id: 'general', url: beritaTerbaru },
        { id: 'politik', url: beritaPolitik },
        { id: 'hukum', url: beritaHukum },
        { id: 'ekonomi', url: beritaEkonomi },
        { id: 'bola', url: beritaBola },
        { id: 'olahraga', url: beritaOlahraga },
        { id: 'humaniora', url: beritaHumaniora },
        { id: 'lifestyle', url: beritaLifestyle },
        { id: 'hiburan', url: beritaHiburan }
    ];

    categoryLinks.forEach(category => {
        const link = document.getElementById(category.id);
        link.addEventListener('click', (e) => {
            e.preventDefault();
            fetchNews(category.url);
        });
    });

    // Tampilkan berita terbaru saat halaman dimuat
    fetchNews(beritaTerbaru);

    // Pencarian di semua kategori
    async function searchAllCategories(query) {
        const categories = [
            beritaTerbaru,
            beritaPolitik,
            beritaHukum,
            beritaEkonomi,
            beritaBola,
            beritaOlahraga,
            beritaHumaniora,
            beritaLifestyle,
            beritaHiburan
        ];

        let allResults = [];

        try {
            for (const categoryUrl of categories) {
                const response = await fetch(categoryUrl);
                const data = await response.json();

                const filteredNews = data.data.posts.filter(post =>
                    post.title.toLowerCase().includes(query.toLowerCase()) ||
                    post.description.toLowerCase().includes(query.toLowerCase())
                );

                allResults = [...allResults, ...filteredNews];
            }

            // Tampilkan hasil
            if (allResults.length > 0) {
                // Gunakan fungsi pagination
                displayNewsWithPagination(allResults);

                const newsTypeContainer = document.getElementById('newsType');
                newsTypeContainer.innerHTML = `
                <div class="col-12">
                    <h2 class="text-center my-3">Hasil Pencarian: "${query}"</h2>
                </div>
            `;
            } else {
                const newsDetailsContainer = document.getElementById('newsDetails');
                newsDetailsContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p>Tidak ada hasil untuk pencarian "${query}"</p>
                </div>
            `;

                // Reset pagination
                const paginationContainer = document.querySelector('.pagination');
                paginationContainer.innerHTML = '';
            }
        } catch (error) {
            console.error('Error searching across categories:', error);

            const newsDetailsContainer = document.getElementById('newsDetails');
            newsDetailsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>Terjadi kesalahan dalam pencarian</p>
            </div>
        `;
        }
    }

    // Event listener untuk pencarian
    const searchBtn = document.getElementById('searchBtn');
    const newsQuery = document.getElementById('newsQuery');

    searchBtn.addEventListener('click', async () => {
        const query = newsQuery.value.trim();
        if (query) {
            await searchAllCategories(query);
        } else {
            alert('Silakan masukkan kata kunci pencarian');
        }
    });
});