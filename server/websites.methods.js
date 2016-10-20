Meteor.methods({
  getWebsiteData: function (url) {
          this.unblock();
          return Meteor.http.call("GET", "http://"+url, {"npmRequestOptions" : {"gzip" : true}});
      }
});
