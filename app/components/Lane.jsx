import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import ToolActions from '../actions/ToolActions';
import ToolStore from '../stores/ToolStore';
import Editable from './Editable.jsx';

export default class Lane extends React.Component {
    constructor(props) {
	super(props);
	
	const id = props.lane.id;
	
	this.displayTools = this.displayTools.bind(this, id);
	this.deleteNote = this.deleteNote.bind(this, id);
	this.editName = this.editName.bind(this, id);
	this.activateLaneEdit = this.activateLaneEdit.bind(this, id);
    }
    render() {
	const {lane, ...props} = this.props;
	
	return (
	    <div {...props}>
  	      <div className="lane-header">
  	        <Editable className="lane-name"
	                  editing={lane.editing}
                          value={lane.name}
	                  onEdit={this.editName}
                          onValueClick={this.activateLaneEdit} />
	    
	        <div className="lane-add-note">
  	           <button onClick={this.displayTools}>Show Tools</button>
	        </div>
	      </div>
	      <AltContainer
                 stores={[NoteStore]}
                 inject={{
		       notes: () => NoteStore.get(lane.notes)
		 }}
       	      >
	      <Notes onValueClick={this.activateNoteEdit}
                     onEdit={this.editNote}
                     onDelete={this.deleteNote} />
	      </AltContainer>
	    </div>
	);
    }
    
    displayTools(laneId) {
	
	// const note = NoteActions.create({task: 'New task'});
	// LaneActions.attachToLane({
	// 	noteId: note.id,
	// 	  laneId
	// });

	// this updates the state in lanes store (setting selectedLane)
	var myLane = LaneActions.getLane( laneId );
	console.log("Lane.jsx/displayTools: myLane", myLane);

	var entireLaneState = LaneStore.getState();
	var langResourceDescription = entireLaneState.selectedLane[0];
	console.log("Lane.jsx/displayTools laneState", langResourceDescription);

	if (langResourceDescription.language == null) {
	    alert('CLRS: Please identify the language of the resource!');
	    return;
	}

	if (langResourceDescription.mimetype == null) {
	    alert('CLRS: Please identify the mimetype of the resource!');
	    return;
	}
	
	ToolActions.findTools( entireLaneState.selectedLane[0] );
    }
    
    editNote(id, task) {
	NoteActions.update({id, task, editing: false});
    }
    
    deleteNote(laneId, noteId) {
	LaneActions.detachFromLane({laneId, noteId});
	NoteActions.delete(noteId);
    }
    
    editName(id, name) {
	if(name) {
	    LaneActions.update({id, name, editing: false});
	}
	else {
	    LaneActions.delete(id);
	}
    }
    
    activateLaneEdit(id) {
	LaneActions.update({id, editing: true});
    }
    
    activateNoteEdit(id) {
	NoteActions.update({id, editing: true});
    }
}
