let orders = [
    {
        id: 1,
        courseName: "Beginner level course",
        classDate: "2025-04-20",
        totalPrice: 4000,
        description: "Beginner level course",
        extras: ["Discount: Student -500", "Extra lesson +300"]
    },
    {
        id: 2,
        courseName: "Intermediate level",
        classDate: "2025-05-01",
        totalPrice: 5600,
        description: "Intermediate level course with native speaker",
        extras: ["Weekend surcharge +1000"]
    }
];

let currentPage = 1;
const pageSize = 5;

function renderOrders() {
    const start = (currentPage - 1) * pageSize;
    const paginated = orders.slice(start, start + pageSize);
    const tbody = document.getElementById('orderList');
    tbody.innerHTML = '';

    paginated.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${order.courseName}</td>
            <td>${order.classDate}</td>
            <td>${order.totalPrice} ₽</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="viewOrder(${order.id})">View</button>
                <button class="btn btn-sm btn-warning me-1" onclick="editOrder(${order.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="confirmDelete(${order.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(orders.length / pageSize);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<button class="page-link" onclick="changePage(${i})">${i}</button>`;
        pagination.appendChild(li);
    }
}

function changePage(page) {
    currentPage = page;
    renderOrders();
}

function viewOrder(id) {
    const order = orders.find(o => o.id === id);
    document.getElementById('orderTitle').textContent = `${order.courseName} - ${order.classDate}`;
    document.getElementById('orderDescription').textContent = order.description;
    const extras = document.getElementById('orderExtras');
    extras.innerHTML = '';
    order.extras.forEach(extra => {
        const li = document.createElement('li');
        li.textContent = extra;
        extras.appendChild(li);
    });

    new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
}

function editOrder(id) {
    const order = orders.find(o => o.id === id);
    document.getElementById('courseName').value = order.courseName;
    document.getElementById('classDate').value = order.classDate;
    document.getElementById('totalPrice').value = order.totalPrice;

    const form = document.querySelector('#orderEditModal form');
    form.onsubmit = function (e) {
        e.preventDefault();
        order.courseName = document.getElementById('courseName').value;
        order.classDate = document.getElementById('classDate').value;
        order.totalPrice = parseFloat(document.getElementById('totalPrice').value);
        renderOrders();
        bootstrap.Modal.getInstance(document.getElementById('orderEditModal')).hide();
    };

    new bootstrap.Modal(document.getElementById('orderEditModal')).show();
}

function confirmDelete(id) {
    const button = document.getElementById('confirmDeleteButton');
    button.onclick = function () {
        orders = orders.filter(order => order.id !== id);
        renderOrders();
        bootstrap.Modal.getInstance(document.getElementById('orderDeleteModal')).hide();
    };
    new bootstrap.Modal(document.getElementById('orderDeleteModal')).show();
}

document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
});
