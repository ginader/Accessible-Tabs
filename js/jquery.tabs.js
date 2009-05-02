/**
 * YAML Tabs - jQuery plugin for accessible, unobtrusive tabs
 * Build to seemlessly work with the CCS-Framework YAML (yaml.de) not depending on YAML though
 * @requires jQuery v1.0.3
 *
 * http://blog.ginader.de/dev/yamltabs/index.php
 *
 * Copyright (c) 2007 Dirk Ginader (ginader.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 1.1.1
 * 
 * History:
 * * 1.0 initial release
 * * 1.1 added a lot of Accessibility enhancements
 * * * rewrite to use "fn.extend" structure
 * * * added check for existing ids on the content containers to use to proper anchors in the tabs
 * * 1.1.1 changed the headline markup. thanks to Mike Davies for the hint.
 * * 1.5 thanks to Dirk Jesse, Ansgar Hein, David Maciejewski and Mike West for their input for this release
 * * * new option syncheights that syncs the heights of the tab contents when the SyncHeight plugin is available http://blog.ginader.de/dev/jquery/syncheight/index.php
 * * * fixed the hardcoded current class
 * * * new option tabsListClass to be applied to the generated list of tabs above the content so lists inside the tabscontent can be styled differently
 */

(function($) {
    
    $.fn.extend({
        getUniqueId: function(p){
            return p + new Date().getTime();
        },
        accessibleTabs: function(config) {
            var defaults = {
                wrapperClass: 'content', // Classname to apply to the div that is wrapped around the original Markup
                currentClass: 'current', // Classname to apply to the LI of the selected Tab
                tabhead: 'h4', // Tag or valid Query Selector of the Elements to Transform the Tabs-Navigation from (originals are removed)
                tabbody: '.tabbody', // Tag or valid Query Selector of the Elements to be treated as the Tab Body
                fx:'show', // can be "fadeIn", "slideDown", "show"
                fxspeed: 'normal', // speed (String|Number): "slow", "normal", or "fast") or the number of milliseconds to run the animation
                currentInfoText: 'current tab: ', // text to indicate for screenreaders which tab is the current one
                currentInfoPosition: 'prepend', // Definition where to insert the Info Text. Can be either "prepend" or "append"
                currentInfoClass: 'current-info', // Class to apply to the span wrapping the CurrentInfoText
                tabsListClass:'tabs-list', // Class to apply to the generated list of tabs above the content
                syncheights:false // syncs the heights of the tabs when the SyncHeight plugin is available http://blog.ginader.de/dev/jquery/syncheight/index.php
            };
            var options = $.extend(defaults, config);
            var o = this;
            return this.each(function() {
                var el = $(this);
                var list = '';

                var contentAnchor = o.getUniqueId('accessibletabscontent');
                var tabsAnchor = o.getUniqueId('accessibletabs');
                $(el).wrapInner('<div class="'+options.wrapperClass+'"></div>');

                $(el).find(options.tabhead).each(function(i){
                    var id = '';
                    if(i === 0){
                        id =' id="'+tabsAnchor+'"';
                    }
                    list += '<li><a'+id+' href="#'+contentAnchor+'">'+$(this).text()+'</a></li>';
                    $(this).remove();
                });

                $(el).prepend('<ul class="'+options.tabsListClass+'">'+list+'</ul>');
                $(el).find(options.tabbody).hide();
                $(el).find(options.tabbody+':first').show().before('<'+options.tabhead+'><a tabindex="0" class="accessibletabsanchor" name="'+contentAnchor+'" id="'+contentAnchor+'">'+$(el).find("ul>li:first").text()+'</a></'+options.tabhead+'>');
                $(el).find("ul>li:first").addClass(options.currentClass)
                .find('a')[options.currentInfoPosition]('<span class="'+options.currentInfoClass+'">'+options.currentInfoText+'</span>');

                if (options.syncheights && $.fn.syncHeight) {
                    $(el).find(options.tabbody).syncHeight();
                    $(window).resize(function(){ 
                        $(el).find(options.tabbody).syncHeight();
                    });
                }

                $(el).find('ul.'+options.tabsListClass+'>li>a').each(function(i){
                    $(this).click(function(event){
                        event.preventDefault();
                        $(el).find('ul>li.'+options.currentClass).removeClass(options.currentClass)
                        .find("span."+options.currentInfoClass).remove();
                        $(this).blur();
                        $(el).find(options.tabbody+':visible').hide();
                        $(el).find(options.tabbody).eq(i)[options.fx](options.fxspeed);
                        $( '#'+contentAnchor ).text( $(this).text() ).focus();
                        $(this)[options.currentInfoPosition]('<span class="'+options.currentInfoClass+'">'+options.currentInfoText+'</span>')
                        .parent().addClass(options.currentClass);
                        
                    });
                });
            });
        }
    });
})(jQuery);