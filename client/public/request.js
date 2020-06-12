Request_Module = (function(){

    let url = 'http://localhost:3000/api/v1/db'

    return {
        restoreSession : function (existingData) {
            /*
            Restores items from DB and displays them on UI. 
            */
            existingData.forEach(function(elem){

                //Assuming DB reads back data sorted by order of ID, last element should be greates (and therefore current) ID. 
                Data_Module.restoreID(elem._id) 

                //MIGHT BE _id instead of id
                UI_Module.restoreItem(elem._id, elem.type, elem.description, elem.value); 

            })
        },
        postItemDB : async function(id) {

            

            //Getting values from form into payload
            let payload = {};
            payload.id = id;
            payload.type = document.querySelector('.op-menu').value;
            payload.description = document.querySelector('.input-description').value;
            payload.value = document.querySelector('.input-value').value;
            console.log(payload);
            const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload) // body data type must match "Content-Type" header
            });

            return response; // parses JSON response into native JavaScript objects
        
        },
        deleteItemDB : async function(ID){
            var elemID = Number(ID.substring(8));

            const response = await fetch(url, {
                method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({id : elemID}) // body data type must match "Content-Type" header
            });

            return response; // parses JSON response into native JavaScript objects
        }
        
    }
})();