const courses = 
[
    {
        id: 1,
        name: "Русский для начинающих",
        level: "beginner",
        description: "Изучение алфавита, базовой грамматики и повседневной лексики."
    },
    {
        id: 2,
        name: "Русский для путешествий",
        level: "intermediate",
        description: "Практические диалоги, заказ еды, бронирование и транспорт."
    },
    {
        id: 3,
        name: "Деловой русский",
        level: "advanced",
        description: "Формальная лексика, переписка, встречи и переговоры."
    }
];

// Отображение курсов
function renderCourses(container, searchInput) 
{
    function render() 
    {
        container.innerHTML = "";
        const query = searchInput.value.toLowerCase();
        const filtered = courses.filter(course =>
            course.name.toLowerCase().includes(query) ||
            course.level.toLowerCase().includes(query)
        );

        filtered.forEach(course => 
            {
            container.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${course.name}</h5>
                            <p class="card-text">${course.description}</p>
                            <span class="badge bg-secondary text-uppercase">${course.level}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    render();
    searchInput.addEventListener("input", render);
}

// Отображение на странице
document.addEventListener("DOMContentLoaded", () =>
{
    const courseList = document.getElementById("courseList");
    const courseSearch = document.getElementById("courseSearch");
    renderCourses(courseList, courseSearch);
});


const apiUrlCourses = 'http://exam-api-courses.std-900.ist.mospolytech.ru/courses';

function fetchCourses(page = 1, limit = 10) {
    fetch(`${apiUrlCourses}?page=${page}&limit=${limit}`)
        .then(response => response.json())
        .then(data => renderCourses(data))
        .catch(error => console.log('Error fetching courses:', error));
}

function renderCourses(courses) {
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = '';
    courses.forEach(course => {
        coursesList.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${course.name}</h5>
                        <p class="card-text">${course.description}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#requestModal" data-course-id="${course.id}">Оформить заявку</button>
                    </div>
                </div>
            </div>
        `;
    });
}


function renderPagination(totalItems, itemsPerPage, currentPage) {
    const paginationContainer = document.getElementById('coursesPagination');
    paginationContainer.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('li');
        button.classList.add('page-item');
        button.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            fetchCourses(currentPage);
        });

        paginationContainer.appendChild(button);
    }
}
