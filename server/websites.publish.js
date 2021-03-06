/*

Meteor.publish("search", function(searchValue) {
  if (!searchValue) {
    return Websites.find({});
  }
  return Websites.find(
    { $text: {$search: searchValue} },
    {
      // `fields` is where we can add MongoDB projections. Here we're causing
      // each document published to include a property named `score`, which
      // contains the document's search rank, a numerical value, with more
      // relevant documents having a higher score.
      fields: {
        score: { $meta: "textScore" }
      },
      // This indicates that we wish the publication to be sorted by the
      // `score` property specified in the projection fields above.
      sort: {
        score: { $meta: "textScore" }
      }
    }
  );
});


*/



Meteor.publish("websites", function(searchValue) {

   
  if (!searchValue) {
    return Websites.find({});

//    $regex: `^${searchValue}`, $options: 'i'}
  }
    let selector = {title: {$regex: `^${searchValue}`, $options:'i'}};

    return Websites.find(selector);
});





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