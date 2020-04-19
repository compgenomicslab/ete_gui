// the main function
async function run_ete(){ 

  //var loading_img = '<img border=0 src="loader.gif">';
  //$(recipient).html('<div id="' + jobid + '">' + loading_img + '</div>');
  //$(recipient).fadeTo(500, 0.2);
  //var params = {'jobid': jobid};
  // $('#'+jobid).load('/output/tree/', jobid,
  //   function() {
  //           $('#'+jobid).fadeTo(100, 0.9);
  // });

  var jobid = makeid();
  var workflow = document.getElementById("selectedworkflow").innerHTML;

  if (document.getElementById("sequence").value !== ''){
    var sequence = document.getElementById("sequence").innerHTML
  } else if (document.getElementById("input_path").value !== '') {
    sequence = document.getElementById("input_path").value
  } else {
    alert('Wrong input type')
  }

  if (document.getElementById("stn").checked === true){
      var seq_type = document.getElementById("stn").value
  }else {
      var seq_type = document.getElementById("stp").value
  }
  
  if (document.getElementById("sfu").checked === true){
    var input_type = document.getElementById("sfu").value
  }else {
      var input_type = document.getElementById("sfa").value
  }

  //var upload_file_path = document.getElementById("upload_file").value
  eel.run_ete_build_py(seq_type, input_type, sequence, workflow)
  
  var url = '/output/result/'+jobid
  
  // pass information to result window
  sessionStorage.setItem("workflow", workflow);
  var w = window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes, top=500,left=800,width=1000,height=1000");
  

  // var url = 'output/tree'
  // var request = new XMLHttpRequest()
  // request.open("GET",url)
  // request.send(null);/*设置XHR对象不发送数据到服务器*/
  // request.onload = function() {/*设置当获XHR对象获取到返回信息后执行以下代码*/
  //     if(request.status == 200) {/*如果返回的状态为200，即为成功获取数据*/
  //           var p = document.getElementById("luck");/*获取DOM中id为luck的p元素*/
  //           p.innerHTML = request.responseText
  //           //p.innerHTML = '<img src=\"' + url +'\">';
  //     }
  //   }
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function init_ete(){
  document.getElementById("ete").reset();
  document.getElementById("sequence").innerHTML = "";
  document.getElementById("stp").checked = true;
  init_disp();
  wf();
}

function init_disp(){
  document.getElementById("selectedworkflow").innerHTML = "";
}

function init_sub(){
  for(var i=2;i<6;i++) {
    var id = "workflow" + i;
    initopt(id);
  }
}

function initopt(id){
  var obj = document.getElementById(id);
  var opt = obj.options;
  var l = opt.length;
  for(var i=0;i<l;i++) {
    obj.removeChild(opt[0]);
  }
}

function modtester(){
  var obj3 = document.getElementById("workflow3");
  var obj4 = document.getElementById("workflow4");
  var val3 = obj3.options[obj3.selectedIndex].value;
  var val4 = obj4.options[obj4.selectedIndex].value;

  if (document.getElementById("stn").checked === true) {
    if (val3.match(/prottest/)) {
      alert("Can not select " + val3.replace(/^-/,"") + " for nucleotide." );
      obj3.selectedIndex = 0;
    }
    /*
      ultrafast specifies GTR for raxml substitution model.
      but raxml exits with an error message, "Model GTR does not exist".
    if (val3.match(/ultrafast/)&&val4.match(/raxml/)) {
      alert("Can not select the combination of\n"
            + val3.replace(/^-/,"") + " and " + val4.replace(/^-/,"") + "\n"
            + "for nucleotide." );
      obj3.selectedIndex = 0;
      obj4.selectedIndex = 2;
    }
    */
  }
}

function msa(){
  var obj = document.getElementById("sfa");
  if (obj.checked === true) {
    document.getElementById("workflow1").selectedIndex = 0;
    document.getElementById("workflow2").selectedIndex = 0;
    showwf();
  }
  else {
    document.getElementById("workflow1").selectedIndex = 1;
    document.getElementById("workflow2").selectedIndex = 0;
    showwf();
  }
}

function wf(){
  init_disp();
  showwf();
}

function showwf(){
  var obj1 = document.getElementById("workflow1");
  var obj2 = document.getElementById("workflow2");
  var obj3 = document.getElementById("workflow3");
  var obj4 = document.getElementById("workflow4");

  var val = obj1.value + obj2.value + obj3.value + obj4.value;
  document.getElementById("selectedworkflow").innerHTML = val;
}

function go_ete(){
  var workflow = document.getElementById("selectedworkflow").innerHTML;

  var obj = document.getElementsByName("workflow");
  if (obj.length) {
    var l = obj.length;
    for (var i=0;i<l;i++) {
      document.getElementById("ete").removeChild(obj[0]);      
    }
  }

  if (workflow.length) {
    if (workflow.match(/---/)) {
      alert("Selected workflow is incomplete.");
    }
    else if (workflow == "none-none-none-none") {
      alert("Can not select " + workflow);
    }
    else{
      var par = document.createElement('input');
      par.setAttribute("type","hidden");
      par.setAttribute("name","workflow");
      par.setAttribute("value",workflow);
      document.getElementById("ete").appendChild(par);
      document.getElementById("ete").submit();
    }
  }
  else{
    alert("Select workflow");
  }
}