function pd(s) {
  var l=d=r=i=j=0,ar=br=[];
  ar = s.split(/[\n\r]+/);
  j = ar.length;
  for(i=0;i<j;i++) {
    ar[i].replace(/\s+/g,"");
    if(ar[i].match(/^>/)){continue;}
    l += ar[i].length;
    br = ar[i].match(/[atgcnu]/gi);
    if(br !== null){
      d += br.length;
    }
  }
  if(l < 1){return 'protein';}
  if (d/l > 0.85) {
    return 'dna';
  }
  return 'protein';
}

function pmove(f,t) {
  var form=to=tp=sq={},ckids=1,seq=type="";
  if(!document.getElementById(f)){
    return false;
  }
  form = document.getElementById(f);
  if(form.ckids){
    ckids = form.ckids.value;
  }
  if(form.sequence) {
    seq = form.sequence.value;
  }
  if (document.getElementById("stp") !== null &&
      document.getElementById("stp").checked === true) {
    type = "protein";
  }
  else if (document.getElementById("stn") !== null &&
           document.getElementById("stn").checked === true) {
    type = "nucleotide";
  }
  else {
    type = pd(seq);
  }
  if(document.getElementById(t)) {
    to = document.getElementById(t);
    to.action = '/tools-bin/' + t;
    to.ckids.value = ckids;
    to.type.value = type;
    to.sequence.value = seq;
    to.showhtml.value = 'on';
  }
  else {
    to = document.createElement('form');
    to.setAttribute('id',t);
    to.setAttribute('method','post');
    to.setAttribute('action','/tools-bin/'+t);
    createInput(to,'hidden','ckids',ckids);
    createInput(to,'hidden','type',type);
    createInput(to,'hidden','sequence',seq);
    createInput(to,'hidden','showhtml','on');
    document.body.appendChild(to);
  }    
  to.submit();
}

function createInput(form,type,name,value) {
  var obj = document.createElement('input');
  obj.setAttribute('type',type);
  obj.setAttribute('name',name);
  obj.setAttribute('value',value);
  form.appendChild(obj);
}
