const SUPABASE_URL = 'https://lhreibskrvuarjfjlyom.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sh2FIlYA-dCjaxoygQ1mNw_ONq0qGIl';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadProjects() {
    const container = document.querySelector('.container');
    
    if (!container) return; 

    const { data, error } = await supabaseClient.from('projects').select('*');
    
    if (error) {
        console.error('Ошибка при получении данных:', error);
        return;
    }

    container.innerHTML = '';

    data.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('project-card');
        projectCard.innerHTML = `
        <a href="project-detail.html?id=${project.id}" class="project-link">
            <img src="${project.preview_image || 'https://via.placeholder.com/300'}" alt="${project.title}" class="project-img">
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
            </div>
        </a>
        `;
        container.appendChild(projectCard);
    });
}

loadProjects();