// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Resource.jsx
// Time-stamp: <2018-09-27 21:31:10 (zinn)>
// -------------------------------------------

import AltContainer from 'alt-container';
import React from 'react';
import LanguageMenu from './LanguageMenu.jsx';
import MimetypeMenu from './MimetypeMenu.jsx';
import ResourceActions from '../actions/ResourceActions';        

// access to matcher
import MatcherRemote from '../back-end/MatcherRemote';


export default class Resource extends React.Component {
    constructor(props) {
	super(props);

	const resource = props.resource;
	
	this.hideName                = this.hideName.bind(this); 
	this.showTools               = this.showTools.bind(this, props, resource);
	this.openResource              = this.openResource.bind(this, resource);
	this.setLanguage             = this.setLanguage.bind(this, resource);
	this.setMimetype             = this.setMimetype.bind(this, resource);
    }

    setLanguage( resource, language ) {
	//	console.log('Resource/setLanguage', resource, language);
	resource.language = { language : language.label,
			      threeLetterCode: language.value };
	ResourceActions.update(resource);	
    }

    setMimetype( resource, mimetype ) {
	// console.log('Resource/setMimetype', resource, mimetype);	
	resource.mimetype = mimetype.value;
	ResourceActions.update(resource);
    }

    showTools(props, resource) {

	console.log('Resource/showTools', resource, props);

	const handleToolsChange = props.passToolsChangeToParent;
	if (resource.language == null) {
	    alert('CLRS: Please identify the language of the resource!');
	    return;
	}

	if (resource.mimetype == null) {
	    alert('CLRS: Please identify the mimetype of the resource!');
	    return;
	}

	const matcher = new MatcherRemote( true );
	const toolsPromise = matcher.getApplicableTools( resource.mimetype, resource.language.threeLetterCode );
	const that = this;
	toolsPromise.then(
	    function(resolve) {
		console.log('Resource.jsx/showTools succeeded', resolve);		
		handleToolsChange( resolve );
	    },
	    function(reject) {
		console.log('Resource.jsx/showTools failed', reject);
	    });	    
    }

    openResource(resource) {
	console.log('Resource/openResource', resource);
	var win = window.open(resource.remoteFilename, '_blank');
	win.focus();	
    }

    hideName( fileName ) {
	return fileName.replace('/download?input=', '');
    }
    
    render() {
        const {resource, ...props} = this.props;
	const thStyle = {textAlign:'center'};
	const colStyle = {width:'300px'};
	const tableStyle = {
	    borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'solid',
            borderRadius: 4,
            margin: 10,
            padding: 10,
	    marginLeft: 20,
            width: 785,
	    height:160,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block'
	};
	return (
            <div>
  	      <table style={tableStyle} >
		<colgroup>
		  <col style={colStyle}/>
		  <col style={colStyle}/>
		  <col style={colStyle}/>
		</colgroup>
		<thead>
		  <tr>
		    <th style={thStyle}>resource</th>
		    <th style={thStyle}>mimetype</th>
		    <th style={thStyle}>language</th>
		  </tr>
		</thead>
		<tbody>
		  <tr className="notes">
		    <td className="note">
  	              <a className="resource-name" href='#' onClick={this.openResource} >
   			<span>
			  <b>name:</b> {this.hideName( resource.name )}
			</span>
		      </a>		    
		      <div>
			<b>size:</b> {resource.size} bytes
		      </div>
		    </td>
		    
		    <td className="note">
    		      <MimetypeMenu defaultValue = { {label: resource.mimetype,
		  		    value: resource.mimetype
				    }
				    }
				    onMimetypeSelection={this.setMimetype} />	
		    </td>
		    <td className="note">
		      <LanguageMenu defaultValue = { { label: resource.language.language,
				    value: resource.language.threeLetterCode
				    }
				    }
				    onLanguageSelection={this.setLanguage} />	
		    </td>		  
                  </tr>
		  <tr>
		    <td></td>
		    <td></td>
		    <td>
		      <div className="resource-footer">
  			<button id="showToolsButton" onClick={this.showTools}>Show Tools</button>
		      </div>
		    </td>
		  </tr>
		</tbody>
	      </table>
	    </div>
	);
    }
}
