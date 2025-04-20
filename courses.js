document.addEventListener('DOMContentLoaded', function () {
    const courses =
     [
        { name: 'Beginner Russian', description: 'Learn the basics of Russian.', price: '' },
        { name: 'Intermediate Russian', description: 'Expand your vocabulary and grammar.', price: '' },
        { name: 'Advanced Russian', description: 'Fluent Russian for professionals.', price: '' }
    ];

    let filteredCourses = [...courses]; 
    const coursesPerPage = 3;
    let currentPage = 1;
    const courseList = document.getElementById('courseList');
    const pagination = document.getElementById('pagination');
    const courseSearchInput = document.getElementById('courseSearch');

    // Функция отображения курсов на текущей странице
    function showPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * coursesPerPage;
        const endIndex = startIndex + coursesPerPage;
        const visibleCourses = filteredCourses.slice(startIndex, endIndex);

        courseList.innerHTML = '';
        visibleCourses.forEach(course => {
            const courseItem = `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${course.name}</h5>
                            <p class="card-text">${course.description}</p>
                            <p><strong>${course.price}</strong></p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#requestModal">Request Info</button>
                        </div>
                    </div>
                </div>
            `;
            courseList.innerHTML += courseItem;
        });

        updatePagination();
    }

    // Функция обновления пагинации
    function updatePagination() {
        const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.querySelector('a').addEventListener('click', () => showPage(i));
            pagination.appendChild(pageItem);
        }
    }

    // Функция поиска курсов
    courseSearchInput.addEventListener('input', function () {
        const searchQuery = this.value.toLowerCase();
        filteredCourses = courses.filter(course => course.name.toLowerCase().includes(searchQuery));  
        showPage(1);  
    });

    showPage(1);  
});
