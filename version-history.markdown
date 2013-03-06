Version History:
================

* 1.0 initial release
* 1.1 added a lot of Accessibility enhancements
  * rewrite to use "fn.extend" structure
  * added check for existing ids on the content containers to use to proper anchors in the tabs
* 1.1.1 changed the headline markup. thanks to Mike Davies for the hint.
* 1.5 thanks to Dirk Jesse, Ansgar Hein, David Maciejewski and Mike West for commiting patches to this release
  * new option syncheights that syncs the heights of the tab contents when the SyncHeight plugin 
*   is available http://blog.ginader.de/dev/jquery/syncheight/index.php
  * fixed the hardcoded current class
  * new option tabsListClass to be applied to the generated list of tabs above the content so lists 
*   inside the tabscontent can be styled differently
  * added clearfix and tabcounter that adds a class in the schema "tabamount{number amount of tabs}" 
*   to the ul containg the tabs so one can style the tabs to fit 100% into the width
  * new option "syncHeightMethodName" fixed issue: http://github.com/ginader/Accessible-Tabs/issues/2/find
  * new Method showAccessibleTab({index number of the tab to show starting with 0})  fixed issue: http://github.com/ginader/Accessible-Tabs/issues/3/find
  * added support for the Cursor Keys to come closer to the WAI ARIA Tab Panel Best Practices http://github.com/ginader/Accessible-Tabs/issues/1/find
* 1.6 
  * new option "saveState" to allow tabs remember their selected state using cookies requires the cookie plugin: http://plugins.jquery.com/project/Cookie
  * changed supported jquery version to 1.4.2 to make sure it's future compatible
  * new option "autoAnchor" which allows to add ID's to headlines in the tabs markup that allow direct linking into a tab i.e.: file.html#headlineID
* 1.7
  * new option "pagination" that adds links to show the next/previous tab. This adds the following markup to each tab for you to style:
 <ul class="pagination">
     <li class="previous"><a href="#{the-id-of-the-previous-tab}"><span>{the headline of the previous tab}</span></a></li>
     <li class="next"><a href="#{the-id-of-the-next-tab}"><span>{the headline of the previous tab}</span></a></li>
 </ul>
* 1.8
  * new option "position" can be 'top' or 'bottom'. Defines where the tabs list is inserted. 
* 1.8.1
  * Bugfix for broken pagination in ie6 and 7: Selector and object access modified by Daniel Köntös (www.MilkmanMedia.de). Thanks to Carolin Moll for the report.
* 1.8.2
  * Bugfix for issue described by Sunshine here: http://blog.ginader.de/archives/2009/02/07/jQuery-Accessible-Tabs-How-to-make-tabs-REALLY-accessible.php#c916
* 1.8.3
  * Bugfix by Michael Schulze: Only change current class in tab navigation and not in all unordered lists inside the tabs.
* 1.9
  * new method showAccessibleTabSelector({valid jQuery selector of the tab to show}) that allows the opening of tabs \
  * by jQuery Selector instead of the index in showAccessibleTab() fixing issue https://github.com/ginader/Accessible-Tabs/issues/15
* 1.9.1 by Michael Schulze: 
  * firstNavItemClass and lastNavItemClass to define a custom classname on the first and last tab
  * wrapInnerNavLinks: inner wrap for a-tags in tab navigation.
* 1.9.2
  * Bugfix by Dirk Jesse: fixing an issue that happened when passing multiple selectors to the init call instead of one
  * Bugfix that fixes a reset of the tabs counter when accessibleTabs() was called more than once on a page
* 1.9.3
  * Bugfix by Norm: before, when cssClassAvailable was true, all of the tabhead elements had to have classes or they wouldn't get pulled out into tabs. 
  * This commit fixes this assumption, as I only want classes on some elements https://github.com/ginader/Accessible-Tabs/pull/25
* 1.9.4 Bugfix by Patrick Bruckner to fix issue with Internet Explorer using jQuery 1.7 https://github.com/ginader/Accessible-Tabs/issues/26
* 1.9.5 new option "clearfixClass" name of the Class that is used to clear/contain floats fixes https://github.com/ginader/Accessible-Tabs/issues/28
* 1.9.6 fix for issue 34
* 1.9.7 removed Support for IE7
