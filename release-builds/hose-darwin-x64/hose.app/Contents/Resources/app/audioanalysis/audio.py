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

path = os.getcwd() + "/songs/"

def deleteMP3s():
    for filename in os.listdir(path):
        if filename.endswith(".mp3"):
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

    with open("output.csv", "wb") as f_output:
        csv_output = csv.writer(f_output)

        for key in sorted(d.keys()):
            csv_output.writerow([key] + d[key])

# start_time = time.time()

# res = requests.get("http://phish.in/api/v1/tracks?tag=Jamcharts&per_page=200&sort_attr=likes_count&sort_dir=desc").json()
# urls = getMP3Urls(res['data'])
# res = requests.get("http://phish.in/api/v1/songs/black-eyed-katy").json()
# urls = getMP3Urls(res['data']['tracks'])
# res = requests.get("http://phish.in/api/v1/songs/nellie-kane").json()
# urls = urls + getMP3Urls(res['data']['tracks'])
# res = requests.get("http://phish.in/api/v1/songs/the-moma-dance").json()
# urls = getMP3Urls(res['data']['tracks'])
# pool = Pool()
# pool.map(downloadMP3s, urls)

# convertDirMP3ToWav(path, 16000, 1, False)
# deleteMP3s()
# extractAudioFeatures()

# Pagination stuff for doing all songs
# num_pages = res['total_pages']
# for page in range(1, num_pages + 1):
#     res = requests.get("http://phish.in/api/v1/tracks?per_page=30", params={'page': page}).json()
#     print res['page']

# print("--- %s seconds ---" % (time.time() - start_time))

songs = pd.read_csv("output.csv", header=None)
numClusters = 15

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
x = km.fit_predict(data)
songs['Cluster'] = x

with open('songs.csv', 'wb') as outcsv:
    writer = csv.writer(outcsv)
    writer.writerow(["Song", "Date", "Set", "Cluster"])
    
    for i in range(numClusters):
        # print ("Cluster: " + str(i))
        for x in songs[songs['Cluster'] == i][0]:
            res = requests.get("http://phish.in/api/v1/tracks/" + str(x)).json()
            writer.writerow([res['data']['title']] + [res['data']['show_date']] + [res['data']['set']] + [i])
            # print(res['data']['title'], res['data']['show_date'], res['data']['id'])
        # print("<-------------->")

# songs.to_csv("clusters.csv", index = False)
