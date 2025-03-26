const hiddenReviews = document.querySelector(".cs-card-group.hidden")
const moreButton = document.querySelector(".read-more")

moreButton.addEventListener("click", () => {
    hiddenReviews.classList.toggle("hidden")
    moreButton.classList.add("expanded")
    if (moreButton.innerHTML === "Read More") {
        console.log("I will change it to less")
        moreButton.innerHTML = "Read Less"
    } else {
        moreButton.innerHTML = "Read More"
    }
})