# intenta-plugin-example
Basic example of how to integrate w/ Intenta plugin


# Testing this example

* [Download the Zip](https://github.com/netplenish/intenta-plugin-example/archive/master.zip)
* Unzip and install unpacked using chrome developer mode.
* Open up chrome debugger and look for xhr calls to pixel.intenta.io
![](https://www.evernote.com/shard/s145/sh/a859811b-aea0-4362-81b1-c6060dd7a211/afaa27e18b26e815be03a011b41c173c/deep/0/How-to-Make-a-Chrome-Extension.png)

* Confirm it works on Facebook & you don't see ugly "CONTENT-SECURITY-POLICY" errors.
  Once its installed if you go to facebook and see the same xhr calls you are good. 
  If you see red errors about "CONTENT-SECURITY-POLICY" then you didn't installed the background code correctly or you didn't correctly add the "webRequestBlocking" permission to your manifest. You need to add that so we can allow your plugin to talk to us on facebook. 
