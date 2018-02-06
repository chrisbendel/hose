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

#songs = pd.read_csv("output.csv", header=None).fillna(0)
songs = pd.read_csv("output.csv", header=None, nrows=20).fillna(0)
copy = songs
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
data = clean_dataset(data)
km = KMeans(n_clusters=numClusters, init='k-means++', n_jobs=-1, n_init=50)
km.fit(data)

x = km.fit_predict(data)

songs['Cluster'] = x
with open('songs.csv', 'wb') as outcsv:
    writer = csv.writer(outcsv)
    writer.writerow(["ID", "Song", "Date", "Set", "Cluster"])
  
    for i in range(numClusters):
        print ("Cluster: " + str(i))
        for x in songs[songs['Cluster'] == i][0]:
            res = requests.get("http://phish.in/api/v1/tracks/" + str(x)).json()
            writer.writerow([res['data']['id']] + [res['data']['title']] + [res['data']['show_date']] + [res['data']['set']] + [i])
            print(res['data']['title'], res['data']['show_date'], res['data']['id'])
        print("<-------------->")

songs.to_csv("clusters.csv", index = False)

