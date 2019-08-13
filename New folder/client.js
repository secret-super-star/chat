var objectSocket = io.connect('http://localhost:8080/');

objectSocket.on('message', function(objectData) {
  console.log('client objectData',objectData);
  jQuery('#output')
    .prepend('> ' + objectData.text + '\n\n')
  ;
});

jQuery('#submit')
  .on('click', function() {
    console.log(jQuery('#message').val())
    objectSocket.emit('message', {
      'strQuery': jQuery('#message').val()
    });
    console.log('click');
  })
;
