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
from sklearn import preprocessing

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
    features, files = dirWavFeatureExtraction(path, 10, 10, .5, .5, True)

    d = {}
    for i in range(len(features)):
        trackID = str(files[i].split('/')[-1]).replace(".wav", "")
        d[trackID] = features[i].tolist()

    with open("temp.csv", "a") as f_output:
        csv_output = csv.writer(f_output)

        for key in sorted(d.keys()):
            csv_output.writerow([key] + d[key])

    deleteWAVs()

# Pagination stuff for doing all songs
# res = requests.get("http://phish.in/api/v1/tracks?per_page=100").json()
# num_pages = res['total_pages']
# for page in range(1, num_pages + 1):
#   res = requests.get("http://phish.in/api/v1/tracks?per_page=100", params={'page': page}).json()
#   urls = getMP3Urls(res['data'])
#   pool = Pool()
#   pool.map(downloadMP3s, urls)
#   pool.close()   
#   convertDirMP3ToWav(path, 16000, 1, False)
#   deleteMP3s()
#   extractAudioFeatures()

def normalize(df):
    result = df.copy()
    for feature_name in df.columns:
        if feature_name != 0:
          result[feature_name] = result[feature_name] / result[feature_name].max()
          result[feature_name] = result[feature_name].fillna(result[feature_name].mean())
    return result

songs = pd.read_csv("temp.csv", header=None)
numClusters = 10
songs = normalize(songs)
km = KMeans(n_clusters=numClusters, init='k-means++', n_jobs=-1, n_init=100, algorithm="elkan")
data = songs.drop(songs.columns[0], axis=1)

km.fit(data)
centroids = km.cluster_centers_

clusters = km.fit_predict(data)
print(clusters)
songs['Cluster'] = clusters
print(songs)

with open('songdetails.csv', 'a') as outcsv:
    print('writing row')
    writer = csv.writer(outcsv)
    writer.writerow(["id", "year", "set", "duration", "cluster"])
 
    for i in range(numClusters):
        for x in songs[songs['Cluster'] == i][0]:
            print('fetching song id', x)
            res = requests.get("http://phish.in/api/v1/tracks/" + str(x)).json()
            d = res['data']
            print(d)
            writer.writerow([d['id']] + [d['show_date'][:4]] + [d['set']] + [d['duration']] + [i])

# songs = songs.drop('Cluster', 1)
songs.to_csv("songfeatures.csv", index = False)