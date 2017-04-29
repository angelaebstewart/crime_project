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