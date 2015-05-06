# intenta-plugin-example
Basic example of how to integrate w/ Intenta plugin


# Testing this example

* [Download the Zip](https://github.com/netplenish/intenta-plugin-example/archive/master.zip)
* Unzip and install unpacked using chrome developer mode.
* Open up chrome debugger and look for xhr calls to pixel.intenta.io
![](https://www.evernote.com/shard/s145/sh/a859811b-aea0-4362-81b1-c6060dd7a211/afaa27e18b26e815be03a011b41c173c/deep/0/How-to-Make-a-Chrome-Extension.png)

* Confirm it works on Facebook.
  
  Once installed, go to facebook and if you see successful api calls to pixel.intenta.io, you are good.

  You have something wrong if you see this in the chrome debugger:
  ![](https://www.evernote.com/shard/s145/sh/b0810652-2ef4-4d96-b5ec-9ee84def6e1d/1343c2a6a8dddd5eba78e9c9952de903/deep/0/(85)-Facebook.png)

## Issues

#### Facebook not working
##### Issue 1: Missing Permission
Make sure you are not missing the "webRequestBlocking" permission in your manifest.json
```
"permissions": [
	"tabs","cookies", "http://*/", "https://*/","webRequest", "webRequestBlocking"
	],
```	

##### Issue 2: background.js code not integrated.
In your manifest.json file

```
"background": {
    "scripts": ["background.js"]
  },
```

Add all the code in this background.js to your background.js file. 
If this doesn't work, look at the background.js docs inside the Publishers dashboard of dashboard.intenta.io UI (we might have forgotten to upgrade this demo code)