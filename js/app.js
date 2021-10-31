const mobileNavContent = document.getElementById('mobile-nav-content');
const showMobileNav = document.getElementById('show-mobile-nav');
const hideMobileNav = document.getElementById('hide-mobile-nav');

hideMobileNav.onclick = () => {
  mobileNavContent.style.display = 'none';
  showMobileNav.style.display = 'block';

  hideMobileNav.style.display = 'none';
};

showMobileNav.onclick = () => {
  mobileNavContent.style.display = 'block';
  hideMobileNav.style.display = 'block';

  showMobileNav.style.display = 'none';
};
