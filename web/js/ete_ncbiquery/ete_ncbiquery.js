async function ete_ncbiquery(){
    var query = document.getElementById("ncbiquery_query").value
    console.log(query)

    let ncbiquery_result = await eel.run_ete_ncbiquery_py(query)()
    console.log(ncbiquery_result)

    let ncbiquery_result_div = document.getElementById('showNCBIquery');
    ncbiquery_result_div.innerHTML = ncbiquery_result
}