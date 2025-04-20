const tutors = [
    {
        name: "Анна Иванова",
        qualification: "philology",
        experience: 5,
        courses: [1, 2]
    },
    {
        name: "Илья Смирнов",
        qualification: "native",
        experience: 8,
        courses: [2, 3]
    },
    {
        name: "Мария Петрова",
        qualification: "philology",
        experience: 3,
        courses: [1]
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const tutorList = document.getElementById("tutorList");

    function renderTutors()
     {
        tutorList.innerHTML = "";
        tutors.forEach(tutor => 
            {
            tutorList.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${tutor.name}</h5>
                            <p class="card-text">${tutor.experience} years of experience</p>
                            <p class="card-text">Qualification: ${tutor.qualification}</p>
                            <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#tutorModal">Request Session</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    renderTutors();
});
