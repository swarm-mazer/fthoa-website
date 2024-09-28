
function set_home_page_contents(){

    const contents = `
        <div class="container pt-3" style="max-width:1024px;">
        <h1>Welcome to Forest Trails</h1>
        <p class="ft-text">Forest Trails is a residential subdivision of 205 homes and is located in Fairwood; a 6.2-square-mile, unicorporated community and census-designated place (CDP) in King County that falls under the political and administrated jurisdiction of the city of Renton, Washington.</p>
        <p class="ft-text">As a common interest community, Forest Trails is managed by the Forest Trails Homeowners' Association that is made up of an all-volunteer, community-elected Board of Directors.</p>
        <p class="ft-text">Our community is located near several main arterials, is minutes from a mahor hospital facility, UW Medicine Valley Medical Center, and has its educational needs served by the Kent School District. Our entrance is located at cross street SE 192nd Street and 133rd Avenue SE.</p>
        </div>
    `
    console.log(contents);
    $('#page-contents')[0].innerHTML= contents;
}
function set_navbar(){
    const navbarHtml = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Announcements</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Public Documents</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" tabindex="-1" aria-disabled="true">Owner Documents</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
    $('#navbar-placeholder').html(navbarHtml);
}

$(document).ready(() => {
    set_home_page_contents();
    set_navbar();



    //Enable firebase SDK
     //firebase.auth().onAuthStateChanged(user => {     });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate


    try {
      let app = firebase.app();
      let features = [
        'auth',
        'database',
        'firestore',
        'functions',
        'messaging',
        'storage',
        'analytics',
        'remoteConfig',
        'performance',
      ].filter(feature => typeof app[feature] === 'function');
    } catch (e) {
      console.error(e);
    }

    // Firebase auth state listener
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
         $('#user-status').html(`<p>Hello, ${user.displayName}</p>`);
         $('#login-button').hide();
         $('#logout-button').show();
      } else {
         $('#user-status').html('You are not logged in');
         $('#login-button').show();
         $('#logout-button').hide();
      }
    });
    $('#login-button').on('click', (event)=>{
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
            console.log("User logged in:", result.user);
          }).catch(error => {
            console.error("Login failed:", error);
          });
    });
     $('#logout-button').on('click', (event)=>{
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signOut().then(() => {
            console.log("User logged out");
        }).catch(error => {
            console.error("Logout failed:", error);
        });
    });
});

