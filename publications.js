const SUPABASE_URL = 'https://lhreibskrvuarjfjlyom.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sh2FIlYA-dCjaxoygQ1mNw_ONq0qGIl';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadPublications() {
    const{data, error} = await supabaseClient
    .from("publications")
    .select("*")
    .order('id', {ascending: true});

    if (error) {
        console.log(error)
        return;
    }

    const container = document.getElementById("publications-list");

    data.forEach(publication => {
        const card = document.createElement("div");
        card.className = "publication-card";

        card.innerHTML = `
        <a href="${publication.url_site}" target="_blank" class="publication-card-link">

            <div class="publication-content">
                <h2 class="publication-title">${publication.name}</h2>

                <div class="publication-description">
                    ${publication.description}
                </div>
            </div>

            <img
                src="${publication.url_img}"
                class="publication-image"
                alt="${publication.name}"
            >

        </a>
        `;

        container.appendChild(card);
    });
}
loadPublications();