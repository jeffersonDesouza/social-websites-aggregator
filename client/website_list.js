	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){

			Meteor.subscribe("websites", Session.get("searchValue"));	


			return Websites.find({}, {sort: {upvotes: -1,downvotes:-1}, limit: Session.get("webSitesLimit")});
			
    //	return Websites.find({}, {sort: {upvotes: -1,downvotes:-1}, limit: Session.get("webSitesLimit")});
	  //return Websites.find(selector, {sort: {upvotes: -1,downvotes:-1}, limit: Session.get("webSitesLimit")});


	}
});