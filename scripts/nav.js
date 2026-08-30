const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const moreMenuBtn = document.getElementById('more-menu-btn');
const moreMenu = document.getElementById('more-menu');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');

const sidebar = document.querySelector('.sidebar');
const toggleSidebarIcon = toggleSidebarBtn.querySelector('i');
const themeIcon = toggleThemeBtn.querySelector('i');
const themeText = toggleThemeBtn.querySelector('span');

toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleSidebarIcon.classList.toggle('fa-circle-chevron-left');
    toggleSidebarIcon.classList.toggle('fa-circle-chevron-right');
});

moreMenuBtn.addEventListener('click', () => {
    if (moreMenu.style.display === 'block') {
        moreMenu.style.display = 'none';
    } else {
        moreMenu.style.display = 'block';
    }
});

toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeIcon.classList.toggle('fa-moon');
    themeIcon.classList.toggle('fa-sun');
    
    if (themeIcon.classList.contains('fa-sun')) {
        themeText.textContent = 'Modo claro';
    } else {
        themeText.textContent = 'Modo escuro';
    }

    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeText.textContent = 'Modo claro';
}