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
    
    
    
    const createResortGeoSDL = () => {
      const resort_id = document.body.dataset.snowreport;
      const url = (window.location.hostname !== 'localhost') ? `https://feeds.snocountry.net/proof-of-concept/resort-geo.php?target=${resort_id}` : `http://localhost/sno/snoCountryHeadless/snow-reports/resort-geo.php?target=${resort_id}`;
      // _log(`snowreport-api resort: ${url}`);
      fetch(url).then(response => {
        return response.json();
      }).then(geoData => { 
        const data = geoData[0];
        console.log('*** sdl:',data);
        const sdl = `
        <script type="application/ld+json">
        {"@context":"https://schema.org",
        "@type":"SkiResort","name":"${data.resortName}",
        "address":{"@type":"PostalAddress",
        "addressCountry":"${data.countryProper}",
        "addressRegion":"${data.PhysState}",
        "addressLocality":"${data.state}",
        "streetAddress":"${data.PhysStreet},${data.PhysCity}, ${data.PhysState} ${data.PhysZip}"},
        "url":"${window.location.href}",
        "image":"https://www.snow-country.com/trail_maps/large_trail_maps/${data.id}.jpg",
        "email":"mailto:${data.email}",
        "telephone":"${data.mainPhone}",
        "geo":{"@type":"GeoCoordinates","latitude":"${data.latitude}","longitude":"${data.longitude}"}}
        </script>
        `;
        document.querySelector('head').insertAdjacentHTML('beforeend',sdl);
      }).catch( () => { console.log('Error waiting for EL:');});
      
    };
    
    createResortGeoSDL();
});