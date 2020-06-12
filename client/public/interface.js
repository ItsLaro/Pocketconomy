UI_Module = (function(){

    function appendHTML(item){
        if (item.type === "inc"){
            //HTML String formulation
            var htmlChunk = `<li class="income-list-item" id=${"inc-" + item.id}><h3 class="list-element-title">${item.description}</h3><button class="income-del-btn del-btn"><i class="ion-ios-close-outline" id="${"btn-inc-" + item.id}"></i></button><i class=list-element-value>$${item.value}</i></li>`;

            //li appended to end of container (ul)
            var listContainer = document.getElementsByClassName('income-list')[0];
            listContainer.insertAdjacentHTML('beforeend', htmlChunk);
        }
        else if (item.type === "exp"){
            //HTML String formulation
            var htmlChunk = `<li class="expenses-list-item" id=${"exp-" + item.id}><h3 class=list-element-title>${item.description}</h3><button class="expenses-del-btn del-btn"><i class="ion-ios-close-outline" id="${"btn-exp-" + item.id}"></i></button><i class="list-element-percent">${item.percentage}%</i><i class=list-element-value>$${item.value}</i>`;

            //li appended to end of container (ul)
            var listContainer = document.getElementsByClassName('expenses-list')[0];
            listContainer.insertAdjacentHTML('beforeend', htmlChunk);
        }
        else{
            console.log("Error: Unsuported Type")
        }
    }

    function updateBudget(){

        var dataTotals = Data_Module.getDataTotals();

        //Income
        if(dataTotals[0] <=0){
            document.querySelector('.income-value').textContent = "-----"; 
        }
        else{
            document.querySelector('.income-value').textContent = "+ $" + dataTotals[0]; 
        }

        //Expenses
        if(dataTotals[1] <=0){
            document.querySelector('.expenses-value').textContent = "-----"; 
        }
        else{
            document.querySelector('.expenses-value').textContent = "- $" + dataTotals[1]; 
        }
        
        //Expense %
        if(dataTotals[3] <=0){
            document.querySelector('.expenses-percent').textContent = "--%"; 
        }
        else{
            document.querySelector('.expenses-percent').textContent = dataTotals[3] + "%"; 
        }        
        
        
        document.querySelector('.budget-total').textContent = "$" +dataTotals[2] //Budget  

    }

    function updatePercentages(){
        var percentageElements = document.getElementsByClassName('list-element-percent');
        var currPercentageElem, updatedPercent;
        for (var i = 0; i < percentageElements.length; i++) {

            currPercentageElem = percentageElements.item(i);
            updatedPercent = Data_Module.getDataExpenses()[i].percentage;
            currPercentageElem.textContent = updatedPercent + "%";
        }
    };

    

    return{
        submitItem: function(id){
            
            //Getting values from form
            var itemType = document.querySelector('.op-menu').value;
            var itemDescription = document.querySelector('.input-description').value;
            var itemValue = document.querySelector('.input-value').value;

            if(itemValue === "" || itemDescription === ""){
                console.log("Unable to submit w/ empty fields.")
            }
            else{

                //Add item to list
                var newItem = Data_Module.addItem(id, itemType, itemDescription, itemValue)

                //Updating UI
                appendHTML(newItem);
                updateBudget();
                updatePercentages();

                //Clearing form
                document.querySelector('.input-description').value = "";
                document.querySelector('.input-value').value = "";

                //Log
                Data_Module.getDataPreview();
            }
        },
        removeItem: function(ID){
            var type = ID.substring(4,7);
            var id = Number(ID.substring(8));

            //Delete item
            Data_Module.deleteItem(type, id);
            
            //Updating UI
            var toRemove = document.getElementById(ID).parentNode.parentNode;
            toRemove.remove(); //CHECK: Could need parent to be removed instead.
            updateBudget() 
            updatePercentages(); 
        },
        restoreItem: function(itemID, itemType, itemDescription, itemValue){
            //Add item
            var newItem = Data_Module.addItem(itemID, itemType, itemDescription, itemValue)

            //Updating UI
            appendHTML(newItem);
            updateBudget();
            updatePercentages();

            //Clearing form
            document.querySelector('.input-description').value = "";
            document.querySelector('.input-value').value = "";

            //Log
            Data_Module.getDataPreview();
        },
        setDate: function(){
            var today = new Date();
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];  
            currentMonth = monthNames[today.getMonth()];
            document.querySelector('.budget-title').textContent = `Available Budget in ${currentMonth}:`;
        }
    }
})();