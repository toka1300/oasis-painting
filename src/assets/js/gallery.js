(() => {
    const gallery = document.querySelector("#gallery-projects");
    if (!gallery) return;

    const masonry = gallery.querySelector(".cs-masonry");
    const filterButtons = gallery.querySelectorAll(".cs-filter-btn");
    const cards = Array.from(gallery.querySelectorAll(".cs-project-card"));
    const loadMoreBtn = gallery.querySelector(".cs-load-more");
    const stash = document.createElement("div");
    stash.className = "cs-masonry-stash";
    stash.hidden = true;
    masonry?.after(stash);

    let columnEls = [];
    const modal = document.getElementById("gallery-modal");
    const modalImage = modal?.querySelector(".cs-modal-image");
    const modalClose = modal?.querySelector(".cs-modal-close");
    const modalPanel = modal?.querySelector(".cs-modal-panel");
    const initialCount = 12;
    let activeCategory = "All Projects";
    let showAll = false;
    let lastFocusedElement = null;

    const getVisibleCards = () =>
        cards.filter((card) => {
            const category = card.dataset.category;
            return activeCategory === "All Projects" || category === activeCategory;
        });

    const getColumnCount = () =>
        window.matchMedia("(min-width: 64rem)").matches ? 3 : 2;

    const ensureColumns = (count) => {
        if (!masonry || columnEls.length === count) return;

        masonry.querySelectorAll(".cs-project-card").forEach((card) => {
            stash.appendChild(card);
        });

        columnEls.forEach((column) => column.remove());
        columnEls = [];
        masonry.replaceChildren();

        for (let i = 0; i < count; i++) {
            const column = document.createElement("div");
            column.className = "cs-masonry-col";
            masonry.appendChild(column);
            columnEls.push(column);
        }
    };

    const distributeCards = (shownCards, hiddenCards) => {
        if (!masonry) return;

        const columnCount = getColumnCount();
        ensureColumns(columnCount);

        columnEls.forEach((column) => {
            column.replaceChildren();
        });

        const total = shownCards.length;
        if (total > 0) {
            shownCards.forEach((card, index) => {
                const columnIndex = Math.floor((index * columnCount) / total);
                columnEls[columnIndex].appendChild(card);
                card.hidden = false;
            });
        }

        hiddenCards.forEach((card) => {
            stash.appendChild(card);
            card.hidden = true;
        });
    };

    const updateGrid = () => {
        const visibleCards = getVisibleCards();
        const limit = showAll ? visibleCards.length : initialCount;
        const shownCards = visibleCards.slice(0, limit);
        const hiddenCards = cards.filter((card) => !shownCards.includes(card));

        distributeCards(shownCards, hiddenCards);

        if (loadMoreBtn) {
            loadMoreBtn.hidden = visibleCards.length <= limit;
        }
    };

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateGrid, 150);
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.filter;
            showAll = false;

            filterButtons.forEach((btn) => {
                btn.classList.toggle("active", btn === button);
                btn.setAttribute("aria-pressed", btn === button ? "true" : "false");
            });

            updateGrid();
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            showAll = true;
            updateGrid();
        });
    }

    const populateModal = (card) => {
        if (!modal || !modalImage) return;

        modal.querySelector(".cs-modal-category").textContent = card.dataset.category;
        modal.querySelector(".cs-modal-location").textContent = card.dataset.location;
        modal.querySelector(".cs-modal-title").textContent = card.dataset.title;
        modal.querySelector(".cs-modal-outcome").textContent = card.dataset.outcome;
        modal.querySelector(".cs-modal-scope span").textContent = card.dataset.scope;
        modal.querySelector(".cs-modal-location-fact").textContent = card.dataset.location;
        modal.querySelector(".cs-modal-service").textContent = card.dataset.category;
        modal.querySelector(".cs-modal-timeline").textContent = card.dataset.timeline;
        modal.querySelector(".cs-modal-paint").textContent = card.dataset.paint;

        modalImage.src = card.dataset.imageFull;
        modalImage.alt = card.dataset.alt;
    };

    const openModal = (card) => {
        if (!modal) return;

        lastFocusedElement = document.activeElement;
        populateModal(card);
        modal.hidden = false;
        document.body.classList.add("cs-modal-open");
        modalClose?.focus();
    };

    const closeModal = () => {
        if (!modal) return;

        modal.hidden = true;
        document.body.classList.remove("cs-modal-open");
        lastFocusedElement?.focus();
    };

    cards.forEach((card) => {
        card.addEventListener("click", () => openModal(card));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openModal(card);
            }
        });
    });

    modalClose?.addEventListener("click", closeModal);

    modal?.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    modalPanel?.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && !modal.hidden) {
            closeModal();
        }
    });

    updateGrid();
})();
