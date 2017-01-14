import sys
import yaml
import json

def insert_into_mongo(phrases):
    from pymongo import MongoClient
    dbname = "test"
    collection_name = "phrases"
    conn = MongoClient("localhost", 27017)
    db = conn[dbname]
    collection = db[collection_name]
    documents = [{"phrase": phrase} for phrase in phrases ]
    collection.insert_many(documents)
    print "collection %s now has %d documents" % (collection_name, collection.count())


def yaml_to_json(fname):
    with open(fname) as fp:
        obj = yaml.load(fp)
    print(json.dumps(obj, indent=4))


def load_phrases(fname):
    with open(fname) as fp:
        obj = yaml.load(fp)
    return [phrase for phrase in obj["phrases"]]


if __name__ == "__main__":
    fname = sys.argv[1]
    phrases = load_phrases(fname)
    insert_into_mongo(phrases)
