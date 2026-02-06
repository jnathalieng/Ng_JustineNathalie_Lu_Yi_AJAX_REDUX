(() => {
    const baseUrl = "https://swapi.info/api";
    
    const characterBox = document.querySelector("#character-box");
    const movieCon = document.querySelector("#movie-con");
    const movieTemplate = document.querySelector("#movie-template");
    const loadingCharacters = document.querySelector("#loading-characters");
    const loadingMovie = document.querySelector("#loading-movie");
    const searchInput = document.querySelector("#character-search");
    const searchBtn = document.querySelector("#search-btn");
    const closeBtn = document.querySelector("#close-btn");
    const moviePanel = document.querySelector("#movie-panel");
    
    const posterFiles = {
        1: "images/1_The_Phantom_Menace.jpeg",
        2: "images/2_Attack_of_the_clones.jpeg",
        3: "images/3_Revenge_of_the_Sith.jpeg",
        4: "images/4_StarWars_NewHope.jpeg",
        5: "images/5_The_Empire_Strikes_Back.jpeg",
        6: "images/6_Return_of_the_Jedi.jpeg"
    };
    
    const titleMap = {
        1: "THE PHANTOM MENACE",
        2: "ATTACK OF THE CLONES",
        3: "REVENGE OF THE SITH",
        4: "A NEW HOPE",
        5: "THE EMPIRE STRIKES BACK",
        6: "RETURN OF THE JEDI"
    };
    
    const romanNumerals = {
        1: 'I', 2: 'II', 3: 'III',
        4: 'IV', 5: 'V', 6: 'VI'
    };
    
    function getCharacters() {
        if (loadingCharacters) {
            loadingCharacters.classList.remove("hidden");
            gsap.from(loadingCharacters, {
                duration: 0.3,
                opacity: 0,
                scale: 0.9
            });
        }
        
        fetch(`${baseUrl}/people`)
            .then(response => response.json())
            .then(function(data) {
                if (loadingCharacters) {
                    gsap.to(loadingCharacters, {
                        duration: 0.2,
                        opacity: 0,
                        onComplete: () => loadingCharacters.classList.add("hidden")
                    });
                }
                
                const characters = data;
                const ul = document.createElement("ul");
                
                characters.slice(0, 15).forEach(function(character, index) {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    
                    a.textContent = character.name;
                    a.href = "#";
                    a.setAttribute("role", "listitem");
                    a.dataset.characterIndex = index;
                    
                    a.addEventListener("click", getMovie);
                    
                    a.addEventListener("mouseenter", function(e) {
                        gsap.to(e.currentTarget, {
                            duration: 0.3,
                            x: 5,
                            ease: "power2.out"
                        });
                    });
                    
                    a.addEventListener("mouseleave", function(e) {
                        gsap.to(e.currentTarget, {
                            duration: 0.3,
                            x: 0,
                            ease: "power2.out"
                        });
                    });
                    
                    li.appendChild(a);
                    ul.appendChild(li);
                });
                
                characterBox.appendChild(ul);
                
                gsap.from("#character-box li", {
                    duration: 0.4,
                    opacity: 0,
                    x: -30,
                    stagger: 0.03,
                    ease: "power2.out",
                    delay: 0.1
                });
            })
            .catch(function(error) {
                console.error("Error fetching characters:", error);
                handleError(error);
            });
    }
    
    function getMovie(e) {
        e.preventDefault();
        
        if (loadingMovie) {
            loadingMovie.classList.remove("hidden");
            gsap.from(loadingMovie, {
                duration: 0.3,
                opacity: 0,
                scale: 0.9
            });
        }
        
        if (moviePanel) {
            moviePanel.classList.add("active");
            gsap.from(moviePanel, {
                duration: 0.4,
                opacity: 0,
                y: 50,
                ease: "power2.out"
            });
        }
        
        if (closeBtn) {
            closeBtn.classList.remove("hidden");
            gsap.from(closeBtn, {
                duration: 0.3,
                opacity: 0,
                scale: 0,
                ease: "back.out(1.7)",
                delay: 0.2
            });
        }
        
        const characterIndex = e.currentTarget.dataset.characterIndex;
        
        fetch(`${baseUrl}/people`)
            .then(response => response.json())
            .then(function(data) {
                const characters = data;
                const character = characters[characterIndex];
                
                const randomIndex = Math.floor(Math.random() * character.films.length);
                const filmUrl = character.films[randomIndex];
                
                return fetch(filmUrl);
            })
            .then(response => response.json())
            .then(function(movie) {
                if (loadingMovie) {
                    gsap.to(loadingMovie, {
                        duration: 0.2,
                        opacity: 0,
                        onComplete: () => loadingMovie.classList.add("hidden")
                    });
                }
                
                movieCon.innerHTML = "";
                
                const clone = movieTemplate.content.cloneNode(true);
                const poster = clone.querySelector(".movie-poster");
                const title = clone.querySelector(".movie-title");
                const episode = clone.querySelector(".movie-episode");
                const crawl = clone.querySelector(".crawl-text");
                
                poster.src = posterFiles[movie.episode_id] || "images/default.jpg";
                poster.alt = `${movie.title} Movie Poster`;
                title.textContent = titleMap[movie.episode_id] || movie.title;
                episode.textContent = `EPISODE ${romanNumerals[movie.episode_id]}`;
                crawl.textContent = movie.opening_crawl;
                
                movieCon.appendChild(clone);
                
                const tl = gsap.timeline();
                
                tl.from(".movie-card", {
                    duration: 0.5,
                    opacity: 0,
                    scale: 0.95,
                    ease: "back.out(1.2)"
                })
                .from(".movie-poster", {
                    duration: 0.6,
                    opacity: 0,
                    y: 30,
                    rotationX: -15,
                    ease: "power2.out"
                }, "-=0.3")
                .from(".movie-title", {
                    duration: 0.4,
                    opacity: 0,
                    y: 20,
                    ease: "power2.out"
                }, "-=0.4")
                .from(".movie-episode", {
                    duration: 0.4,
                    opacity: 0,
                    y: 15,
                    ease: "power2.out"
                }, "-=0.3")
                .from(".movie-crawl", {
                    duration: 0.6,
                    opacity: 0,
                    y: 20,
                    ease: "power2.out"
                }, "-=0.3");
                
                gsap.to(".movie-poster", {
                    duration: 3,
                    y: -10,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true
                });
            })
            .catch(function(error) {
                console.error("Error fetching movie:", error);
                handleMovieError(error);
            });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const allItems = document.querySelectorAll("#character-box li");
        
        allItems.forEach(li => {
            const name = li.textContent.toLowerCase();
            const shouldShow = name.includes(searchTerm);
            
            if (shouldShow) {
                li.style.display = "";
                gsap.to(li, {
                    duration: 0.3,
                    opacity: 1,
                    x: 0,
                    ease: "power2.out"
                });
            } else {
                gsap.to(li, {
                    duration: 0.2,
                    opacity: 0,
                    x: -10,
                    ease: "power2.in",
                    onComplete: () => {
                        li.style.display = "none";
                    }
                });
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener("click", performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                performSearch();
            } else {
                performSearch();
            }
        });
        
        searchInput.addEventListener("focus", function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.02,
                ease: "power2.out"
            });
        });
        
        searchInput.addEventListener("blur", function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            gsap.to(moviePanel, {
                duration: 0.3,
                opacity: 0,
                y: 20,
                ease: "power2.in",
                onComplete: () => {
                    moviePanel.classList.remove("active");
                    closeBtn.classList.add("hidden");
                    gsap.set(moviePanel, { opacity: 1, y: 0 });
                }
            });
        });
        
        closeBtn.addEventListener("mouseenter", function() {
            gsap.to(this, {
                duration: 0.2,
                rotation: 90,
                scale: 1.1,
                ease: "back.out(2)"
            });
        });
        
        closeBtn.addEventListener("mouseleave", function() {
            gsap.to(this, {
                duration: 0.2,
                rotation: 0,
                scale: 1,
                ease: "power2.out"
            });
        });
    }
    
    function handleError(error) {
        console.error("Error fetching characters:", error);
        if (loadingCharacters) loadingCharacters.classList.add("hidden");
        
        characterBox.innerHTML = `
            <div class="error">
                <p>Failed to load characters.</p>
                <p>Please check your connection and try again.</p>
            </div>
        `;
        
        gsap.from(".error", {
            duration: 0.4,
            opacity: 0,
            y: 20
        });
    }
    
    function handleMovieError(error) {
        console.error("Error fetching movie:", error);
        if (loadingMovie) loadingMovie.classList.add("hidden");
        
        movieCon.innerHTML = `
            <div class="error">
                <p>Failed to load movie details.</p>
                <p>Please try again.</p>
            </div>
        `;
        
        gsap.from(".error", {
            duration: 0.4,
            opacity: 0,
            y: 20
        });
    }
    
    function initPageAnimations() {
        const masterTL = gsap.timeline();
        
        if (document.querySelector(".sw-logo")) {
            masterTL.from(".sw-logo", {
                duration: 0.8,
                opacity: 0,
                scale: 0.5,
                ease: "back.out(1.7)"
            });
        }
        
        if (document.querySelector(".site-header")) {
            masterTL.from(".site-header", {
                duration: 0.6,
                opacity: 0,
                y: -30,
                ease: "power2.out"
            }, "-=0.6");
        }
        
        if (document.querySelector(".character-panel")) {
            masterTL.from(".character-panel", {
                duration: 0.6,
                opacity: 0,
                x: -80,
                ease: "power2.out"
            }, "-=0.5");
        }
        
        if (document.querySelector(".movie-panel")) {
            masterTL.from(".movie-panel", {
                duration: 0.6,
                opacity: 0,
                x: 80,
                ease: "power2.out"
            }, "-=0.6");
        }
        
        if (document.querySelector(".search-container")) {
            masterTL.from(".search-container", {
                duration: 0.5,
                opacity: 0,
                y: -20,
                ease: "power2.out"
            }, "-=0.4");
        }
        
        if (document.querySelector(".footer")) {
            masterTL.from(".footer", {
                duration: 0.6,
                opacity: 0,
                y: 20,
                ease: "power2.out"
            }, "-=0.3");
        }
    }
    
    function init() {
        initPageAnimations();
        getCharacters();
        console.log("Star Wars Character Guide initialized");
    }
    
    init();
    
})();