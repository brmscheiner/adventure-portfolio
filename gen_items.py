#Usage: python gen_items.py > items.json

import random
import json

class Item:
    def __init__(self, coords, name, icon, template=''):
        self.coords = coords
        self.name = name
        self.icon = icon
        self.template = template
    def get(self):
        return {"type": "Feature",
                "properties": {
                    "name": self.name,
                    "icon": self.icon,
                    "template": self.template,
                    "default": True
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": self.coords
                }
            }

def getRandomCoords():
    min_lat = 33.1787109375
    min_lon = 3.1734250695079433
    max_lat = 48.97705078125
    max_lon = 9.318990192397905
    lat = random.uniform(min_lat, max_lat)
    lon = random.uniform(min_lon, max_lon)
    return [lat, lon]

def buildItems():
    Items = []
    for _ in range(20):
        tree = Item(getRandomCoords(), "Tree", "oaktree.png")
        Items.append(tree.get())
    for _ in range(5):
        house = Item(getRandomCoords(), "House", "house.png")
        Items.append(house.get())
    c = {"type": "FeatureCollection"}
    c["features"] = Items
    print(json.dumps(c))

buildItems()

