#Basic stuff
import requests
import urllib2
from multiprocessing import Pool
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

path = os.getcwd() + "/songs/"

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
    features, filename = dirWavFeatureExtraction(path, 10, 10, .5, .5, False)

    d = {}
    for i in range(len(features)):
        print(filename[i])
        print(features[i])
        trackID = str(filename[i].split('/')[-1]).replace(".wav", "")
        d[trackID] = features[i].tolist()

    with open("round2.csv", "a") as f_output:
        csv_output = csv.writer(f_output)

        for key in sorted(d.keys()):
            csv_output.writerow([key] + d[key])

    deleteWAVs()

# Pagination stuff for doing all songs
res = requests.get("http://phish.in/api/v1/tracks").json()
num_pages = res['total_pages']
for page in range(1, num_pages + 1):
   print(page)
   res = requests.get("http://phish.in/api/v1/tracks", params={'page': page}).json()
   urls = getMP3Urls(res['data'])
   pool = Pool()
   pool.map(downloadMP3s, urls)
   pool.close()   
   convertDirMP3ToWav(path, 16000, 1, False)
   deleteMP3s()
   extractAudioFeatures()

# songs = pd.read_csv("output.csv", header=None).fillna(0)
numClusters = 10

# remove the ids for clustering
# data = songs.drop(songs.columns[0], axis=1)

# data = (data - data.min()) / (data.max() - data.min())

# km = KMeans(n_clusters=numClusters, init='k-means++', n_jobs=-1, n_init=50, algorithm="elkan")
# km.fit(data)

# labels = km.labels_
#centroids = km.cluster_centers_

# clusters = km.fit_predict(data)
#data['Cluster'] = clusters

# songs['Cluster'] = clusters
# with open('songdates.csv', 'wb') as outcsv:
#     writer = csv.writer(outcsv)
#     writer.writerow(["id", "Song", "Year", "Set", "Duration", "Cluster"])
 
#     for i in range(numClusters):
#         for x in songs[songs['Cluster'] == i][0]:
#             res = requests.get("http://phish.in/api/v1/tracks/" + str(x)).json()
#             writer.writerow([res['data']['id']] + [res['data']['title'].encode('utf-8')] + [res['data']['show_date']] + [res['data']['set']] + [res['data']['duration']] + [i])
#         print("<-------------->")

#songs.to_csv("clusters.csv", index = False)

