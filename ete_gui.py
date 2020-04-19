
from bottle import route, run, template, request, static_file, Bottle
import eel
import os,sys
import shutil

from viewplugin import view_plugin
from viewplugin.ete3_webserver import webapi
from ete3.tools import ete_build
from ete3.tools.utils import which
from ete3 import Tree

ete_gui = Bottle()


ete3_path = which("ete3")

@ete_gui.route('/')
def index():
    return static_file('ete_gui.html', root='./web')

############ ete_build #######################
@eel.expose                         # Expose this function to Javascript
def run_ete_build_py(seq_type, input_type, sequence, workflow, out_dir='data/output', tool_dir="ete3_apps/bin"):
    running_args = []
    builtin_apps_path = None
    builtin_apps_path = os.path.join(os.path.split(ete3_path)[0], tool_dir)
    call_ete3 = ['ete3']

    input_data_file = './data/tmp/input_data'

    #print('this is ', sequence)
    if os.path.isfile(sequence):
        shutil.copy(sequence, input_data_file)
    elif sequence.startswith('>') or sequence.startswith('&gt;'):
        sequence = sequence.replace('&gt;', '>')
        with open(input_data_file, 'w') as f:
            f.write(sequence)
    else:
        sys.exit("\nWrong input type\n")

    if seq_type == "nucleotide":
        input_faa = ['-n', input_data_file]
    else:
        input_faa = ['-a', input_data_file]

    if input_type == 'unaligned':
        dealign_flag = []
    else:
        dealign_flag = ['--dealign']

    workflow_arg = ['-w', workflow]
    output_dir = ['-o', out_dir]
    clearall = ['--clearall']

    running_args = call_ete3 + input_faa + workflow_arg + output_dir + clearall + dealign_flag
    print(running_args)

    ete_build._main(running_args, builtin_apps_path)
    
    global final_tree_nw, final_tree_nwx, final_tree_fa, final_tree_used_aln, final_tree_png, path
    
    path = os.path.join(out_dir,workflow)
    target_file = os.path.split(input_data_file)[-1] # file of the path
    
    final_tree_nw  =  target_file+'.final_tree.nw'
    final_tree_nwx  =  target_file+'.final_tree.nwx'
    final_tree_fa  =  target_file+'.final_tree.fa'
    final_tree_used_aln = target_file+'.final_tree.used_alg.fa'
    final_tree_png = target_file+'.final_tree.png'
    return

################ ete_compare #####################
@eel.expose
def run_ete_compare_py(src, ref, format=0 ,use_collateral=False, min_support_source=0.0, min_support_ref=0.0,
                        has_duplications=False, expand_polytomies=False, unrooted=False,
                        max_treeko_splits_to_be_artifact=1000, ref_tree_attr='name', source_tree_attr='name'):

    src_tree = Tree(newick=src)
    ref_tree = Tree(newick=ref)
    compare_result = Tree.compare(src_tree, ref_tree, use_collateral=False, min_support_source=0.0, min_support_ref=0.0,
                        has_duplications=False, expand_polytomies=False, unrooted=False,
                        max_treeko_splits_to_be_artifact=1000, ref_tree_attr='name', source_tree_attr='name')
    """
    'common_edges': {('a', 'b', 'c'), ('a', 'b', 'c', 'g')}, 
    'source_edges': {('a', 'b'), ('a', 'b', 'c'), ('a', 'b', 'c', 'g')}, 
    'ref_edges': {('a', 'c'), ('a', 'b', 'c'), ('a', 'b', 'c', 'g')}
    """
    #compare_result['common_edges'] = list(compare_result['common_edges'])
    #compare_result['source_edges'] = list(compare_result['source_edges'])
    #compare_result['ref_edges'] = list(compare_result['ref_edges'])

    #print(compare_result)
    return dict((k, compare_result[k]) for k in ['rf', 'max_rf', 'ref_edges_in_source', 'source_edges_in_ref', 'effective_tree_size', 'norm_rf', 'treeko_dist', 'source_subtrees'])

def set_to_array(set_obj):
    result = []
    for item in list(set_obj):
        item = list(item)
        result.append(item)
    return result
################# ete evol      ##############################################
from ete3 import EvolTree
from ete3.treeview.layouts import evol_clean_layout

@eel.expose
def run_evol_py(tree, alg, branch_model, site_models, workir='data/evol_output', tool_dir="ete3_apps/bin"):
    print(tree, alg, branch_model, site_models)
    builtin_apps_path = None
    builtin_apps_path = os.path.join(os.path.split(ete3_path)[0], tool_dir)
    

    tree = EvolTree(tree, binpath=builtin_apps_path)
    tree.link_to_alignment(alg)
    tree.workdir = workir
    
    ###branch model
    if branch_model:
        branch_model = str(branch_model)
        tree.run_model(branch_model)
        print(tree.get_evol_model(branch_model))
    
    ### site model
    for site_model in site_models:
        tree.run_model(site_model)
        #tree.run_model('SLR.lele')
    
    global evol_output_dir, final_evol_tree
    evol_output_dir = workir
    final_evol_tree = evol_output_dir+'/tree_evol_result.png'
    
    tree.render(final_evol_tree, layout=evol_clean_layout, histfaces=site_models)
    return tree


################# ete ncbiquery ##############################################
from ete3 import NCBITaxa

@eel.expose
def run_ete_ncbiquery_py(query):
    ncbi = NCBITaxa()
    query = query.split(',')
    final_query = []
    for i in query:
        try:
            i.lstrip()
            i = int(i)
            final_query.append(i)
        except ValueError:
            i = i.lstrip()
            name2taxid = ncbi.get_name_translator([i])[i]
            final_query += name2taxid
    tree = ncbi.get_topology(final_query)
    
    
    return tree.get_ascii(attributes=["sci_name", "rank"])

##unfinished
@route('/data/upload', method='POST')
def do_upload():
    if request.method == 'POST':
        uploads = request.files.getall('upload_file')
        data = request.files.data
        for upload in uploads:
            if upload.filename.endswith('fa'):
                upload.save('./data/input_data.faa', overwrite=True)
            if upload.filename.endswith('nw'):
                upload.save('./data/input_data.nw', overwrite=True)
    return "Found {0} files, did nothing.".format(len(uploads))

@route('/example/<filename>')
def get_example_py(filename):
    return static_file(filename, root='./web/example/')

############# ete_build ##########################################
@route('/output/result/<jobid>/input_data.final_tree.fa')
def get_faa(jobid):
    return static_file(final_tree_fa, root=path+'/')

@route('/output/result/<jobid>/input_data.final_tree.used_alg.fa')
def get_faa(jobid):
    return static_file(final_tree_used_aln, root=path+'/')

@route('/output/result/<jobid>/input_data.final_tree.nw')
def get_nw(jobid):
    return static_file(final_tree_nw, root=path+'/')

@route('/output/result/<jobid>/input_data.final_tree.nwx')
def get_nw(jobid):
    return static_file(final_tree_nwx, root=path+'/')

@route('/output/result/<jobid>/input_data.final_tree.png')
def get_tree(jobid):
    return static_file(final_tree_png, root=path+'/')

@route('/output/result/<jobid>')
def result(jobid):
    return static_file('result.html', root='./web/')

#################### ete_evol ###################################
@route('/output/evol_result/<jobid>')
def evol_result(jobid):
    return static_file('evol_result.html', root='./web/')

@route('/output/evol_result/<jobid>/tree_evol_result.png')
def get_evoltree(jobid):
    return static_file(final_evol_tree, root='.')


#################### ete_view(plugin) #####################
# @ete_gui.route('/ete_view')
# def ete_view():
#     return static_file('webplugin_example.html', root='./viewplugin/demo')


#run_ete_py()
if __name__ == "__main__":
    ete_gui.mount('viewplugin/ete3_webserver/', webapi) ####ete_view plugin
    view_plugin.main()

    eel.init('web')
    eel.start('ete_gui.html', size=(800,1000))    # Start
    