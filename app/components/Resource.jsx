import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteStore from '../stores/NoteStore';
import Toggle   from 'react-toggle';

// access to matcher
import Matcher from '../back-end/Matcher';


export default class Resource extends React.Component {
    constructor(props) {
	super(props);

	const resource = props.resource;
	this.handleToolsPerTaskChange = props.passChangeToParent;
	
	this.showTools            = this.showTools.bind(this, resource);
	this.getFileUrl              = this.getFileUrl.bind(this, resource);
	this.handleWebServicesChange = this.handleChange.bind(this, 'includeWebServices')

	this.state = {
	    includeWebServices: false
	};

    }
    render() {
	const {resource, passChangeToParent, ...props} = this.props;
	return (
	    <div {...props}>
  	      <div className="resource-header">
  	        <a className="resource-name"
	           href='#' onClick={this.getFileUrl}
		   >
	    	   <span>Link to Resource</span>
		</a>
		  <Toggle
	             defaultChecked={false}
	             onChange={this.handleWebServicesChange} />	    
	        <div className="resource-add-note">
  	          <button id="showToolsButton" onClick={this.showTools}>Show Tools</button>
	        </div>
	      </div>
	      <AltContainer stores={[NoteStore]}
			    inject={{ notes: () => NoteStore.get(resource.notes) }} >
		<Notes />
	      </AltContainer>
	    </div>
	);
    }

    handleChange (key, event) {
	this.setState({ [key]: event.target.checked }, function () {
	    console.log('now, the state has changed...:', key, event, this.state.includeWebServices);
	});
	if (event.target.checked === true) {
	    document.getElementById("showToolsButton").innerHTML = 'Show Tools and Web Services';
	} else {
	    document.getElementById("showToolsButton").innerHTML = 'Show Tools';	    
	}
    }
    
    showTools(resource) {

	let includeWebServices = this.state.includeWebServices;
	if (resource.language == null) {
	    alert('CLRS: Please identify the language of the resource!');
	    return;
	}

	if (resource.mimetype == null) {
	    alert('CLRS: Please identify the mimetype of the resource!');
	    return;
	}

	let matcher = new Matcher();
	let toolsPerTask = matcher.findApplicableTools( resource, includeWebServices );
	this.handleToolsPerTaskChange( toolsPerTask );
    }

    // CZ: clean-up (no hardwired addresses)
    getFileUrl(resource) {
        console.log('Resource/getFileUrl', resource);
	var url = '';
	if (resource.upload == "dnd") {
            url = 'http://weblicht.sfs.uni-tuebingen.de/clrs/storage/' + resource.filenameWithDate;
	} else if (resource.upload == "VLO") {
            url = resource.name
	} else { // VCR, FCS, B2DROP 
	    url = resource.filename;
	}

	var win = window.open(url, '_blank');
	win.focus();	
    }
}