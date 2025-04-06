const hiddenReviews = document.querySelector(".cs-card-group.hidden")
const moreButton = document.querySelector(".read-more")

moreButton.addEventListener("click", () => {
    hiddenReviews.classList.toggle("hidden")
    moreButton.classList.add("expanded")
    if (moreButton.innerHTML === "More Reviews") {
        console.log("I will change it to less")
        moreButton.innerHTML = "Less Reviews"
    } else {
        moreButton.innerHTML = "More Reviews"
    }
})