/* Start Global Variables */
const
    myNav = document.querySelector("#navbar__list"), // The nav Ul
    sections = document.querySelectorAll("section[data-nav]"), // All the required sections
    navParent = document.querySelector(".page__header"), // the navbar grand container
    toggleMenu = document.querySelector(".toggle__menu"),
    navMenu = document.querySelector(".navbar__menu"),
    myFragment = document.createDocumentFragment(), // use virtual Dom for performance
    collapseHeadings = document.querySelectorAll(".toggle__section"),
    toTopBtn = document.createElement("div"); // Create scroll to top button
    /* End Global Variables */

/* Start Helper Functions */

// Remove class from element and add it to another
function classChanger(currentElement, classSelector) {
    document.querySelector(`.${classSelector}`).classList.remove(classSelector);
    currentElement.classList.add(classSelector);
}

// set the display style of an item after specific time
function startAfter(myElementa, myStyle, time) {
    setTimeout(function () {
        myElementa.style.display = myStyle;
    }, time);
}

// Check if the section is in the viewport, if so return true, and we had to use some alternative cases for right and bottom position to be fully compatible with all devies and browsers
function inViewPort(mySection) {
    const mySectionDimentions = mySection.getBoundingClientRect();
    return (
        mySectionDimentions.top >= 0 && 
        mySectionDimentions.left >= 0 && 
        mySectionDimentions.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        mySectionDimentions.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

// scroll to top with smooth behavior
function toTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    })
}

/* End Helper Functions*/

/* Start Building the Dynamic the Menu */

// get menu items data by looping in sections
for (let section of sections) {
    const myLi = document.createElement("li");
    myLi.setAttribute("class", "menu__li");
    myLi.innerHTML = `<a href = "#${section.getAttribute('id')}" class = "menu__link">${section.getAttribute('data-nav')}</a>`;
    myFragment.appendChild(myLi);
}
myNav.appendChild(myFragment);
myNav.firstElementChild.classList.add("focus"); // set focuus as default on the first menu li

const myMenuElements = document.querySelectorAll(".menu__li"); // gather all menu li items in one NodeList

// Prevent link jumping and add class focus
for (let item of myMenuElements) {
    item.addEventListener("click", function clicked(event) {
        event.preventDefault();
        classChanger(item, "focus");
        const targetSectionId = item.firstElementChild.getAttribute("href");
        const myTargetView = document.querySelector(targetSectionId);
        myTargetView.scrollIntoView({behavior: "smooth"});
        navMenu.classList.toggle("showMenu"); // hide the dropdown menu when inview after menu item click
    })
}

/*
Hide fixed navigation bar while not scrolling (it should still be present on page load).
to do that here is the steps we need:
[1] know the starting position, while currentposition != startingPosition show the navbar
[2] we don't actually need the stop time, we will just use setTimeout() to change the navbar display style to none.
*/

/* Start Navbar hiding on stop and show on scroll (show when on the page top too) */
window.addEventListener("scroll", function () {
    (window.scrollY > 0) ? startAfter(navParent, "none", 6000) : startAfter(navParent, "flex", 6000);
    navParent.style.display = "flex";
})
/* End Navbar hiding on stop and show on scroll (show when on the page top too) */
/* End Building the Dynamic the Menu */

// Add class 'active' to section when one of the selected elements is near top of viewport, and class focus to the linked Li
for (let section of sections) { // add class active depending on if the section is inside the viewport
    window.addEventListener("scroll", function() {
        if (inViewPort(section.querySelector("img")) || inViewPort(section.querySelector("p"))) {
            classChanger(section, "active");
            // and make the linked li has class focus too
            let theLi = document.querySelector(`[href = "#${section['id']}"]`).parentElement;
            classChanger(theLi, "focus");
        } else if (inViewPort(section.querySelector("h2"))) {
            classChanger(section, "active");
            // and make the linked li has class focus too
            let theLi = document.querySelector(`[href = "#${section['id']}"]`).parentElement;
            classChanger(theLi, "focus");
        }
    })
}

// to top button
toTopBtn.classList = "toTopBtn";
toTopBtn.setAttribute("title", "To Top");
toTopBtn.setAttribute("id", "toTop");
document.body.appendChild(toTopBtn);

window.addEventListener("scroll", function () {
    (window.scrollY > 50) ? startAfter(toTopBtn, "block", 0) : startAfter(toTopBtn, "none", 0);
})

// when click the toTopBtn call the toTop helper function
toTopBtn.addEventListener("click", function() {
    toTop();
})


// Show/Hide Menu on small screens
toggleMenu.addEventListener("click", function(event) {
    event.preventDefault();
    navMenu.classList.toggle("showMenu");
})

// create collapsible sections
for (collapser of collapseHeadings) {
    collapser.addEventListener("click", function(event) {
        event.preventDefault();
        let collapsed = this.nextElementSibling;
        if (collapsed.style.display === "flex") {
            collapsed.style.display = "none"
        } else {
            collapsed.style.display = "flex";
        }    
    })
}
