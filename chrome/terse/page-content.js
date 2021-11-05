const rGoodContent = /article|body|content|entry|hentry|main|page|post|text|blog|story|column/i;
const rBadContent  = /combx|comment|contact|reference|foot|footer|footnote|infobox|masthead|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|tags|tool|widget|community|disqus|extra|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|pagination|pager|popup|tweet|twitter/i;
const rTrimSpace = /^\s+|\s+$/g;
const textStopSelector = '[role]:not([role=main]),li > a:only-child,.caption,.copyright,.mw-jump-link,.noprint,.metadata,.infobox,.navigation-not-searchable,.reference-text,.references,frame,iframe,label,dialog,menu,dl,dt,sup,code,pre,link,style,object,h1,h2,h3,h4,h5,h6,script,cite,embed,combx,comment,contact,foot,footer,footnote,masthead,media,meta,outbrain,promo,related,scroll,shoutbox,sidebar,sponsor,shopping,tags,tool,widget,community,disqus,extra,header,menu,remark,rss,shoutbox,sidebar,sponsor,pager,popup';
const rReduceSpace = /\s{2,}/g;

class TerseContentScraper {
    getContent(element) {
		for (var el of element.querySelectorAll(textStopSelector))
			el.parentNode.removeChild(el);
		
        var allElements = element.querySelectorAll('p,td,pre,span,div');
		var nodes = [];
        for (var i=0, node=null; (node = allElements[i]); i++) {
            var str = node.className + node.id;
			var innerText = this.getText(node);
			
			if (!node.parentNode || innerText.length < 25)
				continue;
			if (str.search(rBadContent) != -1 && str.search(rGoodContent) == -1)
				continue;
			
			var grandParentNode = node.parentNode.parentNode;
			[node.parentNode, node.parentNode.parentNode].forEach(n => {
				if (n && n.score == null) {
					this.scoreElement(n);
					nodes.push(n);
				}
			});

            var contentScore = 1;
            contentScore += innerText.split(',').length;
            contentScore += Math.min(Math.floor(innerText.length/100), 3);
            contentScore += 1 - this.getTagConsumption(node, 'a');
			node.parentNode.contentScore += contentScore;
            if (grandParentNode)
                grandParentNode.contentScore += contentScore/2;
        }
		
		var selection = nodes.sort((a,b) => b.contentScore-a.contentScore)[0];
		if (!selection)
			return '';
		
		this.removeCaptions(selection, 'form','table','ul','div');
        return selection.innerText;
    }
    
    getText(e) {
        return e.innerText.replace(rTrimSpace, '').replace(rReduceSpace, ' ');
    }
	
    scoreElement(e) {
		e.score = 0;
		[e.className, e.id, e.tagName].forEach(s => {
			if (s.search(rBadContent) !== -1)
				e.score -= 25;
			if (s.search(rGoodContent) !== -1)
				e.score += 25;
		});
		if (['DIV'].includes(e.tagName))
			e.score += 5;
		else if (['PRE','TD','BLOCKQUOTE'].includes(e.tagName))
			e.score += 3;
		else if (['ADDRESS','OL','UL','DL','DD','DT','LI','FORM'].includes(e.tagName))
			e.score -= 3;
		else if (['H1','H2','H3','H4','H5','H6','TH'].includes(e.tagName))
			e.score -= 5;
    }
	
	getTagConsumption(e, tag) {
		return [...e.querySelectorAll(tag)].reduce((a,v) => a + this.getText(v).length, 0) / this.getText(e).length;
	}
	
    removeCaptions(e, ...tags) {
        var nodes = e.querySelectorAll(tags.join(','));

        for (var i=nodes.length-1; i >= 0; i-=1) {
			var item = nodes[i];
			var text = this.getText(item);
			if (item.contentScore && item.contentScore < 0) {
                item.parentNode.removeChild(item);
			}
			else if (text.split(',').length-1 < 10) {
                var p      = item.getElementsByTagName("p").length;
                var img    = item.getElementsByTagName("img").length;
                var li     = item.getElementsByTagName("li").length-100;
                var input  = item.getElementsByTagName("input").length;
				var embed  = item.getElementsByTagName("embed").length;

                if (img > p || li > p && !['ul','ol'].includes(item.tagName)) {
                    item.parentNode.removeChild(item);
                } else if(input > Math.floor(p/3) ) {
                    item.parentNode.removeChild(item);
                } else if(text.length < 25 && (img === 0 || img > 2)) {
                    item.parentNode.removeChild(item);
                } else if(embed == 1 && text.length < 75 || embed > 1) {
                    item.parentNode.removeChild(item);
                }
            }
        }
    }
}