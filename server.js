


var express = require('express');
var app = express();

var server = require('http').Server(app);

var io = require('socket.io')(server)

var chance = require('chance').Chance();


const pattern_1 = ['Hi my name is Maxim, nice to meet you!', 'Hello', 'How is your day?', 'Talk to me'];
const pattern_2 = ['How are you doing?', 'I feel happy', 'Are you OK?'];
const pattern_3 = ['Tell me a story', 'Can we be friends?', 'I agree'];
const pattern_4 = ['Could you elaborate?', 'Time?', 'Location?'];




function matches(msg, array_of_patterns) {

  var msg_lower = msg.toLowerCase();

  for(var i = 0; i < array_of_patterns.length; i++) {

    var pattern_lower = array_of_patterns[i].toLowerCase();

    if(msg_lower.search(pattern_lower) > -1) {

      return true;

    }
  }
  return false;
}


function choice(array) {

  var index = chance.natural({'min': 0, 'max': array.length - 1}); 

  return array[index];
}

function maybe(array) {

  if( chance.bool() ) {

    return choice(array);

  } else {

    return '';

  }
}

function patter_1_answer(){

  return choice(['Nice to meet you too!', 'Good', 'Fine']) + '. ' + choice(['How are you?', 'Your turn!', 'I know everything...']);
}

function patter_2_answer() {

  switch(choice([1, 2, 3]))
  {
    case 1:
      return choice(['I see', 'Interesting', 'Well']) +  ', ' + 'I have been ' 
        + maybe(['hopefully', 'fucking', 'absolutely', 'overly']) + ' ' 
        + choice(['depressed', 'elated', 'emotional', 'energetic', 'bitchy', 'snappy', 'partying', 'working'])
        + choice('.', '...');
    case 2:
      return choice(['So', 'Excuse me', 'What', 'Finally']) + ', ' + 'now' + ' ' + 'you' + ' ' 
        + choice(['start', 'begin', 'want', 'agree', 'choose']) 
        + ' ' + 'to ' + choice(['talk to', 'see eye to eye with', 'console', 'be faithfull to']) + ' me' 
        + choice('.', '!');
    case 3:
      return choice(['How dare you', "I don't care", 'Please stop']) + choice('!','?') + choice('!!','?') + choice('!!!','?');
  }

}

function patter_3_answer() {

  switch(choice([1, 2]))
  {
    case 1:
      return choice(['Lets see', 'Maybe', 'One day']) + ', ' + 'I will ' + choice(['follow', 'take', 'hold']) + ' ' 
        + 'a' + ' ' + choice(['dog', 'bike', 'hovercraft', 'bal', 'boat', 'car']) + ' ' + 'around the' + ' ' + choice(['world', 'globe'])
        + choice('!', '...');
    case 2:
      return choice(['Yes, Maybe?', 'How about no']);
  }

}

function patter_4_answer() {

  return choice(['None of your business', 'Ssssssssh']) + ' ' 
      + 'guess' + ' ' + 'I am' + ' ' + choice(['so', 'too', 'very']) + ' ' 
      + choice(['mysterious', 'shy', 'stupid']) + '.';
}


function default_answer() {

  switch(choice([1, 2]))
    {
    case 1:
      return choice(['Error', '???????', 'Page not found', 'What are you saying?']);
    case 2:
      return choice(['Start', 'Game']) + ' ' + 'over...';
  }
                  
}

function answer(msg) {

  if(matches(msg, pattern_1)) { 

    return patter_1_answer(); 

  } else if(matches(msg, pattern_2)) {

    return patter_2_answer();

  } else if(matches(msg, pattern_3)) {

    return patter_3_answer();

  } else if(matches(msg, pattern_4)) {

    return patter_4_answer();

  } else {

    return default_answer();
  }

}


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {

  console.log('got a connection');

  socket.on('message from human', function(msg) {

    console.log('got a human message: ' + msg);

    var response = answer(msg);

    io.emit('message from robot', response);

  });

  socket.on('disconnet', function() {

    console.log('got a disconnection');
    
  });

});

server.listen(8088, function () {
  console.log('listening on port: ' + 8088);
});
