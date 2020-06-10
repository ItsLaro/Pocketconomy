/**
 * TO-DO:
 * Add final CSS styling & make mobile friendly
 */


//IIFE to encapsulate module.
Data_Module = (function(){

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        currentID: -1
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.type = 'inc';
    };

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //negative means N/A
        this.type = 'exp';
    };

    Expense.prototype.calcPercent = function(totalIncome){
        if(totalIncome <= 0){
            this.percentage = -1;
        }
        else{
            this.percentage = Math.round((this.value / totalIncome)* 100);
        }
    }

    return {
        addItem: function(type, description, value){

            //ID management
            id = this.newID();    

            if(type === "inc"){
                //Item creation and addition
                var numValue = parseFloat(value); //Parses numeric value
                newItem = new Income(id, description, numValue);
                data.allItems.inc.push(newItem); 
                data.totals.inc += newItem.value; 

                //Updating Percentages
                data.allItems.exp.forEach(function(expense){
                    expense.calcPercent(data.totals.inc);
                })
                
            }
            else if (type === "exp"){
                //Item creation and addition
                var numValue = parseFloat(value);//Parses numeric value
                newItem = new Expense(id, description, numValue);
                data.allItems.exp.push(newItem); 
                data.totals.exp += newItem.value;

                //Calculating percentage of new item
                newItem.calcPercent(data.totals.inc);
            }
            else{
                console.log("Error: Unexpected Item Addition")
            }

            return newItem;
        },
        deleteItem: function(type, ID){
            data.allItems[type].forEach(function(current, index, array){
                if(current.id === ID){
                    //Remove from total
                    valueToDelete = array[index].value;
                    data.totals[type] -= valueToDelete;

                    //Update Percentages
                    if(type === "inc"){
                        data.allItems.exp.forEach(function(expense){
                            expense.calcPercent(data.totals.inc);
                        })
                    }

                    //Pop out of item collection
                    array.splice(index, 1);
                }
            })
        },
        newID: function(){
            data.currentID += 1; //ID initialized as -1, so starts at 0
            return data.currentID;
        },
        getDataTotals: function(){
            var budget = data.totals.inc - data.totals.exp
            if (data.totals.inc <= 0){
                var totalExpensePercentage = -1;
            }
            else{
                var totalExpensePercentage = Math.round((data.totals.exp / data.totals.inc)* 100) ;
            }
            
            return [data.totals.inc, data.totals.exp, budget, totalExpensePercentage];
        },
        getDataExpenses: function(){
            return data.allItems.exp;
        },
        getDataPreview: function(){
            console.log(data);
        }
    }
})();

//IIFE to encapsulate module.
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
        submitItem: function(){
            
            //Getting values from form
            var itemType = document.querySelector('.op-menu').value;
            var itemDescription = document.querySelector('.input-description').value;
            var itemValue = document.querySelector('.input-value').value;

            if(itemValue === "" || itemDescription === ""){
                console.log("Unable to submit w/ empty fields.")
            }
            else{
                //Add item
                var newItem = Data_Module.addItem(itemType, itemDescription, itemValue)

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
        restoreItem: function(itemType, itemDescription, itemValue){
            //Add item
            var newItem = Data_Module.addItem(itemType, itemDescription, itemValue)

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

Driver_Module = (function(){

    //Gets Month for Title
    UI_Module.setDate();

    //RESTORE FROM DB:

    fetch('http://localhost:3000/db')
        .then(response => response.json())
        .then(data => restoreSession(data))
        .catch(error => console.log("Error in loading from db: " + error));

    restoreSession = function(data){
        /*
        Restores items from DB and displays them on UI. 
        */
        data.forEach( function(elem){
            UI_Module.restoreItem(elem.type, elem.description, elem.value); 
            console.log(elem.type);
        }
    )};

    //EVENT LISTENERS:

    //Clicking submit button
    document.querySelector('.submit-btn').addEventListener('click', UI_Module.submitItem); 

    //Pressing Enter from Description bar
    document.querySelector('.input-description').addEventListener('keyup', function(e){ //Pressing Enter
        if (e.keyCode === 13){
            UI_Module.submitItem();
        }
    });

    //Pressing Enter from Value bar
    document.querySelector('.input-value').addEventListener('keyup', function(e){
        if (e.keyCode === 13){
            UI_Module.submitItem();
        }
    });

    //Clicking delete from any item entry
    document.querySelector('.list-container').addEventListener('click', function(e){
        UI_Module.removeItem((e.target.id));
    });
    console.log(document);

}());


