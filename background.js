/**
*	Override requestHeaders of Content-Security-Policy
* 	* http://content-security-policy.com/
**/
var domainsToAdd = ['*.intenta.io'];

function appendDomainsToPolicyHeaders(policy, domainsToAdd){
    var rules  = policy.split(';');

    for(var i = 0; i < rules.length; i++){
        var rulesToAppendTo = [
        'script-src', //Allow scripts to be loaded from other domains.
        'connect-src' //Allow xhr requests to other domain
        ];
        var rule = rules[i];
        var endOfRuleNameIndex = rule.indexOf(" ");
        if(endOfRuleNameIndex > 0){
            var ruleName = rule.substr(0, endOfRuleNameIndex);
            if(rulesToAppendTo.indexOf(ruleName) >= 0){
                rules[i] = rules[i] + ' ' + domainsToAdd.join(" ");
            }
        }
    }
    rules = rules.join(";"); //Concat rules and add last semi colon
    return rules;
}

//Add a listener to override response headers which allows for injecting scripts and making xhr requests.
chrome.webRequest.onHeadersReceived.addListener(function (details){
    for (i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toUpperCase() == "CONTENT-SECURITY-POLICY") {
            var policy = details.responseHeaders[i].value;
            newRules = appendDomainsToPolicyHeaders(policy, domainsToAdd);
            details.responseHeaders[i].value = newRules;
        }
    }
    return { responseHeaders : details.responseHeaders};
    },
    {
        urls: ["<all_urls>"],
        types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
    ["blocking", "responseHeaders"]
);