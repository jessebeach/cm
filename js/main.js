var main = {
  /* Set up the event handlers and such */
  init: function () {
    $('#send-message').bind('click', {file: 'message', type: 'html', dir: 'includes', func: 'overlay' }, this.load);
  },
  load: function (event) {
    if (event.data && event.data.file) {
      // Pull the file info from the event object
      var file = event.data.file,
          type = (event.data.type) ? event.data.type : 'html',
          dir = (event.data.dir) ? event.data.dir + '/' : '',
          func = (event.data.func) ? event.data.func : 'overlay';
      // Get the file
      $.ajax({ 
        url: dir + file + '.' + type,
        data: func, /* This is the function in main that will handle the data */
        error: function (result) {
          main.err();
        },
        success: function (data) {
          // Ajax request was successful, now do something with it
          var func = this.data;
          main.loadComplete(data, func);
        }
      });
    }
  },
  loadComplete: function (data, func) {
    // If we have data and a function to hanlde it, call that function
    if (func) {
      this[func](data); /* Call the main object property as an array and pass along the data */
      return true;
    }
    // else just return
    return;
  },
  /* A generic function to present HTML in an overlay */
  overlay: function (obj) {
    var $body = $('body'), /* We'll append to this */
        $screen = $('<div>', {id: 'overlay-screen'}).addClass('screen').hide(),
        $obj = $(obj),
        $modal = $('<div>', {
          id: 'modal', 
          html: $('<div>', {
            html: $('<div>', {html: obj}).addClass('inner') //This is where the modal contents are added as obj
          }).addClass('inner')
        }).addClass('standard modal').hide(),
        $overlay = $('<div>', {id: 'overlay'}).addClass('overlay');
    // Add the screen and the modal to the overlay
    $screen.appendTo($overlay);
    $modal.appendTo($overlay);
    // Add the overlay to the body
    $overlay.appendTo($body);
    // Position the top of the modal
    $modal.css({top: (window.innerHeight * 0.25)});
    // Dismiss the modal if the screen is clicked, same as cancel
    $screen.bind('click', function (event) {$(this).parent().remove();});
    // Apply behaviors to standard modal dialog buttons (could be made more abstract)
    // For this demo, both the submit and cancel buttons will just dismiss the overlay,
    // Although one would want a success message upon submit in production
    $('.button', '.overlay').bind('click', function (event) {$(this).closest('.overlay').remove();});
    // Show the screen and modal
    $screen.fadeIn('fast');
    $modal.fadeIn('slow');
  },
  err: function () {
    return false;
  }
}