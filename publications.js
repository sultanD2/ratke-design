const SUPABASE_URL = 'https://lhreibskrvuarjfjlyom.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sh2FIlYA-dCjaxoygQ1mNw_ONq0qGIl';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadPublications() {
    const{data, error} = await supabaseClient.from("publications").select("*");

    if (error) {
        console.log(error)
        return;
    }

    const container = document.getElementById("publications-list");

    data.forEach(publication => {
        const card = document.createElement("div");
        card.className = "publication-card";

        card.innerHTML = `
            <h2 class="publication-title">${publication.name}</h2>

            <img
                src="${publication.url_img}"
                class="publication-image"
                alt="${publication.name}"
            >

            <a
                class="publication-link"
                href="${publication.url_site}"
                target="_blank"
            >
                Подробнее →
            </a>

            <div class="publication-description">
                ${publication.description}
            </div>
        `;

        container.appendChild(card);
    });
}
loadPublications();