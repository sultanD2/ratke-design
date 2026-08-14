const SUPABASE_URL = 'https://lhreibskrvuarjfjlyom.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sh2FIlYA-dCjaxoygQ1mNw_ONq0qGIl';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


function getImageAlt(imageUrl, projectTitle) {

    const fileName = imageUrl
        .split('/')
        .pop()
        .replace(/\.[^/.]+$/, "");


    const words = fileName.split("-");


    const roomMap = {
        gostinaya: "гостиная",
        koridor: "коридор",
        kuhnya: "кухня",
        spalnya: "спальня",
        table: "комната",
        vanna: "ванная",
        room: "комната",
        house: "дом",
        door: "дверь",
        fasad: "фасад",
        skaf: "шкаф",
        garden: "сад",
        stair: "лестница",
        gym: "зал",
        hallway: "прихожая",   
        loggia: "лоджия",
        secondfloor: "второй этаж",
        cabinet: "кабинет",
        childrenroom: "детская комната",
        dressingroom: "гардеробная комната",
        main: "Главная",
        cash: "касса",
        foodzone: "зона для еды",
        window: "окно"
    };


    let room = "";


    words.forEach(word => {
        if(roomMap[word]){
            room = roomMap[word];
        }
    });


    if(room){
        return `${projectTitle} — ${room}`;
    }


    return projectTitle;
}

async function loadSingleProject() {
    // const urlParams = new URLSearchParams(window.location.search);
    // const projectSlug = urlParams.get('slug');

    const pathParts = window.location.pathname.split("/");
    const projectSlug = pathParts[pathParts.length - 1];

    const titleElement = document.getElementById('detailed-title');
    const descriptionElement = document.getElementById('detailed-desc');
    const galleryContainer  = document.getElementById('gallery-container');

    const subtitleElement = document.getElementById("detailed-subtitle");

    if(!titleElement) return;


    if (!projectSlug) {
        document.getElementById('detailed-title').innerText = 'Проект не найден';
        return;
    }

    const{data: project, error} = await supabaseClient.from('projects').select('*').eq("slug", projectSlug).single();

    if (error) {
        console.error('ошибка', error);
        document.getElementById('detailed-title').innerText = 'Ошибка загрузки проекта';
        return;
    }
    

    titleElement.innerText = project.title;
    if (project.seo_title) {
        document.title = project.seo_title;
    }
    if (project.seo_description) {
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", project.seo_description);
    }
    if (subtitleElement) {
        subtitleElement.innerText = project.subtitle || "";
    }
    if(descriptionElement) {
    descriptionElement.innerText = project.description || 'описание отсутсвует';
    }
    
    if(!galleryContainer) return;
    
    galleryContainer.innerHTML = '';

    if(project.gallery_images && project.gallery_images.length > 0) {
        project.gallery_images.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            
            if (index === 0) {
                img.loading = "eager";
            } else {
                img.loading = "lazy";
            }
            
            img.decoding = "async";

            img.onload = () => {
                console.log("Загрузилась:", imgUrl);
            };

            img.onerror = () => {
                console.log("ОШИБКА загрузки:", imgUrl);
            };
            img.alt = getImageAlt(imgUrl, project.title);
            img.classList.add('gallery-img');

            img.addEventListener('click', function(){
                openPicture(index, project.gallery_images);
            });

            galleryContainer.appendChild(img);
        }); 
    } else {
        galleryContainer.innerHTML = '<p>В галерее пока нет фотографий</p>';
    }
}

function openPicture(currentIndex, imageArray) {
    const modal = document.createElement('div');
    modal.classList.add('image-modal');

    const modalImg = document.createElement('img');

    modalImg.src = imageArray[currentIndex];
    modalImg.classList.add('image-modal-content');

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML =  '&times';
    closeBtn.classList.add('image-modal-close');

    const btnNext = document.createElement('span');
    btnNext.innerHTML =  '&#10095';
    btnNext.classList.add('btn-next');

    const btnPrevious = document.createElement('span');
    btnPrevious.innerHTML =  '&#10094'; 
    btnPrevious.classList.add('btn-previous');

    function updatePicture(index) {
        currentIndex = index;
        modalImg.src = imageArray[currentIndex];
    }

    btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        let nextIndex = currentIndex + 1;
        if(nextIndex >= imageArray.length) nextIndex = 0;
        updatePicture(nextIndex);
    });

    btnPrevious.addEventListener('click', (e) => {
        e.stopPropagation();
        let previousIndex = currentIndex - 1;
        if(previousIndex < 0) previousIndex = imageArray.length - 1;
        updatePicture(previousIndex);
    });

    modal.appendChild(closeBtn);
    modal.appendChild(btnPrevious);
    modal.appendChild(modalImg);
    modal.appendChild(btnNext);
    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click',  (e) => {
        if(e.target == modal) closeModal();
    });
}

loadSingleProject();