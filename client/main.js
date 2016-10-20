import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//DB definition
Websites = new Mongo.Collection("websites");



// Acounts Config
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});


// Infinite Scroll
  Session.set("webSitesLimit", 12);

  lastScrollTop = 0;
  $(window).scroll(function(event){
    // test if we are near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      // where are we in the page?
      var scrollTop = $(this).scrollTop();
      // test if we are going down
      if (scrollTop > lastScrollTop){
        // yes we are heading down...
       Session.set("webSitesLimit", Session.get("webSitesLimit") + 4);
      }

      lastScrollTop = scrollTop;
    }
  });




//Rounting Config
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render('navbar',{
		to:'navbar'
	});

	this.render('search', {
    to:"search"
  });


	this.render('main_content', {
    to:"main"
  });


});

Router.route('/website/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('website', {
    to:"main",
    data:function(){
      return Websites.findOne({_id:this.params._id});
    }
  });
});




	/////
	// template helpers
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){

		Meteor.subscribe("search", Session.get("searchValue"));



			if (Session.get("searchValue")) {
				 return Websites.find({}, { sort: [["score", "desc"]] });

			} else {
				return Websites.find({}, {sort: {upvotes: -1,downvotes:-1}, limit: Session.get("webSitesLimit")});
			}
    //	return Websites.find({}, {sort: {upvotes: -1,downvotes:-1}, limit: Session.get("webSitesLimit")});
	  //return Websites.find(selector, {sort: {upvotes: -1,downvotes:-1}, limit: Session.get("webSitesLimit")});


    }
	});

  Template.main_content.helpers({
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

	Template.search.events({
     "keyup #search": function (e) {
       e.preventDefault();
       Session.set("searchValue", $("#searchValue").val());
     }
   });





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

      var keyWordsArray = setKeyWords(description);

//      if(Meteor.userId()){     }
        Websites.insert({
            title:title,
            url:url,
            description:description,
            createdOn:new Date(),
						upvotes:0,
						downvotes:0,
            keyWords: keyWordsArray,
        });


         $(".js-save-website-form input").val('');
				 $(".js-toggle-website-form").click();
			return false;// stop the form submit from reloading the page
		},
		"change .js-save-website-form":function(event){
				console.log("change");

				console.log(url.value);

				 Meteor.call("getWebsiteData", url.value, function(error, results) {
					 console.log(error);
					 console.log(results);
				 });



		},

	});



Template.comments_template.events({
	"submit .js-save-comments-form":function(event){

		var comment = event.target.comment_about_site.value;
		var commentUser = Meteor.users.findOne({_id:Meteor.userId()});

		comment_obj = {
			comment_text: comment,
			comment_user: commentUser.username
		};

		Websites.update({_id:this._id},{
			$push:{
				comments: comment_obj
			}
		});


		event.target.comment_about_site.value ="";
		return false;// stop the form submit from reloading the page
	}
});



function setKeyWords(descricao){
	var communWords = ["",",",".","is", "this", "where", 'was','a','evething','the','when','like','submint','to','can','hi'];

	var key_words =  descricao.split(" ");
	//Criamos uma função de filtro com uma função de testes, se essa função retornar tru a palavra é filtrada, caso crontrario nao
	var filtro = function(arrayPalavras, funcaoTeste){
		var filtradas = [];

		for(let i=0; i<arrayPalavras.length; i++){

			if(funcaoTeste(arrayPalavras[i])){
				var palavra = arrayPalavras[i].replace(/[^\w\s]/gi,"");
				filtradas.push(palavra);
			}
		}
		return filtradas;
	};
	var verifyCommunWord = function(palavra){
		for(let i=0; i<communWords.length; i++){
				if(palavra.toLowerCase() === communWords[i].toLowerCase()){
					return false;
				}
		}
		return true;
	};
		return filtro(key_words, verifyCommunWord);
}
