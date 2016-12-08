/*!
 * CCyber (https://ccyber.co.uk) - @olliegeek
 * Copyright 2016 CCyber.
 * Licensed under GPLv3 (https://github.com/Pr09het/ccyber/blob/master/LICENSE)
 */
 
// shared functions javascript file
 
// ----- DATE/TIME -----

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

function getCurrentPrettyDate(withTime) {
	var d = new Date();
	var res = days[d.getDay()] + " " + d.getDate() + " " + monthNames[d.getMonth()] + ", " + d.getFullYear();
	if (withTime) {
		res += " "+d.toTimeString().substr(0,8);
	}
	return res;
}

function getCurrentDateID() {
	var d = new Date();
	return "Date-" + d.getDate() + "-" + monthNames[d.getMonth()] + "-" + d.getFullYear();
}

// ----- CRYPTO -----

function sha256(input) {
	var hashStr1 = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(input))
	return hashStr1;
}

// ----- SORTING -----

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function dynamicSortMultiple() {
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function singleRegexMatch(regex,text,toLower) {
	var res = text.match(regex);
	if (res.length < 2) {
		res = false;	
	} else {
		if (typeof(res[1]) != "undefined") { 
			res = res[1];	
		} else if (typeof(res[2]) != "undefined") { 
			res = res[2];	
		} else {
			res = false;		
		}
		
		if (res && toLower) {		
			res = res.toLowerCase();
		}	
	}
	return res;
}

// ----- VALIDATION -----

function hasValue(inputstr) {
	if (typeof(inputstr) == "undefined") {
		return false;
	}
	return inputstr.length != 0;
}