
let visible = true;
const marquee = document.getElementById('marquee');

// Function to toggle the visibility of the text
function toggleVisibility() {
    visible = !visible;
    marquee.style.visibility = visible ? 'visible' : 'hidden';
}

// Start the flashing effect
setInterval(toggleVisibility, 200);