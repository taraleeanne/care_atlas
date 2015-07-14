;(function($,$n2){

if( typeof(window.nunaliit_custom) === 'undefined' ) window.nunaliit_custom = {};

var DH = 'care_atlas';

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var CareAtlasFilter = $n2.Class({
	
	elemId: null,
	
	changeCallback: null,
	
	selectedFilterKeys: null,
	
	initialize: function(elem, changeCallback){
		var $elem = $(elem);
		this.elemId = $elem.attr('id');
		if( !this.elemId ){
			this.elemId = $n2.getUniqueId();
			$elem.attr('id',this.elemId);
		};
		
		this.changeCallback = changeCallback;
		
		this.selectedFilterKeys = [];
	},
	
	display: function(infos, displayService){
		var _this = this;
		
		var $elem = this._getElem();
		$elem.empty();
		
		if( displayService 
		 && displayService.currentDetails 
		 && displayService.currentDetails.docId ){
			// Showing only one document. No filtering
			this.selectedFilterKeys = [];
			return;
		};
		
		var filterKeys = {};
		if( infos ){
			for(var i=0,e=infos.length; i<e; ++i){
				var info = infos[i];
				if( info.filterKeys ){
					for(var detName in info.filterKeys){
						if( info.filterKeys[detName] ){
							filterKeys[detName] = true;
						};
					};
				};
			};
		};
		
		var filterKeyNames = [];
		for(var detName in filterKeys){
			filterKeyNames.push(detName);
		};
		filterKeyNames.sort();
		
		var clickFn = function(){
			var $a = $(this);
			
			var detName = $a.attr('n2DetName');
			detName = detName ? detName : null;
			
			_this._filterKeySelected(detName);
			
			return false;
		};
		
		// Adjusted currently selected
		var newSelections = [];
		for(var i=0,e=this.selectedFilterKeys.length; i<e; ++i){
			var detName = this.selectedFilterKeys[i];
			
			if( filterKeys[detName] ){
				newSelections.push(detName);
			};
		};
		this.selectedFilterKeys = newSelections;

		// All button
		$('<a>')
			.attr('href','#')
			.text( _loc('All') )
			.addClass('n2DisplayTiled_filter')
			.addClass('n2DisplayTiled_filter_all')
			.appendTo($elem)
			.click(function(){
				_this._filterKeySelected(null);
				
				return false;
			});
		
		for(var i=0,e=filterKeyNames.length; i<e; ++i){
			var detName = filterKeyNames[i];
			
			var label = _loc('care_filterKey_' + detName);

			$('<a>')
				.attr('href','#')
				.attr('n2DetName',detName)
				.text( label )
				.addClass('n2DisplayTiled_filter')
				.addClass('n2DisplayTiled_filter_name_'+$n2.utils.stringToHtmlId(detName))
				.appendTo($elem)
				.click(clickFn);
		};
		
		this._adjustSelection();
	},
	
	filter: function(infos, displayService){
		if( this.selectedFilterKeys.length ){
			var filteredInfos = [];
			
			for(var i=0,e=infos.length; i<e; ++i){
				var info = infos[i];
				
				var show = true;
				for(var j=0,k=this.selectedFilterKeys.length; j<k; ++j){
					if( info.filterKeys 
					 && info.filterKeys[this.selectedFilterKeys[j]] ) {
						// so far, keep it
					} else {
						// reject
						show = false;
					};
				};
				
				if( show ){
					filteredInfos.push(info);
				};
			};
			
			return filteredInfos;
			
		} else {
			// Return all
			return infos;
		};
	},
	
	_getElem: function(){
		return $('#'+this.elemId);
	},
	
	_adjustSelection: function(){
		var $elem = this._getElem();
		
		$elem.find('.n2DisplayTiled_filter_selected')
			.removeClass('n2DisplayTiled_filter_selected');
		
		for(var i=0,e=this.selectedFilterKeys.length; i<e; ++i){
			var detName = this.selectedFilterKeys[i];
			$elem.find('.n2DisplayTiled_filter_name_'+$n2.utils.stringToHtmlId(detName))
				.addClass('n2DisplayTiled_filter_selected');
		};
		
		if( this.selectedFilterKeys.length < 1 ){
			$elem.find('.n2DisplayTiled_filter_all').addClass('n2DisplayTiled_filter_selected');
		};
	},
	
	_filterKeySelected: function(detName){
		if( !detName ){
			// Select all
			this.selectedFilterKeys = [];
			
		} else {
			var i = this.selectedFilterKeys.indexOf(detName);
			
			if( i < 0 ){
				this.selectedFilterKeys.push(detName);
			} else {
				this.selectedFilterKeys.splice(i,1);
			};
		};

		this._adjustSelection();
		this.changeCallback();
	}
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var CareAtlasFilterFactory = $n2.Class({
	
	initialize: function(opts_){
		var opts = $n2.extend({
		},opts_);
	},

	get: function(elem, changeCallback){
		return new CareAtlasFilter(elem, changeCallback);
	}
});


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// This is the a custom function that can be installed and give opportunity
// for an atlas to configure certain components before modules are displayed
window.nunaliit_custom.configuration = function(config, callback){
	
	config.directory.showService.options.preprocessDocument = function(doc) {
		
		return doc;
	};

	var moduleName = $n2.url.getParamValue('module',null);
	
	// Custom service
	if( config.directory.customService ){
		var customService = config.directory.customService;

		// Default table of content
		customService.setOption('defaultNavigationIdentifier','navigation.demo');
		customService.setOption('displayFormat','tiled');	
		// Default module
		customService.setOption('defaultModuleIdentifier','module.demo');
		//Document Pic	
		customService.setOption('editorEnableAddFile',true);
		
		customService.setOption('mapClusterClickCallback',nunaliit2.mapAndControls.MultiSelectClusterClickCallback);

		// Custom Filter Header for tiled display
		if( moduleName === 'module.program' ){
			customService.setOption('displayDocumentInfoFunction',function(opts){
				config.siteDesign.queryView({
					viewName: 'info'
					,keys: opts.docIds
					,onSuccess: function(rows){
						var infos = [];
						for(var i=0,e=rows.length;i<e;++i){
							infos.push(rows[i].value);
						};
						opts.onSuccess(infos);
					}
					,onError: opts.onError
				});
			});
			var filterFactory = new CareAtlasFilterFactory();
			customService.setOption('displayFilterFactory',filterFactory);
		};
		
		// Sort function for tiled display
		customService.setOption('displaySortFunction',function(infos){
			infos.sort(function(a,b){
				if( a.schema && b.schema && a.schema !== b.schema ){
					// Comments at the bottom
					if( a.schema === 'comment' ) return 1;
					if( b.schema === 'comment' ) return -1;

					// demo_media next to the bottom
					if( a.schema === 'demo_media' ) return 1;
					if( b.schema === 'demo_media' ) return -1;
				};
				
				if( a.updatedTime && b.updatedTime ){
					if( a.updatedTime > b.updatedTime ){
						return -1;
					};
					if( a.updatedTime < b.updatedTime ){
						return 1;
					};
				};

				if( a.id > b.id ){
					return -1;
				};
				if( a.id < b.id ){
					return 1;
				};
				
				return 0;
			});
		});
	};
	
	// Dispatch service
	if( config.directory.dispatchService ){
		var dispatchService = config.directory.dispatchService;
		
		// Handler called when atlas starts
		dispatchService.register('demo','start',function(m){
		});
		
		// Handler called when the module content is loaded
		dispatchService.register('demo','loadedModuleContent',function(m){
		});
	};
	
	callback();
};

})(jQuery,nunaliit2);
