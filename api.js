const API_BASE = 'http://exam-api-courses.std-900.ist.mospolytech.ru';
const API_KEY = '33c72675-5f2a-4636-8a22-ec20e9d0a6c6';

async function fetchData(endpoint) {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    return res.json();
}

async function createData(endpoint, data) {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function updateData(endpoint, id, data) {
    const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

async function deleteData(endpoint, id) {
    const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    return res.json();
}
