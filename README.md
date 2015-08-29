# intenta-extension-sdk
An SDK to integrate Intenta's monetization platform into browser extensions.

## Integration Steps

Assuming you have a vendors directory in your application /vendors

Copy the contents of [https://github.com/netplenish/intenta-extension-sdk/tree/master/intenta/dist](intenta/dist) into your application.

You will end up with 

```
/vendors/intenta/dist/intenta_background.js
/vendors/intenta/dist/intenta_content_script.js
```

### Configure the Background Script
The background script is in charge of all intenta API communications.

1. Include the /dist/intenta_background.js in your manifest.json file before your application code.
Ex:
```
"background": {
    "scripts": [
      "vendors/intenta/dist/intenta_background.js",
      "your_app_background_code.js"
    ]
  }
```

2. Initialize the Intenta Agent in your background code.

* Init Agent.
* Set environment
* Set token.

```
var agent = new IntentaAgent();
agent.setEnv('production');
agent.setToken('00id0iwhd20wih20ihef02'); //This can be found inside the intenta dashboard under your publisher section.
agent.run();
```



### Configure Content Script
 
1. Include /dist/intenta_content_script.js in your manifest.json file before your application code.
Ex:
```
"content_scripts":[
  	{
  		"matches": [
  			"<all_urls>"
  		],
      "js": [
        "vendors/intenta/dist/intenta_content_script.js",
        "your_app_content_script.js"
      ]
  	}
  ]
```

2. Ensure your content scripts run on every page
See above  matches block.

3. Initialize Pixler in your content_script file.

```
var pixel = new IntentaPixeler();
pixel.watch();

```

### Ensure Extension Permissions

```
"permissions": [
    "tabs","cookies", "http://*/", "https://*/","webRequest", "webRequestBlocking"
  ],
```

### Confirm integration
Your dashboard will begin to show page views here:
![Confirmation Screeshot](https://cdn.rawgit.com/netplenish/intenta-extension-sdk/master/intenta/docs/confirm.png)

