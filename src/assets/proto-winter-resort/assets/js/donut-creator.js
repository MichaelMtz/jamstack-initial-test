function createDonut(containerId, x, y, label) {
    const container = document.getElementById(containerId);
    const percentage = Math.round((x / y) * 100);

    // SVG circle parameters
    const size = 203;
    const strokeWidth = 30;
    const radius = (size / 2) - (strokeWidth / 2);
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const svg = `
    <svg class="donut-chart h-[155px]" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background circle  -->
        <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            fill="none"
            stroke="#082f49"
            stroke-width="${strokeWidth}"
        />

        <!-- Progress circle (blue) -->
        <circle
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
            fill="none"
            stroke="#0369a1"
            stroke-width="${strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="butt"
            transform="rotate(-90 ${size / 2} ${size / 2})"
            class="donut-progress"
            style="--circumference: ${circumference}; --offset: ${offset};"
        />

        <!-- Label at top -->

        <!-- Center text - fraction -->
        <text id="donutFraction-${containerId}" x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" class="text-4xl font-bold">0/${y}</text>

        <!-- Center text - percentage -->
        <text id="donutPercentage-${containerId}" x="${size / 2}" y="${size / 2 + 28}" text-anchor="middle" class="text-xl ">0%</text>
    </svg>
`;

    container.innerHTML = svg;
    let labelSel = (containerId === 'donutTrails') ? 'donutTrailsLabel' : 'donutLiftsLabel';
    console.log(`donut: containerId:${containerId} => labelSel:${labelSel}`);
    document.getElementById(labelSel).innerHTML = label;
    // Animate percentage and fraction count up
    const percentageElement = container.querySelector(`#donutPercentage-${containerId}`);
    const fractionElement = container.querySelector(`#donutFraction-${containerId}`);
    let currentPercentage = 0;
    let currentX = 0;
    const duration = 1250;
    const percentageIncrement = percentage / (duration / 16);
    const xIncrement = x / (duration / 16);

    const counter = setInterval(() => {
        currentPercentage += percentageIncrement;
        currentX += xIncrement;

        if (currentPercentage >= percentage) {
            currentPercentage = percentage;
            currentX = x;
            clearInterval(counter);
        }

        percentageElement.textContent = Math.round(currentPercentage) + '%';
        fractionElement.textContent = Math.round(currentX) + '/' + y;
    }, 16);
}

document.addEventListener('DOMContentLoaded', () => {
    // createDonut('donutTrails', 225, 278, 'Trails Open');
    // createDonut('donutLifts', 6, 8, 'Lifts Open');
});