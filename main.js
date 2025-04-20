
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        const notifications = document.getElementById('notifications');
        if (notifications) {
            notifications.style.display = 'none';
        }
    }, 5000);

    const closeBtn = document.querySelector('.btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const notifications = document.getElementById('notifications');
            if (notifications) {
                notifications.style.display = 'none';
            }
        });
    }

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutSection.innerHTML = '<h2>About Our Language School</h2><p>Our mission is to make learning Russian engaging and accessible...</p>';
    }
});
