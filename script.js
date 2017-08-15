'use strict';

var drinkApp = {};

drinkApp.key = 'MDoyNTkwNmE4OC0zZmZjLTExZTctYWRjYy1jMzA2ZWNiYjZiNDE6d0FqOGQ1V1dwV1dxcHBQb1EwZTVYcU82dkpGMExsbVAzU2JD';

drinkApp.init = function () {

	drinkApp.events();
};

drinkApp.getDrinkByRegion = function (countryOfOrigin) {

	$.ajax({
		url: 'https://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		headers: {
			'Authorization': 'Token token=' + drinkApp.key
		},
		data: {
			per_page: 100,
			format: 'json',
			q: countryOfOrigin
		}
	}).then(function (drinkResults) {
		drinkApp.getDrinkByType(drinkResults);
	});
};

drinkApp.getDrinkByType = function (drinkType) {

	var filteredType = drinkType.result.filter(function (drink) {
		return drink.primary_category === drinkApp.type;
	});

	drinkApp.getDrinkByPrice(filteredType);
};

drinkApp.getDrinkByPrice = function (drinkPrice) {

	var priceSorted;

	if (drinkApp.price === "low") {
		priceSorted = drinkPrice.sort(function (a, b) {
			return a.price_in_cents - b.price_in_cents;
		});
	} else {
		priceSorted = drinkPrice.sort(function (a, b) {
			return b.price_in_cents - a.price_in_cents;
		});
	};

	drinkApp.displayResults(drinkPrice);
};

var headerTemplate = $('#headerTemplate').html();
var headerCompiledTemplate = Handlebars.compile(headerTemplate);

drinkApp.displayResults = function (finalResults) {
	$(".results-products").empty();
	$(".results-header").empty();
	var headerCountry = {
		country: drinkApp.region
	};

	var headerInfo = headerCompiledTemplate(headerCountry);

	$('.results-header').append(headerInfo);

	finalResults.forEach(function (result) {
		var resultContainerInfo = {
			name: result.name,
			image: result.image_url,
			type: result.secondary_category,
			volume: result.volume_in_milliliters,
			alc: result.alcohol_content / 100,
			price: result.price_in_cents / 100
		};
		console.log(result);
		var resultTemplate = $('#resultTemplate').html();
		var compiledTemplate = Handlebars.compile(resultTemplate);

		var resultInfo = compiledTemplate(resultContainerInfo);
		$('.results-products').append(resultInfo);
	});
};

drinkApp.events = function () {

	$("#usersInput").on('submit', function (e) {
		e.preventDefault();

		$('html, body').animate({
			scrollTop: $('.results').offset().top
		}, 1500);

		var usersRegionChoice = $('#region').val();
		var usersTypeChoice = $('#type').val();
		var usersPriceChoice = $('#price').val();

		drinkApp.region = usersRegionChoice;
		drinkApp.type = usersTypeChoice;
		drinkApp.price = usersPriceChoice;

		drinkApp.getDrinkByRegion(drinkApp.region);
	});
};

$(function () {
	drinkApp.init();
});
