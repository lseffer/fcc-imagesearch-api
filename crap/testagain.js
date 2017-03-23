var testapi = require("./bing_search.js");
testapi.searchBing('mouse',0, function(data){
    console.log(JSON.stringify(data, null, 4));
});

// testapi.searchBing('mouse',0);

    
// console.log(JSON.stringify(results, null, 4));