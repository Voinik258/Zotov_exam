document.addEventListener("DOMContentLoaded", function () {
    const orders = [
        { id: 1, course: "Русский для начинающих", date: "2025-05-10", price: 1500, description: "Basic grammar, alphabet, and vocabulary.", extras: ["10% discount for first-time users"] },
        { id: 2, course: "Деловой русский", date: "2025-05-15", price: 2000, description: "Business vocabulary and email writing.", extras: ["Early bird 5% discount"] },
        { id: 3, course: "Русский для путешествий", date: "2025-05-20", price: 1200, description: "Practical dialogues for travel situations.", extras: [] },
    ];

    const orderList = document.getElementById("orderList");
    const pagination = document.getElementById("pagination");

    function renderOrders() {
        orderList.innerHTML = "";
        orders.forEach((order, index) => {
            orderList.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${order.course}</td>
                    <td>${order.date}</td>
                    <td>${order.price} ₽</td>
                    <td>
                        <button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#orderDetailsModal" data-index="${index}">Подробнее</button>
                        <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#orderEditModal" data-index="${index}">Изменить</button>
                        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#orderDeleteModal" data-index="${index}">Удалить</button>
                    </td>
                </tr>
            `;
        });
        renderPagination();
    }

    function renderPagination() {
        const pages = Math.ceil(orders.length / 5);
        pagination.innerHTML = "";
        for (let i = 1; i <= pages; i++) {
            pagination.innerHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
        }
    }

    // Обработчики для модальных окон
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute('data-index');
            if (this.dataset.bsTarget === '#orderDetailsModal') {
                const order = orders[index];
                document.getElementById("orderTitle").textContent = order.course;
                document.getElementById("orderDescription").textContent = order.description;
                const orderExtras = document.getElementById("orderExtras");
                orderExtras.innerHTML = "";
                order.extras.forEach(extra => {
                    orderExtras.innerHTML += `<li>${extra}</li>`;
                });
            }
            if (this.dataset.bsTarget === '#orderEditModal') {
                const order = orders[index];
                document.getElementById("courseName").value = order.course;
                document.getElementById("classDate").value = order.date;
                document.getElementById("totalPrice").value = order.price;
            }
            if (this.dataset.bsTarget === '#orderDeleteModal') {
                const deleteButton = document.getElementById("confirmDeleteButton");
                deleteButton.onclick = function () {
                    orders.splice(index, 1);
                    renderOrders();
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('orderDeleteModal'));
                    modalInstance.hide();
                };
            }
        });
    });

    renderOrders();
});
