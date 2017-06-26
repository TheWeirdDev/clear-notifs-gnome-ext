const St = imports.gi.St;
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const ICON = Me.path + '/icon.png'

function add(){
    Main.panel._centerBox.insert_child_at_index(this.button,0);
}

function remove(){
    Main.panel._centerBox.remove_child(this.button);
}

function update(){
    count =  Main.panel.statusArea.dateMenu._messageList._notificationSection._list.get_n_children();
    if(count < 1){
       remove();
    }else{
        add();
    }

}
function clear() {

    Main.notify('Cleared', 'Notification area is cleared');
    // Clear all notifications
    Main.panel.statusArea.dateMenu._messageList._notificationSection._list.remove_all_children();

    // Removes the little dot next to clock
    Main.panel.statusArea.dateMenu._indicator.actor.get_children()[0].destroy();
    update();
}


// create button
function init() {
    this.button = new St.Button({ style_class: 'clear-all',
                                    reactive: true,
	               		    can_focus: true,
                   		    track_hover: true });

    this.newicon = new St.Icon({ gicon: Gio.icon_new_for_string(ICON),
                                     icon_size: 18,                                        
				     style_class: 'system-status-icon',
	                                     track_hover: true });
	
    this.button.set_child(newicon);
    this.button.connect('button-press-event', clear);
}


function enable() {
    // add listeners
    this._listActorAddedSig =  Main.panel.statusArea.dateMenu._messageList._notificationSection._list.connect('actor-added', this.update);
    this._listActorRemovedSig =  Main.panel.statusArea.dateMenu._messageList._notificationSection._list.connect('actor-removed', this.update);
    update();
}

function disable() {
	remove();
    Main.panel.statusArea.dateMenu._messageList._notificationSection._list.disconnect(this._listActorAddedSig);
    Main.panel.statusArea.dateMenu._messageList._notificationSection._list.disconnect(this._listActorRemovedSig);
}
