# import-map-deployer

Repo with `import-map-deployer` image that extends the official `singlespa` Docker Hub image `singlespa/import-map-deployer`.
The image contains a sample `conf.js` config file used when invoking `import-map-deployer`.

```sh
$ import-map-deployer conf.js
# ...
```

Clone this repo and create your own `conf.js` file.

Make sure each location entry point to an actual AWS S3 bucket. See [AWS S3 url styles](http://www.wryway.com/blog/aws-s3-url-styles/)

```js
{
  locations: {
    reactMf: 's3://react.microfrontends.app/importmap.json',
  }
}
```  

## importmap

Note that the image initially contains an empty `importmap.json` file.
You can push updates to the `importmap.json` storage entry (blob) via the `importmap-deployer` service.
