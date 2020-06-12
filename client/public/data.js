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
        addItem: function(id, type, description, value){
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
        restoreID : function(latestID) {
            data.currentID = latestID;
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