function initMap() {
    "use strict"; // Start of use strict
    var agencyPosition = {lat: 30.880748, lng: 103.1039915};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: agencyPosition,
        mapTypeId: 'satellite'
    });
    var marker = new google.maps.Marker({
        position: agencyPosition,
        map: map,
        title: "Kung-Fu-Panda-Agency"
    });
};