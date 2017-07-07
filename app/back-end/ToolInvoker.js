import { map639_1_to_639_3, map639_3_to_639_1 } from './util';

export function invokeBrowserBasedTool( URL ) {
    var win = window.open(URL.url, '_blank');
    win.focus();	
}

export function invokeWebService( URL ) {
    let file = URL.formVal;
    if (URL.postSubmit == "data") {
	Request
	    .post(URL.url)
	    .send(file)
	    .end((err, res) => {
		if (err) {
		    console.log('Tool.jsx/invokeWebService: error in calling webservice', err, file.name, URL);
		    alert('Result of calling web service: ' + err);
		} else {
		    var something = window.open("data:text/json," + encodeURIComponent(res.text), "_blank");
		    console.log('onDrop: success in calling webservice', res, file.name, data, URL);
		}
	    });
    } else {
	let data = new FormData();
	//data.set( URL.formPar, file, file.name);
	data.append( URL.formPar, file, file.name);
	Request
	    .post(URL.url)
	    .send(data)
	//		.set('Content-Type', 'text/plain')	    
	    .end((err, res) => {
		if (err) {
		    console.log('Tool.jsx/invokeWebService: error in calling webservice', err, file.name, data, URL);
		    alert('Result of calling web service: ' + err);
		} else {
		    var something = window.open("data:text/json," + encodeURIComponent(res.text), "_blank");
		    // something.focus();
		    console.log('onDrop: success in calling webservice', res, file.name, data, URL);
		}
	    });
    }
}

export function constructToolURL( toolDescription, resourceDescription ) {

    // CZ: outsource to global
    var fileServerURL = "";
    var rtnValue = { };	

    console.log('Tool.jsx/constructToolURL toolDescription:', toolDescription, 'resourceDescription:', resourceDescription);
    
    var filename         =  resourceDescription.name;
    var filenameWithDate =  resourceDescription.filenameWithDate;	
    var file             =  resourceDescription.file;
    var language         =  resourceDescription.language;
    var upload           =  resourceDescription.upload;
    
    var lang_encoding    = toolDescription.lang_encoding;
    var softwareType     = toolDescription.softwareType;
    var postSubmit       = toolDescription.postSubmit;

    // determine the value of the input parameter
    var inputFilename = ""
    
    switch (upload) {
    case "dnd":
	fileServerURL = "http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/";
	inputFilename = fileServerURL + filenameWithDate;
	break;
    case "VLO":
	fileServerURL = "";
	inputFilename = filename;	
	break;
    case "VCR":
	fileServerURL = "http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/";
	inputFilename = fileServerURL + filenameWithDate;
	break;
    case "FCS":
	fileServerURL = "http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/";
	inputFilename = fileServerURL + filenameWithDate;
	break;
    case "B2DROP":
	fileServerURL = "";
	inputFilename = filename;	
	break;
    default:
	console.log("ERROR: cannot construct URL for tool invocation", upload);
	return;
    }

    // the tool expects an encoding of the language parameter in ISO639-1
    if (lang_encoding == "639-1") {
	language = map639_3_to_639_1(language);
    } 

    // the mapping
    var parameterString = "";
    var parameters = toolDescription.parameter;

    // default value for form
    var formParameter = "data";
    
    if ( (toolDescription.hasOwnProperty('mapping') && (! (toolDescription['mapping'] === undefined )))) {
	for (var parameter in parameters) {
	    if (parameters.hasOwnProperty(parameter)) {
		if (toolDescription.hasOwnProperty('mapping')) {
		    var mapping = toolDescription['mapping'];
		    if (mapping.hasOwnProperty(parameter)) {
			switch (parameter) {
			case "input":
			    if (softwareType == "webService") {
				formParameter = mapping[parameter];
			    } else {
				parameterString = parameterString.concat( mapping[parameter]).concat("=").concat( inputFilename );
			    }
			    break;
			case "lang":
			    parameterString = parameterString.concat( mapping[parameter]).concat("=").concat( language );
			    break;
			default:
			    parameterString = parameterString.concat( mapping[parameter]).concat("=").concat(parameters[parameter]);
			}
		    } else {
			parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
		    }
		} else
		    parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
	    }
	    parameterString = parameterString.concat("&");
	}
    } else {
	// use the givens without mapping
	for (var parameter in parameters) {
	    if (parameters.hasOwnProperty(parameter)) {
		switch (parameter) {
		case "input":
		    if (softwareType == "webService") {
			formParameter = parameter;
		    } else {
			parameterString = parameterString.concat(parameter).concat("=").concat( inputFilename );
		    }
		    break;
		case "lang":
		    parameterString = parameterString.concat(parameter).concat("=").concat( language );
		    break;
		default:
		    parameterString = parameterString.concat(parameter).concat("=").concat(parameters[parameter]);			
		}
		
		parameterString = parameterString.concat("&");		    
	    }
	}
    }

    // var parameterString = "?input=" + inputFilename + "&lang=" + toolDescription.parameter.lang + "&analysis=" + toolDescription.parameter.analysis;
    var urlWithParameters = "";
    if (softwareType == "webService") {
	urlWithParameters = toolDescription.url;
    } else {
	urlWithParameters = toolDescription.url + "?" + parameterString;
    }

    if (softwareType == "webService") {
	rtnValue =
	    {
		toolType   : "webService",
		url        : urlWithParameters,
		formPar    : formParameter,
		formVal    : file,
		postSubmit : postSubmit
	    };
    } else	{
	rtnValue = 
	    {
		toolType : "browserBased",
		url      : urlWithParameters
	    };
    }
    
    return rtnValue;
}