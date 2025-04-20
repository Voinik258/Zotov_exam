document.addEventListener("DOMContentLoaded", () =>
{
    const qualificationSelect = document.getElementById("qualification");
    const experienceInput = document.getElementById("experience");

    qualificationSelect?.addEventListener("change", filterTutors);
    experienceInput?.addEventListener("input", filterTutors);

    function filterTutors() {
        const qualification = qualificationSelect.value;
        const experience = parseInt(experienceInput.value) || 0;

        const tutorCards = document.querySelectorAll("#tutors .card");
        tutorCards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const matchesQualification = qualification === "all" || text.includes(qualification);
            const matchExperience = text.match(/(\d+)\s+years?/);
            const years = matchExperience ? parseInt(matchExperience[1]) : 0;

            if (matchesQualification && years >= experience) 
            {
                card.parentElement.style.display = "block";
            } else 
            {
                card.parentElement.style.display = "none";
            }
        });
    }

    const modal = document.getElementById("tutorModal");
    const form = modal?.querySelector("form");
    form?.addEventListener("submit", e => 
    {
        e.preventDefault();
        alert("Your request has been submitted!");
        form.reset();
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    });
});
