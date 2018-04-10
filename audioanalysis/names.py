import requests
import os
import json
import numpy as np
import csv
import pandas as pd

songs = pd.read_csv("songdetailswithnames.csv")

# titles = []
# for index, row in songs.iterrows():
#   res = requests.get("http://phish.in/api/v1/tracks/" + str(row['id'])).json()
#   print(index, row['id'])
#   titles.append(res['data']['title'])

# print(titles)
# songs['title'] = titles
# print(songs)
songs = songs.drop(songs.columns[0], axis=1)
songs.to_csv('songDetailNames.csv', index=False)