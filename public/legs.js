jQuery(function(){
  Legs = (function(socket){

    var remoteMethods = {
      patch:  function(patch) {
//         window.passbacks.push(JSON.stringify({method:'patch',args:[patch]}))
        window.passbacks.push(patch)
      }
    };

    var id=0;

    function do_send() {
      var method = [].shift.apply(arguments);
      var payload = {id:id++, method: method, params:arguments};
      socket.send(JSON.stringify(payload)+"\r\n");
    }
    
    // Thanks http://github.com/Bluebie for the tip
    // about making sure a full message has been
    // send down the wire!
    var in_buffer = "";
    socket.onread = function(new_data) {
      in_buffer = in_buffer + new_data;
      var splitted = in_buffer.split("\n", 2);
      if (splitted.length == 1) {
        return;
      } 
      else {
        var message = splitted[0]; 
        in_buffer = splitted[1];
        var rpc = JSON.parse(message);
        if(remoteMethods[rpc.method]) remoteMethods[rpc.method].apply(null, rpc.params);
      }
    };

    socket.open('localhost', '30274');

    return {
      diff: function(diff) {  
        do_send('diff', diff);
      }
    }
  })(new Orbited.TCPSocket());
});