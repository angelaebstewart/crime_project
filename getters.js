/*
var countyData;
var nationalData;
d3.json("countyData.json", function(error, data) {
		if(error) {
				console.log(error);
		}
		countyData = data;
});
d3.json("nationalData.json", function(error, data) {
		if(error) {
				console.log(error);
		}
		nationalData = data;
});*/


function getSexData(data, id) {
	var sexData = [
			{'label' : 'Female', 'value' : data[id].female},
            {'label' : 'Male', 'value' : data[id].male}];

	return sexData;
}

function getRaceData(data, id) {
	var raceData = [
			{'label' : 'Asian', 'value' : data[id].asian},
            {'label' : 'Black', 'value' : data[id].black},
            {'label' : 'Hawaiian', 'value' : data[id].hawaiian},
            {'label' : 'Mixed', 'value' : data[id].mixed},
            {'label' : 'Native American', 'value' : data[id].native},
            {'label' : 'Other', 'value' : data[id].other},
            {'label' : 'White', 'value' : data[id].white}];
	return raceData;
}

function getCountiesMedianIncome(data,id) {
	var incomeData = [];

	for (var s in data)
	{
	    if (data[s].abbreviation == id)
			{
				var county = data[s];
				var countyData = {'label' : county["county"], 'value' : county["income"], 'geoid' : county["geoid"]};
				incomeData.push(countyData);
			}
	}

	return incomeData;
}

function getStatesMedianIncome(data) {
	var incomeData = [];

	for (var s in data)
	{
			if (data[s].abbreviation != "US")
			{
				var state = data[s];
				var stateData = {'label' : state["state"], 'value' : state["income"]};
				incomeData.push(stateData);
			}
	}

	return incomeData;
}


function getCountiesCrimeRate(data, id, crime) {
	console.log(data);
	var crimeRateData = [];
	for (var s in data)
	{
		if (data[s].abbreviation == id)
		{
			var county = data[s];
			var crimeData = {'label' : county["county"], 'value' : county[crime]};
			console.log(crimeData);
			crimeRateData.push(crimeData);
		}
	}

	return crimeRateData;
}

function getStatesCrimeRate(data, crime) {
	var crimeRateData = [];

	for (var s in data)
	{
			if (data[s].abbreviation != "US")
			{
				var state = data[s];
				var stateData = {'label' : state["state"], 'value' : state[crime]};
				crimeRateData.push(stateData);
			}
	}

	return crimeRateData;
}

function getCountiesPopulation(data, id) {
	var populationData = [];

	for (var s in data)
	{
			if (data[s].abbreviation == id)
			{
				var county = data[s];
				var population = {'label' : county["county"], 'value' : county["population"]};
				populationData.push(population);
				console.log(population);
			}
	}

	return populationData;
}

function getStatesPopulation(data) {
	var populationData = [];

	for (var s in data)
	{
			if (data[s].abbreviation != "US")
			{
				var state = data[s];
				var stateData = {'label' : state["state"], 'value' : state["population"]};
				populationData.push(stateData);
			}
	}

	return populationData;
}