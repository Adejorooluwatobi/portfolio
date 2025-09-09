// Load header and sidebar components
document.addEventListener('DOMContentLoaded', function() {
    let componentsLoaded = 0;
    const totalComponents = 2;

    function initializeAfterLoad() {
        componentsLoaded++;
        if (componentsLoaded === totalComponents) {
            // Reinitialize mobile menu
            $(".main_menu_3").meanmenu({
                meanMenuContainer: ".mobile_menu_3",
                meanScreenWidth: "991",
            });
            
            // Reinitialize mobile menu toggle
            let menutoggole = document.querySelector(".toggle_menu");
            let mobilemenu = document.querySelector(".mobile-menu");
            if (menutoggole && mobilemenu) {
                menutoggole.onclick = function () {
                    menutoggole.classList.toggle("active");
                    mobilemenu.classList.toggle("active");
                };
            }
            
            // Reinitialize dark mode
            function toggleDarkTheme() {
                $("body").toggleClass("dark-theme");
                const isDarkTheme = $("body").hasClass("dark-theme");
                localStorage.setItem("darkTheme", isDarkTheme);
            }
            
            $(".dark-btn").off('click').on('click', toggleDarkTheme);
            
            // Apply stored dark theme
            const isDarkTheme = localStorage.getItem("darkTheme") === "true";
            if (isDarkTheme) {
                $("body").addClass("dark-theme");
            }
            
            // Initialize isotope for portfolio filtering
            if ($("#fillter-item-active").length) {
                var $grid = $("#fillter-item-active").isotope({
                    itemSelector: ".isotop-item",
                    percentPosition: true,
                    masonry: {
                        columnWidth: ".grid-sizer",
                    },
                });

                // Filter items on button click
                $(".isotop-menu-wrapper").on("click", "li", function () {
                    var filterValue = $(this).attr("data-filter");
                    $grid.isotope({ filter: filterValue });
                });

                // Change is-checked class on buttons
                $(".isotop-menu-wrapper").each(function (i, buttonGroup) {
                    var $buttonGroup = $(buttonGroup);
                    $buttonGroup.on("click", "li", function () {
                        $buttonGroup.find(".is-checked").removeClass("is-checked");
                        $(this).addClass("is-checked");
                    });
                });
            }
            
            // Set active menu based on current page
            const currentPage = window.location.pathname.split('/').pop();
            $('.bastami-main-menu li').removeClass('active');
            
            if (currentPage === 'index.html' || currentPage === '') {
                $('.menu-about').addClass('active');
            } else if (currentPage === 'portfolio.html') {
                $('.menu-works').addClass('active');
            } else if (currentPage === 'resume.html') {
                $('.menu-resume').addClass('active');
            } else if (currentPage === 'blog.html') {
                $('.menu-blogs').addClass('active');
            } else if (currentPage === 'contact.html') {
                $('.menu-contact').addClass('active');
            }
        }
    }

    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            initializeAfterLoad();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load sidebar
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidenav').innerHTML = data;
            initializeAfterLoad();
        })
        .catch(error => console.error('Error loading sidebar:', error));
});