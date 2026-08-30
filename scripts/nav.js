const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const moreMenuBtn = document.getElementById('more-menu-btn');
const moreMenu = document.getElementById('more-menu');
const sidebar = document.querySelector('.sidebar');
const toggleSidebarIcon = toggleSidebarBtn.querySelector('i');

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