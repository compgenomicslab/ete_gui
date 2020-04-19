
async function ete_vol(){
    var branch_model = $('#branch_model').val();
    var site_model = $('#site_model').val();
    var jobid = makeid();

    var evol_tree = document.getElementById("evol_tree").innerHTML
    var evol_aln = document.getElementById("evol_aln").innerHTML
    console.log(evol_tree, evol_aln, branch_model, site_model)
    eel.run_evol_py(evol_tree, evol_aln, branch_model, site_model)
    
    var url = '/output/evol_result/'+jobid
    sessionStorage.setItem("branch_model", branch_model);
    sessionStorage.setItem("site_model", site_model);
    
    
    var w = window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes, top=500,left=800,width=1000,height=1000");
}