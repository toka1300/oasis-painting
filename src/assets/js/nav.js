var CSbody = document.querySelector("body");
const CSnavbarMenu = document.querySelector("#cs-navigation");
const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

CShamburgerMenu.addEventListener('click', function() {
    CShamburgerMenu.classList.toggle("cs-active");
    CSnavbarMenu.classList.toggle("cs-active");
    CSbody.classList.toggle("cs-open");
    ariaExpanded();
});

function ariaExpanded() {
    const csUL = document.querySelector('#cs-expanded');
    const csExpanded = csUL.getAttribute('aria-expanded');

    if (csExpanded === 'false') {
        csUL.setAttribute('aria-expanded', 'true');
    } else {
        csUL.setAttribute('aria-expanded', 'false');
    }
}

// Dropdown tap behavior.
// - Desktop: dropdowns open on hover via CSS; anchor triggers (parents with their
//   own page, like "Interior Painting") navigate on click.
// - Mobile: tapping a dropdown trigger opens/closes its submenu and never
//   navigates, so users can drill into the nested menu before choosing a page.
const mobileNavQuery = window.matchMedia('(max-width: 63.9375rem)');
const dropDowns = Array.from(document.querySelectorAll('#cs-navigation .cs-dropdown'));

for (const item of dropDowns) {
    const trigger = Array.from(item.children).find((el) =>
        el.classList && el.classList.contains('cs-dropdown-button')
    );
    if (!trigger) continue;

    trigger.addEventListener('click', (event) => {
        if (!mobileNavQuery.matches) return;
        event.preventDefault();
        event.stopPropagation();
        item.classList.toggle('cs-active');
        trigger.setAttribute(
            'aria-expanded',
            item.classList.contains('cs-active') ? 'true' : 'false'
        );
    });
}
