document.addEventListener('DOMContentLoaded', function () {
    function openTrailMapModal() {
        document.getElementById('trailMapModal').classList.remove('hidden');
        document.getElementById('trailMapModal').classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
    document.getElementById('trailMapDesktop').addEventListener('click', openTrailMapModal);

    function closeTrailMapModal() {
        document.getElementById('trailMapModal').classList.add('hidden');
        document.getElementById('trailMapModal').classList.remove('flex');
        document.body.style.overflow = 'auto';
    }

    document.querySelector('.closeTrailMapModal').addEventListener('click', closeTrailMapModal);
});