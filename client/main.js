import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
// Infinite Scroll

Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});


  Session.set("imageLimit", 8);

  lastScrollTop = 0;
  $(window).scroll(function(event){
    // test if we are near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      // where are we in the page?
      var scrollTop = $(this).scrollTop();
      // test if we are going down
      if (scrollTop > lastScrollTop){
        // yes we are heading down...
       Session.set("imageLimit", Session.get("imageLimit") + 4);
      }

      lastScrollTop = scrollTop;
    }
  });


	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},
          {sort:
            {
                upvotes: -1,
                downvotes:-1
            }
          });
	  }
	});

  Template.website_form.helpers({
    isLoggedIn: function(){
        if(Meteor.user()){
          return true;
        }
        return false;
    }
  });



	/////
	// template events
	/////



	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
      var upvotes = this.upvotes;

      if(upvotes){
          upvotes++;
      }else{
        upvotes=1;
      }

      Websites.update({_id:website_id}, {
          $set:{
              upvotes:upvotes
          }
      });

			// put the code in here to add a vote to a website!

			return false;// prevent the button from reloading the page
		},
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
      var downvotes = this.downvotes;

      if(downvotes){
          downvotes--;
      }else{
        downvotes = -1;
      }

      Websites.update({_id:website_id}, {
          $set:{
              downvotes: downvotes
          }
      });
			return false;// prevent the button from reloading the page
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		},
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
      var title = event.target.title.value;
      var description = event.target.description.value;



//      if(Meteor.userId()){     }
        Websites.insert({
            title:title,
            url:url,
            description:description,
            createdOn:new Date()
        });

        event.target.url.value = "";
        event.target.title.value = "";
        event.target.description.value = "";

			return false;// stop the form submit from reloading the page
		}
	});
