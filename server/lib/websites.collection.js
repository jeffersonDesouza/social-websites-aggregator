import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


Websites = new Mongo.Collection("websites");

Websites.allow({
  insert: function(){
    
    if(Meteor.user()){
      return true;
    }

    return false;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return false;
  }
});
