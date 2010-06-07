/**
 * Accessible Tabs - jQuery plugin for accessible, unobtrusive tabs
 * Build to seemlessly work with the CCS-Framework YAML (yaml.de) not depending on YAML though
 * @requires jQuery - tested with 1.4.2 but might as well work with older versions
 *
 * english article: http://blog.ginader.de/archives/2009/02/07/jQuery-Accessible-Tabs-How-to-make-tabs-REALLY-accessible.php
 * german article: http://blog.ginader.de/archives/2009/02/07/jQuery-Accessible-Tabs-Wie-man-Tabs-WIRKLICH-zugaenglich-macht.php
 * 
 * code: http://github.com/ginader/Accessible-Tabs
 * please report issues at: http://github.com/ginader/Accessible-Tabs/issues
 *
 * Copyright (c) 2007 Dirk Ginader (ginader.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 1.7
 * 
 * History:
 * * 1.0 initial release
 * * 1.1 added a lot of Accessibility enhancements
 * * * rewrite to use "fn.extend" structure
 * * * added check for existing ids on the content containers to use to proper anchors in the tabs
 * * 1.1.1 changed the headline markup. thanks to Mike Davies for the hint.
 * * 1.5 thanks to Dirk Jesse, Ansgar Hein, David Maciejewski and Mike West for commiting patches to this release
 * * * new option syncheights that syncs the heights of the tab contents when the SyncHeight plugin 
 * *   is available http://blog.ginader.de/dev/jquery/syncheight/index.php
 * * * fixed the hardcoded current class
 * * * new option tabsListClass to be applied to the generated list of tabs above the content so lists 
 * *   inside the tabscontent can be styled differently
 * * * added clearfix and tabcounter that adds a class in the schema "tabamount{number amount of tabs}" 
 * *   to the ul containg the tabs so one can style the tabs to fit 100% into the width
 * * * new option "syncHeightMethodName" fixed issue: http://github.com/ginader/Accessible-Tabs/issues/2/find
 * * * new Method showAccessibleTab({index number of the tab to show starting with 0})  fixed issue: http://github.com/ginader/Accessible-Tabs/issues/3/find
 * * * added support for the Cursor Keys to come closer to the WAI ARIA Tab Panel Best Practices http://github.com/ginader/Accessible-Tabs/issues/1/find
 * * 1.6 
 * * * new option "saveState" to allow tabs remember their selected state using cookies requires the cookie plugin: http://plugins.jquery.com/project/Cookie
 * * * changed supported jquery version to 1.4.2 to make sure it's future compatible
 * * * new option "autoAnchor" which allows to add ID's to headlines in the tabs markup that allow direct linking into a tab i.e.: file.html#headlineID
 * * 1.7
 * * * new option "pagination" that adds links to show the next/previous tab. This adds the following markup to each tab for you to style:
 <ul class="pagination">
     <li class="previous"><a href="#{the-id-of-the-previous-tab}"><span>{the headline of the previous tab}</span></a></li>
     <li class="next"><a href="#{the-id-of-the-next-tab}"><span>{the headline of the previous tab}</span></a></li>
 </ul>
 
 */


(function($) {
    var debugMode = false;
    $.fn.extend({
        // We assume there could be multiple sets of tabs on a page, so,
        // the unique id for each invididual tab's heading is identified with params q and r (e.g., id="accessibletabscontent0-2")
        getUniqueId: function(p, q, r){
            if (r===undefined) {r='';} else {r='-'+r;}
            return p + q + r;
        },
        accessibleTabs: function(config) {
            var defaults = {
                wrapperClass: 'content', // Classname to apply to the div that is wrapped around the original Markup
                currentClass: 'current', // Classname to apply to the LI of the selected Tab
                tabhead: 'h4', // Tag or valid Query Selector of the Elements to Transform the Tabs-Navigation from (originals are removed)
                tabheadClass: 'tabhead', // Classname to apply to the target heading element for each tab div
                tabbody: '.tabbody', // Tag or valid Query Selector of the Elements to be treated as the Tab Body
                fx:'show', // can be "fadeIn", "slideDown", "show"
                fxspeed: 'normal', // speed (String|Number): "slow", "normal", or "fast") or the number of milliseconds to run the animation
                currentInfoText: 'current tab: ', // text to indicate for screenreaders which tab is the current one
                currentInfoPosition: 'prepend', // Definition where to insert the Info Text. Can be either "prepend" or "append"
                currentInfoClass: 'current-info', // Class to apply to the span wrapping the CurrentInfoText
                tabsListClass:'tabs-list', // Class to apply to the generated list of tabs above the content
                syncheights:false, // syncs the heights of the tab contents when the SyncHeight plugin is available http://blog.ginader.de/dev/jquery/syncheight/index.php
                syncHeightMethodName:'syncHeight', // set the Method name of the plugin you want to use to sync the tab contents. Defaults to the SyncHeight plugin: http://github.com/ginader/syncHeight
                cssClassAvailable:false, // Enable individual css classes for tabs. Gets the appropriate class name of a tabhead element and apply it to the tab list element. Boolean value
                saveState:false, // save the selected tab into a cookie so it stays selected after a reload. This requires that the wrapping div needs to have an ID (so we know which tab we're saving)
                autoAnchor:false, // will move over any existing id of a headline in tabs markup so it can be linked to it
                pagination:false // adds buttons to each tab to swtich to the next/previous tab
            };
            var keyCodes = {
                37 : -1, //LEFT
                38 : -1, //UP
                39 : +1, //RIGHT 
                40 : +1 //DOWN
            };
            this.options = $.extend(defaults, config);
            var o = this;
            return this.each(function(t) {
                var el = $(this);
                var list = '';
                var tabCount = 0;
                ids = [];

                $(el).wrapInner('<div class="'+o.options.wrapperClass+'"></div>');

                $(el).find(o.options.tabhead).each(function(i){
                    var id = '';
                    elId = $(this).attr('id');
                    if(elId){
                        id =' id="'+elId+'"';
                    }
                    var tabId = o.getUniqueId('accessibletabscontent', t, i);//get a unique id to assign to this tab's heading
                    ids.push(tabId);
                    $(this).attr({"id": tabId, "class": o.options.tabheadClass, "tabindex": "-1"});//assign the unique id and the tabheadClass class name to this tab's heading
                    if(o.options.cssClassAvailable === true) {
                        var cssClass = '';
                        if($(el).attr('class')) {
                            cssClass = $(this).attr('class');
                            cssClass = ' class="'+cssClass+'"';
                            list += '<li><a'+id+''+cssClass+' href="#'+tabId+'">'+$(this).html()+'</a></li>';
                        }
                    } else {
                        list += '<li><a'+id+' href="#'+tabId+'">'+$(this).html()+'</a></li>';
                    }
                    tabCount++;
                });

                $(el).prepend('<ul class="clearfix '+o.options.tabsListClass+' tabamount'+tabCount+'">'+list+'</ul>');
                $(el).find(o.options.tabbody).hide();
                $(el).find(o.options.tabbody+':first').show();
                $(el).find("ul>li:first").addClass(o.options.currentClass)
                .find('a')[o.options.currentInfoPosition]('<span class="'+o.options.currentInfoClass+'">'+o.options.currentInfoText+'</span>');

                if (o.options.syncheights && $.fn[o.options.syncHeightMethodName]) {
                    $(el).find(o.options.tabbody)[o.options.syncHeightMethodName]();
                    $(window).resize(function(){ 
                        $(el).find(o.options.tabbody)[o.options.syncHeightMethodName]();
                    });
                }

                $(el).find('ul.'+o.options.tabsListClass+'>li>a').each(function(i){
                    $(this).click(function(event){
                        event.preventDefault();
                        if(o.options.saveState && $.cookie){
                            $.cookie('accessibletab_'+el.attr('id')+'_active',i);
                        }
                        $(el).find('ul>li.'+o.options.currentClass).removeClass(o.options.currentClass)
                        .find("span."+o.options.currentInfoClass).remove();
                        $(this).blur();
                        $(el).find(o.options.tabbody+':visible').hide();
                        $(el).find(o.options.tabbody).eq(i)[o.options.fx](o.options.fxspeed);
                        $(this)[o.options.currentInfoPosition]('<span class="'+o.options.currentInfoClass+'">'+o.options.currentInfoText+'</span>')
                        .parent().addClass(o.options.currentClass);
                        //now, only after writing the currentInfoText span to the tab list link, set focus to the tab's heading
                        $($(this).attr("href")).focus().keyup(function(event){
                            if(keyCodes[event.keyCode]){
                                o.showAccessibleTab(i+keyCodes[event.keyCode]);
                                $(this).unbind( "keyup" );
                            }
                        });

                        // $(el).find('.accessibletabsanchor').keyup(function(event){
                        //     if(keyCodes[event.keyCode]){
                        //         o.showAccessibleTab(i+keyCodes[event.keyCode]);
                        //     }
                        // });
                        
                        
                    });

                    $(this).focus(function(event){
                        $(document).keyup(function(event){
                            if(keyCodes[event.keyCode]){
                                o.showAccessibleTab(i+keyCodes[event.keyCode]);
                            }
                        });
                    });
                    $(this).blur(function(event){
                        $(document).unbind( "keyup" );
                    });
                
                    
                });

                if(o.options.saveState && $.cookie){
                    var savedState = $.cookie('accessibletab_'+el.attr('id')+'_active');
                    debug($.cookie('accessibletab_'+el.attr('id')+'_active'));
                    if(savedState != null){
                        o.showAccessibleTab(savedState,el.attr('id'));
                    }
                };
                
                if(o.options.autoAnchor && window.location.hash){
                    var anchorTab = $('.'+o.options.tabsListClass).find(window.location.hash);
                    if(anchorTab.size()){
                        anchorTab.click();
                    }
                };
                
                if(o.options.pagination){
                    var m = '<ul class="pagination">';
                    m +='    <li class="previous"><a href="#{previousAnchor}"><span>{previousHeadline}</span></a></li>';
                    m +='    <li class="next"><a href="#{nextAnchor}"><span>{nextHeadline}</span></a></li>';
                    m +='</ul>';
                    var tabs = $(el).find('.tabbody');
                    var tabcount = tabs.size();
                    tabs.each(function(idx){
                        $(this).append(m);
                        var next = idx+1;
                        if(next>=tabcount){next = 0;}
                        var previous = idx-1;
                        if(previous<0){previous = tabcount-1;}
                        var p = $(this).find('.pagination');
                        var previousEl = p.find('.previous');
                        previousEl.find('span').text($('#'+ids[previous]).text());
                        previousEl.find('a').attr('href','#'+ids[previous])
                        .click(function(event){
                            event.preventDefault();
                            $(el).find('.tabs-list a[href|=#'+ids[previous]+']').click();
                        });
                        var nextEl = p.find('.next');
                        nextEl.find('span').text($('#'+ids[next]).text());
                        nextEl.find('a').attr('href','#'+ids[next])
                        .click(function(event){
                            event.preventDefault();
                            $(el).find('.tabs-list a[href|=#'+ids[next]+']').click();
                        });
                    });
                }
            });
        },
        showAccessibleTab: function(index,id){
            debug('showAccessibleTab');
            var o = this;
            if(id){
                var el = $('#'+id);
                var links = el.find('ul.'+o.options.tabsListClass+'>li>a');
                links.eq(index).click();
            }else{
                return this.each(function() {
                    var el = $(this);
                    var links = el.find('ul.'+o.options.tabsListClass+'>li>a');
                    links.eq(index).click();
                });
            }
        }
    });
    // private Methods
    function debug(msg,info){
        if(debugMode && window.console && window.console.log){
            if(info){
                window.console.log(info+': ',msg);
            }else{
                window.console.log(msg);
            }
        }
    }
})(jQuery);
