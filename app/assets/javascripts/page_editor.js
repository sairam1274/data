// Globals
var generateRegion;
var saveRegion;
var createPED;
var deletePED;
var formToObject;
var objectToFormValues;
var pedList = {};
var collectionViews = {};
var populatePLTSelect;

var PED;
var PEDCollection;
var PEDView;

// Underscore Configuration
/*_.templateSettings = {
    interpolate: /\{\{\=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g
};*/

(function(){
$172(document).ready(function() {
    var $ = $172;
    var btmMessageLoggedOut = "You've been logged out, and your changes have not been saved. Sorry :-(";
	
    PED = Backbone.Model.extend({
		urlRoot: "/page_element_datas",
		name: "page_element_data",

		initialize: function() {
			this.listenTo(this, "")
		}
	});

	PEDCollection = Backbone.Collection.extend({
		model: PED,
		url: "/page_element_datas.json"
	});


	PEDView = Backbone.View.extend({
        //template : _.template("<div style='border:1px dotted black;padding: 20px;'><div id='btm-ped-<%= this.model.get('id') %>' <% if(this.model.get('widget_id') == 9) { %>class='btm-aloha'<% } %>><%= this.model.get('render_preview') %></div>(<a class='edit'>Edit</a>) (<a class='delete'>Delete</a>)</div>"),
        template : _.template($("#q-template").html()),
        initialize: function() {
            this.model.on('change',this.render,this);
        },

        events : {
        	"click .delete" : "deletePED",
        	"click .save" : "savePED",
            "click .edit" : "editPED",
            "click .cancel" : "cancelEditPED"
        },

        render : function() {
            var emp = this.model.toJSON();
            var html = this.template( emp );
            this.$el.html( html );
            this.setEditFormValues();

            pedList['' + this.model.get('id')] = this.model;
            if (this.model.get('widget_id') == 9) {
                Aloha.jQuery("#btm-ped-" + this.model.get('id') + " .btmPEDPreview").aloha();
            }

        },

        deletePED : function (event) {
			if (confirm("Are you sure you want to delete this component?")) {
				this.remove();
				this.model.destroy({data: $.param(parameters) + "&" + railsCSRF()});
			}
		},

		savePED : function (event) {
			var newValues = formToObject(this.$el.find(".btmPEDEdit form"));
			this.model.set('widget_data', $.extend(this.model.get('widget_data'), newValues));
			this.model.save("content", "", { 
	            params: parameters, 
	            wait: true,
	            success: function(model, res) {
	                console.log("Saved PED with ID " + res['page_element_data']['id']);
	            },
	            error: function() {
                    alert(btmMessageLoggedOut);
                    window.location = "/";
	                console.log("Failed to Save New PED");
	        }});
		},

        editPED : function (event) {
            this.$el.find(".btmPEDPreview, .btmPEDControls").hide();
            this.$el.find(".btmPEDEdit").show();
        },

        cancelEditPED : function (event) {
            this.$el.find(".btmPEDEdit").hide();            
            this.$el.find(".btmPEDPreview, .btmPEDControls").show();
        },

		setEditFormValues : function () {
			objectToFormValues(this.model.get('widget_data'), this.$el.find(".edit form"));
		}
    });

	// Factory Methods

	// A region is essentially a PED collection
	generateRegion = function (id) {
		var collection = new PEDCollection;

		var CollectionView =  new Backbone.CollectionView({
        	el : $( "#region-" + id ),
        	collection : collection,
        	selectable: true,
        	sortable: true,
        	modelView : PEDView
    	});

        CollectionView.sortableOptions = {cancel: ':input,button,.btm-aloha'};

		// Binding for saving the reordering of elements
    	collection.on("reorder",function(){
    		for (var i=0;i<collection.length;i++) {
    			model = collection.at(i);

    			// Only update the order if it has changed
    			if (model.get('element_order') != i) {
    				model.set('element_order', i);
    				model.save({}, { 
                    	params: parameters,
                    	success: function() {
                    		console.log("Saved order");
                    	}, 
                    	error: function() {
                            alert(btmMessageLoggedOut);
                            window.location = "/";
                    		console.log("Failed to save order");
                    	}
                   	});
    			}
    		}
    	});

		collectionViews[id] = CollectionView;

		collection.fetch({ data: $.param(parameters) + "&region=" + id, reset: true });
	}
	
	createPED = function (region, widget_id) {
	 	ped = new PED;
	 	ped.set('widget_id', widget_id);
	 	ped.set('region', region);
        ped.set('widget_data', '{}');
        ped.save("content", "", { 
            params: parameters, 
            wait: true,
            success: function(model, res) {
                ped.set("id", res['page_element_data']['id']);
                console.log("Saved PED with ID " + res['page_element_data']['id']);
            },
            error: function() {
                alert(btmMessageLoggedOut);
                window.location = "/";
                console.log("Failed to Save New PED");
        }});  

        collectionViews[region].collection.push(ped);  
	}

	formToObject = function (form) {
		var fields = {}

		$(form).find("input, textarea, select").each(function() {
			var inputType = this.tagName.toUpperCase() === "INPUT" && this.type.toUpperCase();
    		if (inputType !== "BUTTON" && inputType !== "SUBMIT") {
				fields[this.name] = $(this).val();
			}
		});
		return fields;
	}

	objectToFormValues = function (data, form) {
		$.each(data, function(name, val){
   			var $el = $(form).find('[name="'+name+'"]');
        	type = $el.attr('type');
    		switch(type){
        		case 'checkbox':
            	$el.attr('checked', true);
            	break;
        	case 'radio':
            	$el.filter('[value="'+val+'"]').attr('checked', 'checked');
            	break;
        	default:
            	$el.val(val);
    		}
		});
	}

    populatePLTSelect = function (target) {
        $.getJSON('/presentation_layer_templates.json?website_id=' + parameters['website_id'], function(data){
            var html = '';
            var len = data.length;
            
            for (var i = 0; i< len; i++) {
                var plt = data[i]["presentation_layer_template"];
                html += '<option value="' + plt['id'] + '">' + plt['title'] + '</option>';
            }
            $(target).append(html);
        });
    }

    

});
})();