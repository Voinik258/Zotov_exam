const tutors = [
    {
        name: 'Stanislav Oskin',
        level: 'продвинутый',
        languages: ['Русский', 'Английский'],
        experience: 5,
        
        days: ['Пн', 'Ср', 'Пт'],
        hours: [10, 11, 14],
        photo: 'https://via.placeholder.com/100?text=Oskin'
    },
    {
        name: 'Vladislav Zaytsev',
        level: 'начальный',
        languages: ['Русский'],
        experience: 3,
        
        days: ['Вт', 'Чт'],
        hours: [9, 10],
        photo: 'https://via.placeholder.com/100?text=Zaytsev'
    },
    {
        name: 'Anna Petrova',
        level: 'средний',
        languages: ['Русский', 'Французский'],
        experience: 7,
        
        days: ['Пн', 'Ср', 'Сб'],
        hours: [12, 13, 14, 15],
        photo: 'https://via.placeholder.com/100?text=Petrova'
    },
    {
        name: 'Maria Ivanova',
        level: 'продвинутый',
        languages: ['Английский', 'Испанский'],
        experience: 6,
    
        days: ['Вт', 'Чт', 'Пт'],
        hours: [16, 17, 18],
        photo: 'https://via.placeholder.com/100?text=Ivanova'
    }
];

const tutorsTableBody = document.querySelector('#tutorsTable tbody');
const levelSelect = document.getElementById('languageLevel');
const daysSelect = document.getElementById('availableDays');
const timeInput = document.getElementById('availableTime');

function renderTutors(filteredTutors) {
    tutorsTableBody.innerHTML = '';
    filteredTutors.forEach((tutor, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${tutor.photo}" alt="Фото" width="50" class="rounded"></td>
            <td>${tutor.name}</td>
            <td>${tutor.level}</td>
            <td>${tutor.languages.join(', ')}</td>
            <td>${tutor.experience}</td>
            <td>${tutor.rate}</td>
            <td><button class="btn btn-sm btn-outline-primary" data-index="${index}">Выбрать</button></td>
        `;
        tutorsTableBody.appendChild(row);
    });
}

function applyFilters() {
    const selectedLevel = levelSelect.value;
    const selectedDays = Array.from(daysSelect.selectedOptions).map(o => o.value);
    const timeRange = timeInput.value.split('-').map(Number);

    const filtered = tutors.filter(tutor => {
        const levelMatch = !selectedLevel || tutor.level === selectedLevel;
        const dayMatch = selectedDays.length === 0 || selectedDays.some(day => tutor.days.includes(day));
        const timeMatch = timeRange.length === 2
            ? tutor.hours.some(h => h >= timeRange[0] && h <= timeRange[1])
            : true;
        return levelMatch && dayMatch && timeMatch;
    });

    renderTutors(filtered);
}

[levelSelect, daysSelect, timeInput].forEach(el => el.addEventListener('input', applyFilters));

tutorsTableBody.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
        const index = e.target.dataset.index;
        const tutor = tutors[index];

        document.getElementById('selectedTutorDetails').classList.remove('d-none');
        document.getElementById('detailPhoto').src = tutor.photo;
        document.getElementById('detailName').textContent = tutor.name;
        document.getElementById('detailLanguages').textContent = tutor.languages.join(', ');
        document.getElementById('detailExperience').textContent = tutor.experience;
        document.getElementById('detailRate').textContent = tutor.rate;

        [...tutorsTableBody.rows].forEach(row => row.classList.remove('table-success'));
        e.target.closest('tr').classList.add('table-success');
    }
});

renderTutors(tutors);
