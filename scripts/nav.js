const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const moreMenuBtn = document.getElementById('more-menu-btn');
const moreMenu = document.getElementById('more-menu');
const themeBtn = document.getElementById('theme-btn');

const sidebar = document.querySelector('.sidebar');
const logoImg = document.querySelector('.sidebar img');
const toggleSidebarIcon = toggleSidebarBtn.querySelector('i');

function updateLogo() {
    const isDark = document.body.classList.contains('dark-mode');
    const isCollapsed = sidebar.classList.contains('collapsed');

    if (isCollapsed) {
        logoImg.src = isDark ? 'assets/kairo-icon-dark.svg' : 'assets/kairo-icon.svg';
    } else {
        logoImg.src = isDark ? 'assets/kairo-logo-lockup-dark.svg' : 'assets/kairo-logo-lockup.svg';
    }
}

function updateThemeButton() {
    const isDark = document.body.classList.contains('dark-mode');
    const themeIcon = themeBtn.querySelector('i');
    const themeText = themeBtn.querySelector('span');

    themeIcon.classList.toggle('fa-moon', !isDark);
    themeIcon.classList.toggle('fa-sun', isDark);
    themeText.textContent = isDark ? 'Modo claro' : 'Modo escuro';
}

toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleSidebarIcon.classList.toggle('fa-circle-chevron-left');
    toggleSidebarIcon.classList.toggle('fa-circle-chevron-right');
    updateLogo();
});

moreMenuBtn.addEventListener('click', () => {
    if (moreMenu.style.display === 'block') {
        moreMenu.style.display = 'none';
    } else {
        moreMenu.style.display = 'block';
    }
});

const savedTheme = localStorage.getItem('kairo-theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

if (themeBtn) {
    updateThemeButton();

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('kairo-theme', isDarkMode ? 'dark' : 'light');

        updateThemeButton();
        updateLogo();
    });
}

updateLogo();
