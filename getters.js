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
				var countyData = {'label' : county["county"], 'value' : county["income"]};
				incomeData.push(countyData);
			}
	}

	return incomeData;
}

function getStatesMedianIncome(data,id) {
	console.log("in getStatesMedianIncome");
}

function getCountiesCrimeRate(data, id, crime) {
	/*
		Nick, add function here. 
		Data is the incoming county data JSON file
		ID is the state ID
		Crime is the type of crime (propery, violent, overall, burglary, homicide, etc...)
		return an array just like getCountiesMeidanIncome where each index's label is a county name and value is crime rate of the crime
	*/
}
