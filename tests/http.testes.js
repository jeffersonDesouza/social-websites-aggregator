import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

if(Meteor.if(Meteor.isServer){

HTTP.call( 'GET', 'http://jsonplaceholder.typicode.com/posts', {}, function( error, response ) {
  if ( error ) {
    console.log( error );
  } else {
    console.log( response );
    /*
     This will return the HTTP response object that looks something like this:
     {
       content: "String of content...",
       data: Array[100], <-- Our actual data lives here.
       headers: {  Object containing HTTP response headers }
       statusCode: 200
     }
    */
  }
});

});
