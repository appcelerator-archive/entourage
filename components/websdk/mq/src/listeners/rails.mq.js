(function(){
  $MQL(/rails:.*\.request/, function(message) {
    type_parts = /rails:(\w+)\.([\w\d]+)\.request/(message.name);
    
    switch(type_parts[1]){
      case 'index':
        method = 'GET';
        url = '/' + type_parts[2] + '.json';
        data = null;
        break;
      case 'create':
        method = 'POST';
        url = '/' + type_parts[2] + '.json';
        data = swiss.toJSON(message.payload);
        break;
      case 'show':
        method = 'GET';
        url = '/' + type_parts[2] + '/' + message.payload['id'] + '.json';
        data = null;
        break;
      case 'update':
        method = 'POST';
        url = '/' + type_parts[2] + '/' + message.payload['id']
            + '.json?_method=put';
        data = swiss.toJSON(message.payload);
        break;
      case 'destroy':
        method = 'POST';
        url = '/' + type_parts[2] + '/' + message.payload['id']
            + '.json?_method=delete';
        data = null;
        break;
    }

    swiss.ajax({
      method: method,
      url: url,
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      success: function(data){
        $MQ({
          name: 'rails:' + type_parts[1] + '.' + type_parts[2] + '.response',
          payload: swiss.evalJSON(data)
        });
      },
      error: function(xhr){
        $MQ({
          name: 'rails:' + type_parts[1] + '.' + type_parts[2] + '.error',
          payload: swiss.unfilterJSON(xhr.responseText)
        });
      } 
    });
  }, {});
})();
