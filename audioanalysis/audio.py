#Basic stuff
import requests
import urllib2
from multiprocessing import Pool
import time
import os
import json
from sklearn.cluster import KMeans
import sklearn.cluster
import numpy as np
import csv
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import normalize

#Audio stuff
from pyAudioAnalysis import audioBasicIO
from pyAudioAnalysis import audioFeatureExtraction
from pyAudioAnalysis.audioBasicIO import convertDirMP3ToWav
from pyAudioAnalysis.audioFeatureExtraction import dirWavFeatureExtraction
import matplotlib.pyplot as plt
from matplotlib import pyplot

path = os.getcwd() + "/songs/"

def clean_dataset(df):
    assert isinstance(df, pd.DataFrame), "df needs to be a pd.DataFrame"
    df.dropna(inplace=True)
    indices_to_keep = ~df.isin([np.nan, np.inf, -np.inf]).any(1)
    return df[indices_to_keep].astype(np.float64)

def deleteMP3s():
    for filename in os.listdir(path):
        if filename.endswith(".mp3"):
            os.remove(path + filename)

def deleteWAVs():
    for filename in os.listdir(path):
        if filename.endswith(".wav"):
            os.remove(path + filename)

def downloadMP3s(url):
    filename = str(url.split('/')[-1])
    u = urllib2.urlopen(url)
    f = open(path + filename, 'wb')
    f.write(u.read())
    f.close()

def getMP3Urls(songs):
    return [song['mp3'] for song in songs]

def extractAudioFeatures():
    features, filename = dirWavFeatureExtraction(path, 10, 5, .5, .25, True)
    
    d = {}
    for i in range(len(features)):
        trackID = str(filename[i].split('/')[-1]).replace(".wav", "")
        d[trackID] = features[i].tolist()

    with open("output.csv", "a") as f_output:
        csv_output = csv.writer(f_output)

        for key in sorted(d.keys()):
            csv_output.writerow([key] + d[key])

    deleteWAVs()

#start_time = time.time()
# Pagination stuff for doing all songs
#res = requests.get("http://phish.in/api/v1/tracks").json()
#num_pages = res['total_pages']
#for page in range(1, num_pages + 1):
#    print(page)
#    res = requests.get("http://phish.in/api/v1/tracks", params={'page': page}).json()
#    urls = getMP3Urls(res['data'])
#    pool = Pool()
#    pool.map(downloadMP3s, urls)
#    convertDirMP3ToWav(path, 16000, 1, False)
#    deleteMP3s()
#    extractAudioFeatures()
#    pool.close()

#print("--- %s seconds ---" % (time.time() - start_time))

songs = pd.read_csv("output.csv", header=None).fillna(0)
# songs = pd.read_csv("output.csv", header=None, nrows=20).fillna(0)
numClusters = 10

# ==== This section is for setting our initial centroids, if we choose to === #
# =========================================================================== #

# c1 = songs.loc[songs[0] == 18050] #Moma
# c2 = songs.loc[songs[0] == 5559] #Nellie
# c3 = songs.loc[songs[0] == 12937] #mars

# # #convert to matrix for init
# c1 = c1.drop(c1.columns[0], axis=1).as_matrix()
# c2 = c2.drop(c2.columns[0], axis=1).as_matrix()
# c3 = c3.drop(c3.columns[0], axis=1).as_matrix()

# c1 = (c1 - c1.mean()) / (c1.max() - c1.min())
# c2 = (c2 - c2.mean()) / (c2.max() - c2.min())
# c3 = (c3 - c3.mean()) / (c3.max() - c3.min())

# init = np.array([c1[0], c2[0], c3[0]], np.float64)

# km = KMeans(n_clusters=numClusters, n_jobs=-1, init=init, n_init=1)

# =========================================================================== #



# remove the ids for clustering
data = songs.drop(songs.columns[0], axis=1)

data = (data - data.mean()) / (data.max() - data.min())

km = KMeans(n_clusters=numClusters, init='k-means++', n_jobs=-1, n_init=50)
km.fit(data)

labels = km.labels_
centroids = km.cluster_centers_

clusters = km.fit_predict(data)
data['Cluster'] = clusters
labels = km.labels_
fig,ax = plt.subplots()
annot = ax.annotate("", xy=(0,0), xytext=(-20,20),textcoords="offset points",
                    bbox=dict(boxstyle="round", fc="w"),
                    arrowprops=dict(arrowstyle="->"))
annot.set_visible(False)

for i in range(numClusters):
    ds = data[data['Cluster'] == i]
    ds.drop('Cluster',1)
    pyplot.plot(ds.iloc[:,0],ds.iloc[:,1],'o')
    lines = pyplot.plot(centroids[i,0],centroids[i,1],'kx')
    pyplot.setp(lines,ms=15.0)
    pyplot.setp(lines,mew=2.0)

def update_annot(ind):
    # x,y = line.get_data()
    # annot.xy = (x[ind["ind"][0]], y[ind["ind"][0]])
    # text = "test"
    # # text = "{}, {}".format(" ".join(list(map(str,ind["ind"]))), 
    # #                        " ".join([names[n] for n in ind["ind"]]))
    # annot.set_text(text)
    # annot.get_bbox_patch().set_alpha(0.4)


def hover(event):
    vis = annot.get_visible()
    if event.inaxes == ax:
        cont, ind = line.contains(event)
        if cont:
            update_annot(ind)
            annot.set_visible(True)
            fig.canvas.draw_idle()
        else:
            if vis:
                annot.set_visible(False)
                fig.canvas.draw_idle()
fig.canvas.mpl_connect("motion_notify_event", hover)
pyplot.show()

# songs['Cluster'] = clusters
# with open('songs.csv', 'wb') as outcsv:
#     writer = csv.writer(outcsv)
#     writer.writerow(["ID", "Song", "Date", "Set", "Cluster"])
  
#     for i in range(numClusters):
#         print ("Cluster: " + str(i))
#         for x in songs[songs['Cluster'] == i][0]:
#             res = requests.get("http://phish.in/api/v1/tracks/" + str(x)).json()
#             writer.writerow([res['data']['id']] + [res['data']['title']] + [res['data']['show_date']] + [res['data']['set']] + [i])
#             print(res['data']['title'], res['data']['show_date'], res['data']['id'])
#         print("<-------------->")

# songs.to_csv("clusters.csv", index = False)

