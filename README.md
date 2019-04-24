# LRSwitchboard
Code Repository for the Language Resources Switchboard of CLARIN.

The implementation is based upon reactjs and related packages. It contains a standalone upload site,
where users can drag&drop their language resource(s). Each resource can be associated with a
mimetype (detected during file drop) or edited by the user thereafter, and a language code (iso
639-3). The demo upload site depicts each language resource with all relevant information, the user
can then ask the switchboard to display all tools capable of processing the resource in question.
Clicking on a tool icon opens the tool in a new tab. All relevant information (link to the
resource, language code, mimetype etc.) is encoded in the URL used to invoke the tool.

For more information, please see the publications below, or contact claus.zinn@uni-tuebingen.de 

# Website

The production version of the switchboard, its official site, is served at:

```https://switchboard.clarin.eu ```

The development version of the switchboard is currently being served at:

```https://weblicht.sfs.uni-tuebingen.de/clrs-dev/#/ ```

# Dependencies

- The switchboard depends on its back-end, see

```https://github.com/clarin-eric/LRSwitchboard-rest.git ```

For more details, follow the instruction in this back-end repository.

- The switchboard depends on a file storage solution, which is based on an off-the-shelves Nextclound container.
It runs here:

```https://weblicht.sfs.uni-tuebingen.de/nextcloud ```

By default, the switchboard front-end communicates with the productive versions of the back-end and the nextcloud container.

# Status
The software is currently being developed and actively maintained. A v1.0.0 release was published on Aug 11, 2017.

# Publications

- The Switchboard specification (Milestone 2.2 of the CLARIN-PLUS project), see https://office.clarin.eu/v/CE-2015-0684-LR_switchboard_spec.pdf

- Claus Zinn. The CLARIN Language Resource Switchboard. CLARIN 2016 Annual Conference, Aix-en-Provence, France, 2016.
See https://www.clarin.eu/sites/default/files/zinn-CLARIN2016_paper_26.pdf

- Claus Zinn: A Bridge from EUDAT's B2DROP Cloud Service to CLARIN's Language Resource Switchboard, Proceedings of the CLARIN Annual Conference, Budapest, Hungary, 2017. See below for an extended version.

- Claus Zinn. <a href="http://www.ep.liu.se/ecp/147/004/ecp17147004.pdf"> A Bridge from EUDAT's B2DROP cloud service to CLARIN's Language Resource Switchboard.</a> Selected papers from the CLARIN Annual Conference 2017, Budapest, 18-20 September 2017, Linköping University Electronic Press, vol. 147, pages 36-45, 2018.

- Claus Zinn, <a href="https://www.mitpressjournals.org/doi/pdf/10.1162/coli_a_00329"> The Language Resource Switchboard. </a> Computational Linguistics 44(4), pages 631-639, December 2018. 







