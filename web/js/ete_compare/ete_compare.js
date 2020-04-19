async function ete_compare(){


    var src_tree = document.getElementById("src_tree").value
    var ref_tree = document.getElementById("ref_tree").value

    //eel.run_ete_compare_py(src_tree, ref_tree)
    console.log(src_tree, ref_tree) //return as object
    let compare_result = await eel.run_ete_compare_py(src_tree, ref_tree)()
    console.log(compare_result)
    
    let compare_result_div = document.getElementById('compare_result');
    //document.getElementById('compare_result').innerHTML = compare_result
    //document.getElementById("compare_result").textContent = JSON.stringify(compare_result, undefined, 2);
    
    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var json_obj = []
    json_obj.push(compare_result)

    CreateTableFromJSON(json_obj)

}

function CreateTableFromJSON(json_obj) {
    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    for (var i = 0; i < json_obj.length; i++) {
        for (var key in json_obj[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < json_obj.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = json_obj[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}