document.addEventListener('DOMContentLoaded', function () {
    const courses = [
        { name: 'Beginner Russian', description: 'Learn the basics of Russian.', price: 500 },
        { name: 'Intermediate Russian', description: 'Expand your vocabulary and grammar.', price: 700 },
        { name: 'Advanced Russian', description: 'Fluent Russian for professionals.', price: 900 }
    ];

    const tutors = [
        { name: 'Stanislav Oskin', level: 'продвинутый', experience: 5, availableTimes: ['10:00', '12:00', '14:00', '20:00'] },
        { name: 'Vladislav Zaytsev', level: 'начальный', experience: 3, availableTimes: ['10:00', '12:00', '14:00', '20:00'] },
        { name: 'Anna Petrova', level: 'средний', experience: 7, availableTimes: ['10:00', '12:00', '14:00', '20:00'] },
        { name: 'Maria Ivanova', level: 'продвинутый', experience: 6, availableTimes: ['10:00', '12:00', '14:00', '20:00'] }
    ];

    function createRadioButtons(data, containerId, name, callback) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        data.forEach((item, index) => {
            const label = document.createElement('label');
            label.classList.add('form-check-label');
            label.innerHTML = `${item.name} - ${item.level || item.description} (Цена: ${item.price || ''} руб.)`;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.classList.add('form-check-input');
            radio.name = name;
            radio.value = item.name;
            radio.dataset.index = index;
            radio.dataset.item = JSON.stringify(item);

            const div = document.createElement('div');
            div.classList.add('form-check');
            div.appendChild(radio);
            div.appendChild(label);
            container.appendChild(div);

            radio.addEventListener('change', callback);
        });
    }


    createRadioButtons(courses, 'courseSelection', 'course', function () {
        const selectedCourseRadio = document.querySelector('input[name="course"]:checked');
        const selectedCourse = JSON.parse(selectedCourseRadio.dataset.item);
        updateTotalPrice(selectedCourse);
    });

    
    createRadioButtons(tutors, 'tutorSelection', 'tutor', function () {
        const selectedTutor = JSON.parse(this.dataset.item);

        
        const timeSelect = document.getElementById('courseTime');
        timeSelect.innerHTML = '<option value="">Выберите время</option>';
        selectedTutor.availableTimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });

        const selectedCourseRadio = document.querySelector('input[name="course"]:checked');
        if (selectedCourseRadio) {
            const selectedCourse = JSON.parse(selectedCourseRadio.dataset.item);
            updateTotalPrice(selectedCourse);
        }
    });

    
    function updateTotalPrice(course) {
        const selectedTutorRadio = document.querySelector('input[name="tutor"]:checked');
        const selectedTime = document.getElementById('courseTime').value;
        const isEvening = selectedTime === '20:00';

        if (selectedTutorRadio) {
            const selectedTutor = JSON.parse(selectedTutorRadio.dataset.item);
            const totalPrice = calculateTotalPrice(course, selectedTutor, isEvening);
            document.getElementById('totalPrice').value = `${totalPrice} руб.`;
        }
    }

    
    function calculateTotalPrice(course, tutor, isEvening) {
        let basePrice = course.price;

        const eveningSurcharge = isEvening ? 500 : 0;

        const earlyRegistrationDiscount = document.getElementById('earlyRegistration')?.checked ? 0.1 : 0;
        const groupEnrollmentDiscount = document.getElementById('groupEnrollment')?.checked ? 0.15 : 0;
        const intensiveCourseSurcharge = document.getElementById('intensiveCourse')?.checked ? 0.2 : 0;
        const supplementaryMaterialsFee = document.getElementById('supplementary')?.checked ? 2000 : 0;
        const personalizedSurcharge = document.getElementById('personalized')?.checked ? 1500 : 0;
        const excursionsSurcharge = document.getElementById('excursions')?.checked ? 0.25 : 0;
        const assessmentFee = document.getElementById('assessment')?.checked ? 300 : 0;
        const interactiveFee = document.getElementById('interactive')?.checked ? course.price * 0.5 : 0;

        basePrice += eveningSurcharge;
        basePrice -= basePrice * earlyRegistrationDiscount;
        basePrice -= basePrice * groupEnrollmentDiscount;
        basePrice += basePrice * intensiveCourseSurcharge;
        basePrice += supplementaryMaterialsFee;
        basePrice += personalizedSurcharge;
        basePrice += basePrice * excursionsSurcharge;
        basePrice += assessmentFee;
        basePrice += interactiveFee;

        return Math.round(basePrice);
    }

    
    document.getElementById('courseTime').addEventListener('change', function () {
        const selectedCourseRadio = document.querySelector('input[name="course"]:checked');
        if (selectedCourseRadio) {
            const selectedCourse = JSON.parse(selectedCourseRadio.dataset.item);
            updateTotalPrice(selectedCourse);
        }
    });

   
    document.getElementById('applicationForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const selectedCourseRadio = document.querySelector('input[name="course"]:checked');
        const selectedTutorRadio = document.querySelector('input[name="tutor"]:checked');
        const selectedTime = document.getElementById('courseTime').value;

        if (!selectedCourseRadio || !selectedTutorRadio || !selectedTime) {
            alert('Пожалуйста, выберите курс, преподавателя и время занятий.');
            return;
        }

        const selectedCourse = courses[parseInt(selectedCourseRadio.dataset.index)];
        const selectedTutor = JSON.parse(selectedTutorRadio.dataset.item);

        const totalPrice = calculateTotalPrice(selectedCourse, selectedTutor, selectedTime === '20:00');

        const order = {
            course: selectedCourse.name,
            tutor: selectedTutor.name,
            date: document.getElementById('courseStartDate').value,
            time: selectedTime,
            totalPrice: totalPrice
        };

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        updateOrderList();
    });

   
    function updateOrderList() {
        const orderList = document.getElementById('orderList');
        if (!orderList) return;

        orderList.innerHTML = '';

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.forEach((order, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${order.course}</td>
                <td>${order.date} ${order.time}</td>
                <td>${order.totalPrice} руб.</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteOrder(${index})">Удалить</button></td>
            `;
            orderList.appendChild(row);
        });
    }

  
    window.deleteOrder = function (index) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(orders));
        updateOrderList();
    };

   
    updateOrderList();
});
