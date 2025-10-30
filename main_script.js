document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill out all fields");
            return;
        }
        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }

        alert("Thank you for contacting us!");
        form.reset();
    });
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}


// Smooth navigation to feature pages
function navigateToFeature(page) {
  window.location.href = page;
}

$(document).ready(function() {
  $("body").css("display", "none").fadeIn(400);

  $(".feature-card").on("click", function() {
    let targetPage = $(this).data("page");
    $("body").fadeOut(400, function() {
      window.location.href = targetPage;
    });
  });
});









