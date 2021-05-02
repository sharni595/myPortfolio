
function nutritionApi(food){
    var apiUrl = "https://platform.fatsecret.com/js?key=fde4e59ae2ce4159afdabf24776cab60";
    
    fetch(apiUrl, {mode: "no-cors"})
        .then(function(response){
            console.log(response);
        }).then(function(data){
            console.log(data);
        })
}

nutritionApi();
//pseudocode:
