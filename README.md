# Forked Scality S3 Server
Forked to allow GET Bucket V2 calls to support local developer test environments. Full support has not been implemented!

## Learn more at [s3.scality.com](http://s3.scality.com)

## Installation

### Dependencies

Building and running the Scality S3 Server requires node.js 6.9.5 and npm v3
. Up-to-date versions can be found at
[Nodesource](https://github.com/nodesource/distributions).

### Clone source code

```shell
git clone https://github.com/JoshPerkins/S3.git
```

### Install js dependencies

Go to the ./S3 folder,

```shell
npm install
```

## Run it with a file backend

```shell
npm start
```

This starts an S3 server on port 443. Two additional ports 11990 and
11991 are also open locally for internal transfer of metadata and data,
respectively.

The default access key is accessKey1 with
a secret key of verySecretKey1.

By default the metadata files will be saved in the
localMetadata directory and the data files will be saved
in the localData directory within the ./S3 directory on your
machine.  These directories have been pre-created within the
repository.  If you would like to save the data or metadata in
different locations of your choice, you must specify them with absolute paths.
So, when starting the server:

```shell
mkdir -m 700 $(pwd)/myFavoriteDataPath
mkdir -m 700 $(pwd)/myFavoriteMetadataPath
export S3DATAPATH="$(pwd)/myFavoriteDataPath"
export S3METADATAPATH="$(pwd)/myFavoriteMetadataPath"
npm start
```


