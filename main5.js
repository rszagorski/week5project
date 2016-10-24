var productApp = {};
var alcoholType;
var pricePoint;
var alcoholContent;
var beerOn = false;
var wineOn = false;
var spiritsOn = false;
var blackOut = false;
var finalArray = [];
var currentIndex = 0;

//request from the API our data
productApp.getProduct = function(query) { // method to get the art- accepts one parameter(query)
	return $.ajax({
		url: 'http://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		data: {
			per_page: 100,
			page: 1,
			access_key: 'MDo4ZTExOGM2Ni05NTc3LTExZTYtODZjNi1hYmRiMGE3MTcyM2Y6YTdEeVc5OEZkM05hU2VQQTR6alBKVFRFZDhNR1FIS0NhdTBQ', //we needed to send a key parameter with our key
			q: query,
			where_not: 'is_dead'
		}	
	});
};
productApp.getProduct2 = function(query) { // method to get the art- accepts one parameter(query)
	return $.ajax({
		url: 'http://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		data: {
			per_page: 100,
			page: 2,
			access_key: 'MDo4ZTExOGM2Ni05NTc3LTExZTYtODZjNi1hYmRiMGE3MTcyM2Y6YTdEeVc5OEZkM05hU2VQQTR6alBKVFRFZDhNR1FIS0NhdTBQ', //we needed to send a key parameter with our key
			q: query,
			where_not: 'is_dead'
		}	
	});
};
productApp.getProduct3 = function(query) { // method to get the art- accepts one parameter(query)
	console.log(query);
	return $.ajax({
		url: 'http://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		data: {
			per_page: 100,
			page: 3,
			access_key: 'MDo4ZTExOGM2Ni05NTc3LTExZTYtODZjNi1hYmRiMGE3MTcyM2Y6YTdEeVc5OEZkM05hU2VQQTR6alBKVFRFZDhNR1FIS0NhdTBQ', //we needed to send a key parameter with our key
			q: query,
			where_not: 'is_dead'
		}	
	});
};
//this might be not working- delete if so and delete the stuff above also
//how do i get this working to make the search more specific based on primary category?
productApp.filterCategory = function(the_alcohol) {
	var filteredAlcohol;
	if (alcoholType === 'wine') {
		wineOn = true;
		filteredAlcohol = the_alcohol.filter(function(value) {
			return value.primary_category === 'Wine';
			// console.log('hey',filteredAlcohol);//why wouldnt this show up
		});
	} else if (alcoholType === 'beer') {
		beerOn = true;
		filteredAlcohol = the_alcohol.filter(function(value) {
			return value.primary_category === 'Beer';
		});
		//if its beer- create a new array that returns objects whos alcohol content is * by 6- 
		filteredAlcohol = filteredAlcohol.map(function(beer) {
			var beerContent = (beer.alcohol_content * 6);
			beer.alcohol_content = beerContent;
			//if total package is equal to 1 also multiply price by 6
			if (beer.total_package_units === 1) {
				var beerCost = (beer.price_in_cents * 6);
				beer.price_in_cents = beerCost;
			};
			//return the new array
			return beer;
		});
	} else if (alcoholType === 'spirits') {
		spiritsOn = true;
		filteredAlcohol = the_alcohol.filter(function(value) {
			return value.primary_category === 'Spirits';
		});
	}
	console.log('hey', filteredAlcohol);
	return filteredAlcohol;
	// productApp.filterPrice(filteredType);
};

//convert the price_in_cents returned by the API to dollars using *100
//assign expensive-price $25 and up 
//assign moderate-price to $13 to $25
//assign cheap-price to $13 and down
productApp.filterPrice = function(the_alcohol){
	// console.log("filtered by type", the_alcohol)
	var filteredByPrice;
	if (pricePoint === 'expensive-price') {
		filteredByPrice = the_alcohol.filter(function(value) {
			return value.price_in_cents >= 2500;
		});
	} else if (pricePoint === 'moderate-price') {
		filteredByPrice = the_alcohol.filter(function(value) {
			return value.price_in_cents < 2500;
		});
	} else if (pricePoint === 'cheap-price') {
		filteredByPrice = the_alcohol.filter(function(value) {
			return value.price_in_cents < 1300;
		});
	}
	// filteredByPrice
	console.log('filteredByPrice', filteredByPrice);
	productApp.filterAlcoholContent(filteredByPrice);
};

//0 to 2000 low
//2000 to 4000 med
//4000 + 
productApp.filterAlcoholContent = function(the_alcohol) {
	// debugger;
	var finalFilteredContent;
	if (alcoholContent === 'blackout-drunk' && beerOn === true) {
		blackOut = true;
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content >= 3300;
		});
	} else if (alcoholContent === 'moderate-drunk' && beerOn === true) {
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content < 3300 && value.alcohol_content >= 2600;
		});
	} else if (alcoholContent === 'buzzed-drunk' && beerOn === true) {
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content < 2600;
		});
	}
	if (alcoholContent === 'blackout-drunk' && wineOn === true) {
		blackOut = true;
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content >= 1350;
		});
	} else if (alcoholContent === 'moderate-drunk' && wineOn === true) {
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content < 1350 && value.alcohol_content >= 1150;
		});
	} else if (alcoholContent === 'buzzed-drunk' && wineOn === true) {
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content < 1150;
		});
	}
	if (alcoholContent === 'blackout-drunk' && spiritsOn === true) {
		blackOut = true;
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content >= 4000;
		});
	} else if (alcoholContent === 'moderate-drunk' && spiritsOn === true) {
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content < 4000 && value.alcohol_content >= 3000;
		});
	} else if (alcoholContent === 'buzzed-drunk' && spiritsOn === true) {
		finalFilteredContent = the_alcohol.filter(function(value) {
			return value.alcohol_content < 3000;
		});
	}
	console.log('filtered by price + alcohol', finalFilteredContent);
	productApp.displayProduct(finalFilteredContent);
};

// productApp.filterAlcoholContent = function(the_alcohol) {
// 	// debugger;
// 	var finalFilteredContent;
// 	if (alcoholContent === 'blackout-drunk') {
// 		blackOut = true;
// 		finalFilteredContent = the_alcohol.filter(function(value) {
// 			return value.alcohol_content >= 1350;
// 		});
// 	} else if (alcoholContent === 'moderate-drunk') {
// 		finalFilteredContent = the_alcohol.filter(function(value) {
// 			return value.alcohol_content < 1350 && value.alcohol_content >= 1150;
// 		});
// 	} else if (alcoholContent === 'buzzed-drunk') {
// 		finalFilteredContent = the_alcohol.filter(function(value) {
// 			return value.alcohol_content < 1150;
// 		});
// 	}
// 	console.log('filtered by price + alcohol', finalFilteredContent);
// 	productApp.displayProduct(finalFilteredContent);
// };
var beerCounter = 0;
productApp.displayProduct = function(the_alcohol) {
	console.log('displayed product', the_alcohol);
	var finalResults = the_alcohol[beerCounter];
	$('.alcohol-title').text(finalResults.name);
	var manipPrice = (finalResults.price_in_cents/100).toFixed(2);
	var dollarSignPrice = '$' + manipPrice;
	$('.the-price').text(dollarSignPrice);//eventually make this dollars
	$('.the-alcohol-image').attr({src: finalResults.image_thumb_url});
	if (beerOn === true && blackOut === true){
		console.log("hi");
		var blackoutMessage = $('.blackout-message').text("You might want to drink a few of these if you're aiming for 'I can't feel my face right now.'");
	}
};

// productApp.displayProduct = function(the_alcohol) {
// 	console.log('displayed product', the_alcohol);
// 	var finalResults = the_alcohol;
// 	finalResults.forEach(function(the_alcohol){
// 	$('.alcohol-title').text(the_alcohol.name);
// 	$('.the-price').text(the_alcohol.price_in_cents);//eventually make this dollars
// 	$('.the-alcohol-image').attr({src: the_alcohol.image_thumb_url});
// 	if (beerOn === true && blackOut === true){
// 		console.log("hi");
// 		var blackoutMessage = $('.blackout-message').text("You might want to drink a few of these if you're aiming for 'I can't feel my face'- you might want to drink a bunch of these.");
// 	}
// 	});

// };






	// finalResults.forEach(function(the_alcohol){
	// 	$('.alcohol-title').text(the_alcohol.name);
	// 	$('.the-price').text(the_alcohol.price_in_cents);//eventually make this dollars
	// 	$('.the-alcohol-image').attr({src: the_alcohol.image_thumb_url});
	// 	if (beerOn === true && blackOut === true){
	// 		console.log("hi");
	// 		var blackoutMessage = $('.blackout-message').text("You might want to drink a few of these if you're aiming for 'I can't feel my face'- you might want to drink a bunch of these.");
	// 	}
	// });



// }



//with this data we want to filter it based on the users answers to choose an option


//if the user chooses fancy-dinner-party
//push into the html for h2 'Oh you fancy huh?'
//if the user chooses rowdy-house-party
//push into the html for h2 'That sounds fun'
//if the user chooses a party-for two
//push into the html for h2 'Ooo la la...'
	$('input[name=party-type]').on('click', function(){
		var partyType = $('input[name=party-type]:checked').val();
		console.log(partyType); //store the input party-type in partyType val on click

		var fancyQuote = '<h2>Oh,you</h2> <div class="tilt"><h3>fancy, huh?</h3></div>';
		var rowdyQuote = '<h2>That</h2> <div class="tilt"><h3>sounds fun</h3></div>';
		var twopartyQuote = '<h2>Ooh</h2> <div class="tilt"><h3>la la...</h3></div>';
		var $question1Title = $('.question1 .question-title');

		$question1Title.html('');
	 	//this means to clear all the html- put nothing in the html so that it doesnt let us click the button and get results a million times

		if (partyType === 'fancy-dinner-party') {
			$question1Title.html(fancyQuote);
		} else if (partyType === 'rowdy-house-party') {
			$question1Title.html(rowdyQuote);
		} else {
			$question1Title.html(twopartyQuote);
		};
	});

//set up one event for the form submit- when that was submitted we went and grabbed these three values
//then we pass these 3 values to get products
//then pass that to getProducts



//get it to display something
//display the first one- then when you hit display another, it increase the index
//then when you hit play again it clears it all


//blackout-drunk- assign this to alcohol content of x and up
//moderate-drunk- assign this to alcohol content x to x
//buzzed- assign this to alcohol content x and down

//convert the price_in_cents returned by the API to dollars using *100
//assign expensive-price $25 and up 
//assign moderate-price to $13 to $25
//assign cheap-price to $13 and down

//based on the answer- wine, beer or spirits, only look for price and alcohol content in that bunch

//*.01 for cents to dollars? return x*100/
//we want to ask the user if they want to bring wine, spirits or beer to the party?
//then make a request off of these questions
//then we want to ask the user if they want to spend a lot of money or not? giving them 3 options to choose between
//based on their answer we want to filter to the next question only to include prices of a certain point
//then we want to ask if they're trying to get drunk/or not- giving them 3 options to choose between?
//based on their selections we will filter through the results and spit out a random result

//make variable
//take whatever they enter and multiply by 100 for price
//when the page loads start the app



productApp.init = function() {
	$('.btn-wrapper .btn').on('click', function(e) {
		e.preventDefault();
		var scrollTo = $(this).attr('href');
		// $(scrollTo).show();
		$.smoothScroll({
			scrollTarget: scrollTo, 
			speed:900
		});
		// $(scrollTo).prev().fadeOut('fieldset');
	});

	$('input[type=submit]').on('click', function(e) {
		var scrollTo = $(this).attr('href');
		// $(scrollTo).show();
		$.smoothScroll({
			scrollTarget: scrollTo, 
			speed:900
		});
		// $(scrollTo).prev().fadeOut('fieldset');
	});

	$('.main-form').on('submit',function(e) {
		e.preventDefault()
		//store the checked alcohol in a variable called alcoholType
		alcoholType = $('input[name=alcohol-type]:checked').val();
		console.log(alcoholType);
		//store the checked price in a variable called pricePoint
		pricePoint = $('input[name=price-point]:checked').val();
		// var priceInDollars = pricePoint * 10;
		console.log(pricePoint);
		//store the checked alcohol content in a variable called alcoholContent
		alcoholContent = $('input[name=alcohol-content]:checked').val();
			console.log(alcoholContent);

		$.when(productApp.getProduct(alcoholType), productApp.getProduct2(alcoholType), productApp.getProduct3(alcoholType))
			.then(function(alcoholResults, alcoholResults2, alcoholResults3) {
			//combine 3 arrays into 1 array
			console.log('the results', alcoholResults, alcoholResults2, alcoholResults3);
			var allResults = alcoholResults[0].result.concat(alcoholResults2[0].result).concat(alcoholResults3[0].result);

			console.log("the original results", allResults);
		// productApp.filterPrice(theAlcohol);
			// productApp.filterCategory(theAlcohol);
			var filteredByCategory = productApp.filterCategory(allResults);
			productApp.filterPrice(filteredByCategory);//can someone explain this to me32qw4e4Y
		});
	});//make this dry below later?
	$('.next-container').on('click',function(e) {
		beerCounter = beerCounter + 1;
		//store the checked alcohol in a variable called alcoholType
		alcoholType = $('input[name=alcohol-type]:checked').val();
		console.log(alcoholType);
		//store the checked price in a variable called pricePoint
		pricePoint = $('input[name=price-point]:checked').val();
		// var priceInDollars = pricePoint * 10;
		console.log(pricePoint);
		//store the checked alcohol content in a variable called alcoholContent
		alcoholContent = $('input[name=alcohol-content]:checked').val();
			console.log(alcoholContent);

		$.when(productApp.getProduct(alcoholType), productApp.getProduct2(alcoholType), productApp.getProduct3(alcoholType))
			.then(function(alcoholResults, alcoholResults2, alcoholResults3) {
			//combine 3 arrays into 1 array
			console.log('the results', alcoholResults, alcoholResults2, alcoholResults3);
			var allResults = alcoholResults[0].result.concat(alcoholResults2[0].result).concat(alcoholResults3[0].result);

			console.log("the original results", allResults);
		// productApp.filterPrice(theAlcohol);
			// productApp.filterCategory(theAlcohol);
			var filteredByCategory = productApp.filterCategory(allResults);
			productApp.filterPrice(filteredByCategory);//can someone explain this to me32qw4e4Y
		});
	});
};

$(function() {
	productApp.init();
});