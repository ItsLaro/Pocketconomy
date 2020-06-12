Driver_Module = (function(){

    //Gets Month for Title
    UI_Module.setDate();

    //RESTORE FROM DB:

    fetch('http://localhost:3000/api/v1/db')
    .then(response => response.json())
    .then(data => Request_Module.restoreSession(data))
    .catch(error => console.log("Error in loading from db: " + error));

    //EVENT LISTENERS:

    //Clicking submit button
    document.querySelector('.submit-btn').addEventListener('click', function(){
        
        id = Data_Module.newID();
        console.log(id)
        
        Request_Module.postItemDB(id)
        .then(UI_Module.submitItem()) //update UI if promise succeeds
        .catch((err) => console.log("POST Error: " + err));
    }); 

    //Pressing Enter from Description bar
    document.querySelector('.input-description').addEventListener('keyup', function(e){
        
        if (e.keyCode === 13){
            
            id = Data_Module.newID();
            console.log(id)

            Request_Module.postItemDB(id)
            .then(UI_Module.submitItem()) //update UI if promise succeeds
            .catch((err) => console.log("POST Error: " + err));
        }
    });

    //Pressing Enter from Value bar
    document.querySelector('.input-value').addEventListener('keyup', function(e){
        
        if (e.keyCode === 13){
            
            id = Data_Module.newID();
            console.log(id)

            Request_Module.postItemDB(id)
            .then(UI_Module.submitItem(id)) //update UI if promise succeeds
            .catch((err) => console.log("POST Error: " + err));
        }
    });

    //Clicking delete from any item entry
    document.querySelector('.list-container').addEventListener('click', function(e){
        Request_Module.deleteItemDB(e.target.id) 
        .then(UI_Module.removeItem(e.target.id)) //update UI if promise succeeds
        .catch((err) => console.log("DELETE Error: " + err));
        
    });

}());