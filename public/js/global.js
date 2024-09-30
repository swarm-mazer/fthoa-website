

function sortTableRowsByColumn(table_id, columnIndex) {
    var rows = $('#'+table_id+' tbody tr').get();
    rows.sort(function(a, b) {
        var A = $(a).children('td').eq(columnIndex).text().toUpperCase();
        var B = $(b).children('td').eq(columnIndex).text().toUpperCase();

        if (A < B) {
          return -1;
        }
        if (A > B) {
          return 1;
        }
        return 0;
    });
}

function create_userpassword_modal_dialog() {
  $('#customModal').modal('show');
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
function validateNewUserForm() {
    let isValid = true;
    // Clear previous error messages
    $('.error-message').remove();

    // Validate name
    const name = $('#new_nameInput').val().trim();
    if (name === '') {
        isValid = false;
        $('#new_nameInput').after('<span class="error-message text-danger">Name is required.</span>');
    }

     // Validate email
    const email = $('#new_emailInput').val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' || !emailRegex.test(email)) {
        isValid = false;
        $('#new_emailInput').after('<span class="error-message text-danger">Valid email is required.</span>');
    }

    // Validate address selection
    const address = $('#new_addressSelect').val();
    if (address === '') {
        isValid = false;
        $('#new_addressSelect').after('<span class="error-message text-danger">Please select an address.</span>');
    }

    // Validate checkbox
    const consentChecked = $('#consentCheckbox').is(':checked');
    if (!consentChecked) {
        isValid = false;
        $('#consentCheckbox').after('<span class="error-message text-danger">You must agree to the terms.</span>');
    }

    return isValid;
}
async function create_user_request_modal_dialog() {
    const db = firebase.firestore();
    const $selectElement = $('#new_addressSelect');
    $selectElement.empty();
    $selectElement.append('<option value="">Select an Address</option>'); // Default option

    try {
        const parcelsSnapshot = await db.collection('parcels').get();
        parcelsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.street) { // Assuming 'street' is the field name
                $selectElement.append(`<option value="${data.parcel}">${data.street}</option>`);
            }
        });

        $('.new-user-form-control').each(function() {
            var $this = $(this);
            if ($this.is('input[type="text"], input[type="email"], input[type="number"], input[type="password"], input[type="tel"]')) {
                $this.val('');
            } else if ($this.is('select')) {
                $this.prop('selectedIndex', 0);
            } else if ($this.is('input[type="checkbox"], input[type="radio"]')) {
                $this.prop('checked', false);
            }
        });
        $('#accountRequestModal').modal('show');
    } catch (error) {
        console.error('Error fetching addresses:', error);
    }
    $('#new_submitRequestBtn').on('click', () => {
        if (validateNewUserForm()) {
            const email = $('#new_emailInput').val().trim();
            const newUserData = {
                full_name: $('#new_nameInput').val().trim(),
                electronic_consent_ts: firebase.firestore.Timestamp.now(),
                parcel: $('#new_addressSelect').val(),
                phone: $('#new_phoneInput').val().trim()
            };

            console.log("Submitting request for email:", email);
            console.log("User data:", newUserData);

            db.collection('registrationRequests').doc(email).set(newUserData)
                .then(() => {
                    $('#accountRequestModal').modal('hide');
                    $('#registration_successModal').modal('show');
                    $('.success_close_button').on('click',()=>{
                        $('#registration_successModal').modal('hide');
                    })
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    alert("There was an error submitting your registration request. Please try again.");
                });
        } else {
            console.warn("Form validation failed.");
        }
    });
    $('.new_close_button').on('click',()=>{
        $('#accountRequestModal').modal('hide');
    });
}
function set_home_page_contents(page_target){

    if (page_target==='home'){
        $('#home-container').show();
    } else if (page_target==='announcements'){
        $('#page-announcements-container').show();
    } else if (page_target==='documents'){
        $('#public-documents-container').show();
        const storage = firebase.storage();
        function appendTable(storage_reference, docType){
            const storage_forms_public = storage.ref(storage_reference);
            storage_forms_public.listAll().then((res) => {
              res.items.forEach((itemRef) => {
                itemRef.getDownloadURL().then((url) => {
                  const fileName = itemRef.name;
                  $('#public_files tbody').append(
                     `<tr><td><a href="${url}" download="${fileName}">${fileName}</a></td><td>${docType}</td></tr>`
                  );
                });
              });
            }).catch((error) => {
              console.error('Error listing files:', error);
            });
        }
        appendTable('public/forms', 'Form');
        appendTable('public/documents', 'Document');
        sortTableRowsByColumn('public_files', 0);
    } else if (page_target==='neighborhood_map'){
        $('#neighborhood-map-container').show();
    }
}
$('.nav-link').on('click',(event)=>{
    $('.page-contents').hide()
    set_home_page_contents(event.currentTarget.id);
});
$(document).ready(() => {
    //Load text contents:
    $.get('assets/welcome.txt', function(data) {
        // Replace newlines (\n) with <br> tags and insert into the div
        $('#welcomeText').html(data.replace(/\n/g, '<br>'));
    });
    $.get('assets/announcements.txt', function(data) {
        // Replace newlines (\n) with <br> tags and insert into the div
        $('#announcementText').html(data.replace(/\n/g, '<br>'));
    });
    $('.page-contents').hide()
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
    $('#new-account-button').on('click', (event)=>{
    // Trigger the modal creation when clicking a button (this button should be in your HTML)
        create_user_request_modal_dialog();
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


