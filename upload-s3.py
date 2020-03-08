import boto
import boto.s3
import sys
import os
from boto.s3.key import Key
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-f','--file', help='file path of file to upload', default='importmap.json')
parser.add_argument('-n','--name', help='name of S3 bucket', default='mfe', required=True)
args = parser.parse_args()

AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
FILE_PATH = args.file or os.environ['FILE_PATH']
AWS_BUCKET_NAME = args.bucket or os.environ['AWS_BUCKET_NAME']

bucket_name = AWS_BUCKET_NAME
conn = boto.connect_s3(AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY)


bucket = conn.create_bucket(bucket_name,
    location=boto.s3.connection.Location.DEFAULT)

file_path = FILE_PATH
print('Uploading %s to Amazon S3 bucket %s' % (file_path, bucket_name))

def percent_cb(complete, total):
    sys.stdout.write('.')
    sys.stdout.flush()


k = Key(bucket)
k.key = 'importmap.json'
k.set_contents_from_filename(file_path,
    cb=percent_cb, num_cb=10)