$(function () {

    let remote = window.location + 'sync/example';

    let localDB = new PouchDB('localdb')
    let remoteDB = new PouchDB(remote)

    localDB.sync(remoteDB, {
        live: true,
        retry: true
    }).on('change', function (change) {

        loadContacts();

    }).on('paused', function (info) {
        // replication was paused, usually because of a lost connection
    }).on('active', function (info) {
        // replication was resumed
    }).on('error', function (err) {
        // totally unhandled error (shouldn't happen)
    });

    $('#contactForm').submit(function (event) {

        event.preventDefault();

        var name = $('#name').val();
        var email = $('#email').val();
        var mobile = $('#mobile').val();

        // Save the contact to the database
        localDB.put({
            _id : '' + Date.now(),
            name: name,
            mobile: mobile,
            email: email
            //tags: ['tag1','tag2']
        });

        $('#contactForm')[0].reset();
    });

    function formatContactRow(contact) {
        return '<tr><td>' + contact.name + '</td><td>' + contact.mobile + '</td><td>' + contact.email + '</td></tr>'
    }

    function addNewContactToList(contact) {
        loadContacts();
    }

    //when a new entry is added to the database, run the corresponding function
    localDB.on('add', addNewContactToList);

    function loadContacts() {

        localDB.allDocs({include_docs: true}).then(function (contacts) {
            let tbody = '';
            $.each(contacts.rows, function (i, contact) {
                let row = formatContactRow(contact.doc);
                tbody += row;
            });

            $("#contactList tbody").html('').html(tbody);
        });
    }

    // when the site loads in the browser,
    // we load all previously saved contacts from hoodie
    loadContacts();

});

