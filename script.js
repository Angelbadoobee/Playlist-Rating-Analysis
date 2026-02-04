// Typewriter effect
document.addEventListener("DOMContentLoaded", function() {
    const words = ["Your Music. Your Stats.", "Discover Your Trends.", "Own Your Sound."];
    let i = 0;
    let timer;

    function typingEffect() {
        let word = words[i].split("");
        let loopTyping = function() {
            if (word.length > 0) {
                document.getElementById('typewriter').innerHTML += word.shift();
            } else {
                clearTimeout(timer);
                return;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    typingEffect();
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.style.top = "-100px"; // Hide navbar
        } else {
            // Scrolling up
            navbar.style.top = "0";
        }
        lastScrollTop = scrollTop;
    });
    

});
