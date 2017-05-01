function getSexData(data, id) {
	var sexData;
	for (var s in data) {
		if (data[s].state == id) {
			sexData = [
			{'label' : 'Female', 'value' : data[s].female},
            {'label' : 'Male', 'value' : data[s].male}];
            break;
		}
	}
	
	return sexData;
}

function getRaceData(data, id) {
	var raceData;
	for (var s in data) {
		if (data[s].state == id) {
			raceData = [
			{'label' : 'Asian', 'value' : data[s].asian},
            {'label' : 'Black', 'value' : data[s].black},
            {'label' : 'Hawaiian', 'value' : data[s].hawaiian},
            {'label' : 'Multiracial', 'value' : data[s].mixed},
            {'label' : 'Native American', 'value' : data[s].native},
            {'label' : 'Other', 'value' : data[s].other},
            {'label' : 'White', 'value' : data[s].white}];
            break;
		}
	}

	return raceData;
}

function getCountiesMedianIncome(data,id) {
	var incomeData = [];

	for (var s in data)
	{
	    if (data[s].state == id)
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
	var crimeRateData = [];
	for (var s in data)
	{
		if (data[s].abbreviation == id)
		{
			var county = data[s];
			if (crime == "overall") {
				var crimeData = {'label' : county["county"], 'value' : (parseInt(county["violent"]) + parseInt(county["property"]))};
			}

			else {
				var crimeData = {'label' : county["county"], 'value' : county[crime]};
			}
			
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
				if (crime == "overall") {
					var stateData = {'label' : state["state"], 'value' : (parseInt(state["violent"]) + parseInt(state["property"]))};
				}
				else {
					var stateData = {'label' : state["state"], 'value' : state[crime]};	
				}
				
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