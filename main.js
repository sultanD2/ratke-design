const SUPABASE_URL = 'https://lhreibskrvuarjfjlyom.supabase.co';
const SUPABASE_KEY = 'sb_publishable_sh2FIlYA-dCjaxoygQ1mNw_ONq0qGIl';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



async function loadProjects() {

    const container = document.querySelector('.container');

    if (!container) return;


    const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('id', {ascending: true});


    if (error) {
        console.error('Ошибка при получении данных:', error);
        return;
    }


    container.innerHTML = '';


    data.forEach(project => {


        const images = [
            project.preview_image,
            ...(project.gallery_images || [])
        ].filter(Boolean);


        let currentIndex = 0;


        const projectCard = document.createElement('div');

        projectCard.classList.add('project-card');


        projectCard.innerHTML = `

            <div class="project-info">
                <h2 class="project-title">
                    ${project.title}
                </h2>
                <div class="project-description">
                    <p class="project-mini-description">
                        ${project.mini_description || ""}
                    </p>
                </div>
            </div>


            <div class="project-gallery">


                <a href="/projects/${project.slug}">
                    <img 
                        class="project-img"
                        src="${images[0]}"
                        alt="${getImageAlt(images[0], project)}"
                        loading="eager"
                        decoding="async">
                </a>


                <button class="gallery-btn gallery-prev">
                    &#10094;
                </button>


                <button class="gallery-btn gallery-next">
                    &#10095;
                </button>


                <div class="image-counter">
                    1 / ${images.length}
                </div>


                <div class="image-dots"></div>


            </div>
        `;


        container.appendChild(projectCard);



        const img = projectCard.querySelector(".project-img");
        const counter = projectCard.querySelector(".image-counter");
        const dotsContainer = projectCard.querySelector(".image-dots");

        const prevBtn = projectCard.querySelector(".gallery-prev");
        const nextBtn = projectCard.querySelector(".gallery-next");

        if(images.length <= 1){

            prevBtn.style.display = "none";
            nextBtn.style.display = "none";

        }



        function renderDots(){

            dotsContainer.innerHTML = "";


            images.forEach((_, index)=>{


                const dot = document.createElement("div");


                dot.className =
                    index === currentIndex
                    ? "image-dot active"
                    : "image-dot";



                dot.addEventListener("click", e=>{

                    e.preventDefault();
                    e.stopPropagation();

                    currentIndex = index;

                    updateGallery();

                });



                dotsContainer.appendChild(dot);


            });


        }


        function getImageAlt(imageUrl, project) {
            const fileName = imageUrl
                .split('/')
                .pop()
                .replace(/\.[^/.]+$/, '');

            const translate = {
                gostinaya: "гостиная",
                koridor: "коридор",
                kuhnya: "кухня",
                spalnya: "спальня",
                table: "стол",
                vanna: "ванная"
            };

            let room = null;

            Object.keys(translate).forEach(word => {
                if(fileName.includes(word)){
                    room = translate[word];
                }
            });

            if(room){
                return `${project.title} — ${room}`;
            }

            return project.title;
        }


        function updateGallery(){

            img.classList.add("changing");


            setTimeout(() => {

                img.src = images[currentIndex];
                img.alt = getImageAlt(images[currentIndex], project);
                img.loading = currentIndex === 0 ? "eager" : "lazy";
                img.decoding = "async";

                img.onload = () => {
                    img.classList.remove("changing");
                };

            }, 200);



            counter.textContent =
                `${currentIndex + 1} / ${images.length}`;


            renderDots();

        }

        nextBtn.addEventListener("click", e=>{


            e.preventDefault();
            e.stopPropagation();


            currentIndex++;


            if(currentIndex >= images.length){
                currentIndex = 0;
            }


            updateGallery();


        });

        prevBtn.addEventListener("click", e=>{


            e.preventDefault();
            e.stopPropagation();


            currentIndex--;


            if(currentIndex < 0){
                currentIndex = images.length - 1;
            }


            updateGallery();


        });

        let touchStartX = 0;



        img.addEventListener("touchstart", e=>{

            touchStartX = e.changedTouches[0].screenX;

        });




        img.addEventListener("touchend", e=>{


            let touchEndX = e.changedTouches[0].screenX;



            if(Math.abs(touchEndX - touchStartX) < 50){
                return;
            }




            if(touchStartX > touchEndX){


                currentIndex++;


                if(currentIndex >= images.length){
                    currentIndex = 0;
                }


            }
            else{


                currentIndex--;


                if(currentIndex < 0){
                    currentIndex = images.length - 1;
                }


            }



            updateGallery();


        });
    });

}

loadProjects();