function create_userpassword_modal_dialog() {

  // Show the modal
  $('#customModal').modal('show');

  // Handle login button click inside the modal
  $('#loginBtn').on('click', function () {
    console.log('Click login');
    var email = $('#emailInput').val();
    var password = $('#passwordInput').val();
    console.log(email, password);

    // Perform simple validation (you can replace this with actual login logic)
    if (email === '' || password === '') {
      $('#loginError').text('Please enter both email and password.').show();
    } else {
      $('#loginError').hide();
      firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
        console.log("User logged in:", result.user);
      }).catch(error => {
        console.error("Login failed:", error);
      });
      $('#customModal').modal('hide'); // Hide the modal after successful login
    }
  });
}



function set_home_page_contents(page_target){
    // Clear page contents
    $('#page-contents')[0].innerHTML='';
    // Fill them back up
    if (page_target==='home'){
        const contents = `
            <div class="container pt-3" style="max-width:1024px;">
            <h1>Welcome to Forest Trails</h1>
            <p class="ft-text">Forest Trails is a residential subdivision of 205 homes and is located in Fairwood; a 6.2-square-mile, unicorporated community and census-designated place (CDP) in King County that falls under the political and administrated jurisdiction of the city of Renton, Washington.</p>
            <p class="ft-text">As a common interest community, Forest Trails is managed by the Forest Trails Homeowners' Association that is made up of an all-volunteer, community-elected Board of Directors.</p>
            <p class="ft-text">Our community is located near several main arterials, is minutes from a mahor hospital facility, UW Medicine Valley Medical Center, and has its educational needs served by the Kent School District. Our entrance is located at cross street SE 192nd Street and 133rd Avenue SE.</p>
            </div>
        `
        $('#page-contents')[0].innerHTML= contents;
    } else if (page_target==='announcements'){
      const contents = `
            <div class="container pt-3" style="max-width:1024px;">
            <h1>Forest Trails Announcements</h1>
            <p class="ft-text">The website is in work right now.</p>
            </div>
        `
        $('#page-contents')[0].innerHTML= contents;

    } else if (page_target==='documents'){
        const contents = `
        <div class="container pt-3" style="max-width:1024px;">
          <h2 class="mt-4">Public Documents</h2>
            <table id="public_files" class="table table-bordered table-striped">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Files</th>
                </tr>
              </thead>
              <tbody>
                <!-- You can add rows here -->
              </tbody>
            </table>
            <br>
            <h2 class="mt-4">Public Forms</h2> <!-- Changed to avoid repetition -->
            <table id="public_forms" class="table table-bordered table-striped">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Forms</th>
                </tr>
              </thead>
              <tbody>
                <!-- You can add rows here -->
              </tbody>
            </table>
            </div>
        `
        $('#page-contents')[0].innerHTML= contents;


      //Initialize Storage
      const storage = firebase.storage();

      //Public Documents
      const storage_files_public = storage.ref('public/documents');
        // List all files in the public folder
        storage_files_public.listAll().then((res) => {
            console.log(res);
          res.items.forEach((itemRef) => {
            // Get the file's download URL
            itemRef.getDownloadURL().then((url) => {
              console.log(itemRef);
              const fileName = itemRef.name;

              // Create a link for each file
              const fileLink = `<a href="${url}" download="${fileName}">${fileName}</a><br>`;

              // Append the link to the fileList div
              $('#public_files tbody').append('<tr><td>'+fileLink+'</td></tr>');
            });
          });
        }).catch((error) => {
          console.error('Error listing files:', error);
        });

        //Public forms
      const storage_forms_public = storage.ref('public/forms');
        // List all files in the public folder
        storage_forms_public.listAll().then((res) => {
            console.log(res);
          res.items.forEach((itemRef) => {
            // Get the file's download URL
            itemRef.getDownloadURL().then((url) => {
              console.log(itemRef);
              const fileName = itemRef.name;

              // Create a link for each file
              const fileLink = `<a href="${url}" download="${fileName}">${fileName}</a><br>`;

              // Append the link to the fileList div
              $('#public_forms tbody').append('<tr><td>'+fileLink+'</td></tr>');
            });
          });
        }).catch((error) => {
          console.error('Error listing files:', error);
        });

    }
}
$('.nav-link').on('click',(event)=>{
    console.log(event.currentTarget.id);
    set_home_page_contents(event.currentTarget.id);
});

$(document).ready(() => {
    set_home_page_contents('home');

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
         $('#login-google-button').hide();
         $('#login-userpass-button').hide();
         $('#logout-button').show();
      } else {
         $('#user-status').html('You are not logged in');
         $('#login-google-button').show();
         $('#login-userpass-button').show();
         $('#logout-button').hide();
      }
    });
    $('#login-google-button').on('click', (event)=>{
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
            console.log("User logged in:", result.user);
          }).catch(error => {
            console.error("Login failed:", error);
          });
    });
    $('#login-userpass-button').on('click', (event)=>{
    // Trigger the modal creation when clicking a button (this button should be in your HTML)
        create_userpassword_modal_dialog();
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


