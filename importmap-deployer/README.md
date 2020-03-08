# live-import-map-deployer

Sample repo to demonstrate how to extend the Docker Hub image `singlespa/import-map-deployer`. 

Contains a sample `conf.js` used when invoking `import-map-deployer`:

```sh
$ import-map-deployer conf.js
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