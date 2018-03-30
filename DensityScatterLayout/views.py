import numpy as np
import os.path

from django.shortcuts import render
from django.http import JsonResponse
from sklearn import manifold, ensemble, decomposition
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from Vis.settings import STATIC_ROOT


# Create your views here.
def index(request):
    return render(request, 'index.html')


def ajax_init(request):
    scatter = []
    properties = []
    files = os.path.join(STATIC_ROOT, 'data\\properties.txt')
    if request.method == 'GET':
        mode = request.GET['mode']
        type = request.GET['type']
        for line in open(files, "r"):
            temp = []
            temp.extend(line.strip().split(' '))
            temp = map(float, temp)
            properties.append(temp)
        pos = analyse_mode(properties, mode)
        analyse_type(pos, type)
        # print time.strftime('%H:%M:%S', time.localtime(time.time()))
    return JsonResponse('1', safe=False)

def analyse_mode(properties, mode):
    mode = float(mode)
    if mode == 1:
        pca = PCA(n_components=2)
        pos = pca.fit_transform(properties)
    elif mode == 0:
        model = TSNE(n_components=2, random_state=0)
        np.set_printoptions(suppress=True)
        pos = model.fit_transform(properties)
    elif mode == 2:
        clf = manifold.Isomap(n_components=2)
        pos = clf.fit_transform(properties)
    else:
        hasher = ensemble.RandomTreesEmbedding(n_estimators=200, random_state=0, max_depth=5)
        x_transformed = hasher.fit_transform(properties)
        pca = decomposition.TruncatedSVD(n_components=2)
        pos = pca.fit_transform(x_transformed)
    return pos


def analyse_type(pos, type):
    type = float(type)
    if type == 0:
        files = os.path.join(STATIC_ROOT, 'data\\scatter.tsv')
        file_object = open(files, 'w')
        file_object.writelines('x	y\n')
        for i, p in enumerate(pos):
            s = str(int(p[0])) + '	' + str(int(p[1])) + '\n'
            file_object.writelines(s)
        file_object.close()
    else:
        files = os.path.join(STATIC_ROOT, 'data\\density.tsv')
        file_object = open(files, 'w')
        file_object.writelines('x	y\n')
        for i, p in enumerate(pos):
            s = str(int(p[0])) + '	' + str(int(p[1])) + '\n'
            file_object.writelines(s)
        file_object.close()
