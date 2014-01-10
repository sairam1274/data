
$(document).ready(function(){
    var editor = ace.edit("editor");
    var editor2 = ace.edit("editor2");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/html");
    editor2.setTheme("ace/theme/monokai");
    editor2.getSession().setMode("ace/mode/html");

    var head_content_ide = editor;
    var body_content_ide = editor2;
        
    // Monitor ACE editors for changes
    function markUnsavedChanges() {
        $.warnunsaved("trigger");
    }
    $("#editor textarea").on('input',markUnsavedChanges);
    $("#editor2 textarea").on('input',markUnsavedChanges);

    // PRESENTATION LAYER TEMPLATES

    // Stores the currently selected PLT
    var selectedPLT;

    // PLT Model
    var PLT = Backbone.Model.extend({
        name: 'presentation_layer_template',
        urlRoot: '/presentation_layer_templates',
        idAttribute: 'id'
    });

    // PLT View for a single instance
    var PLTView = Backbone.View.extend({
        template : _.template( "<a><%= this.model.get('title') %></a>"), // TIP: This can be loaded from a <script> tag with an id
        initialize: function() {
            this.model.on('change',this.render,this);
        },
        render : function() {
            var emp = this.model.toJSON();
            var html = this.template( emp );
            this.$el.html( html );
        }

    });

    // PLT Collection and Instance of collection
    var PLTCollection = Backbone.Collection.extend({
        url: '/presentation_layer_templates.json',
        model: PLT
    });
    var globalCollection = new PLTCollection;
    var templateCollection = new PLTCollection;
    var widgetCollection = new PLTCollection;


    // PLT View for each Collection
    var GlobalCollectionView =  new Backbone.CollectionView({
        el : $( "#GlobalList" ),
        selectable : true,
        collection : globalCollection,
        modelView : PLTView
    });

    var TemplateCollectionView =  new Backbone.CollectionView({
        el : $( "#TemplateList" ),
        selectable : true,
        collection : templateCollection,
        modelView : PLTView
    });

    var WidgetCollectionView =  new Backbone.CollectionView({
        el : $( "#WidgetList" ),
        selectable : true,
        collection : widgetCollection,
        modelView : PLTView
    });

    // Routing Table for Dev Center
    var Router = Backbone.Router.extend({
        routes: {
            "" : "list_plts",
        },

        // Index
        list_plts : function() {
            globalCollection.fetch({ data: $.param(parameters) + "&kind=global", reset: true });
            templateCollection.fetch({ data: $.param(parameters) + "&kind=template", reset: true });
            widgetCollection.fetch({ data: $.param(parameters) + "&kind=widget", reset: true });
        }
    });

    function welcomeHide() {
        $('#devcenter-welcome').css({"display":"none"});
        $('.editorExpandButton').css({"display":"block"});
    }
    function welcomeShow() {
        $('#devcenter-welcome').css({"display":"block"});
    }
    function timeUpdate() {
        $('#plt-date').html("Last updated <time class='timeago' datetime='"+selectedPLT.get("updated_at_human_readable")+"'></time>.");
        $(".timeago").timeago();
    }
    function nameSet() {
        $('#plt-name h4').text(selectedPLT.get("title"));

    }
    // Fill textVal with title until changed
    //var textVal = $('#plt-name h4').text(selectedPLT.get("title"));

    // Select PLTS

    GlobalCollectionView.on("selectionChanged", function() {
        
        if (!$.warnunsaved("confirm")) {
            this.setSelectedModel("fakeid", {by: "cid", silent: true});
            return false;
        }
        $.warnunsaved("reset");

        // Get the selected PLT
        selectedPLT = this.getSelectedModel();

        // Sets the other collection selects to a fake model so the event will fire when
        // switching back
        TemplateCollectionView.setSelectedModel("fakeid", {by: "cid", silent: true});
        WidgetCollectionView.setSelectedModel("fakeid", {by: "cid", silent: true});
       
        // Populate the IDE(s)
        head_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_head_content"));
        body_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_body_content"));

        // Update the Name and Date
        welcomeHide();
        timeUpdate();
        nameSet();
    });

    TemplateCollectionView.on("selectionChanged", function() {

        if (!$.warnunsaved("confirm")) {
            this.setSelectedModel("fakeid", {by: "cid", silent: true});
            return false;
        } 
        $.warnunsaved("reset");

        // Get the selected PLT
        selectedPLT = this.getSelectedModel();

        // Sets the other collection selects to a fake model so the event will fire when
        // switching back
        GlobalCollectionView.setSelectedModel("fakeid", {by: "cid", silent: true});
        WidgetCollectionView.setSelectedModel("fakeid", {by: "cid", silent: true});

        // Populate the IDE(s)
        head_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_head_content"));
        body_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_body_content"));

        // Update the Name and Date
        welcomeHide();
        timeUpdate();
        nameSet();
    });

    WidgetCollectionView.on("selectionChanged", function() {

        if (!$.warnunsaved("confirm")) {
            this.setSelectedModel("fakeid", {by: "cid", silent: true});
            return false;
        }
        $.warnunsaved("reset");

        // Get the selected PLT
        selectedPLT = this.getSelectedModel();

        // Sets the other collection selects to a fake model so the event will fire when
        // switching back
        TemplateCollectionView.setSelectedModel("fakeid", {by: "cid", silent: true});
        GlobalCollectionView.setSelectedModel("fakeid", {by: "cid", silent: true});

        // Populate the IDE(s)
        head_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_head_content"));
        body_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_body_content"));

        // Update the Name and Date
        welcomeHide();
        timeUpdate();
        nameSet();
    });

        var saveButtonClick = false;
        // Save  PLTs
    $("#saveButton").on("click", function() {

        $.warnunsaved("reset");

        saveButtonClick = true;


            var saveTextVal = document.getElementById("plt-name-edit");
            if (saveTextVal.value.length >= 1){
                $('#plt-name h4').text(saveTextVal.value);
            }
            selectedPLT.set("title", $('#plt-name h4').text());
            

        // Get the content from the IDE
        head_content = head_content_ide.getSession().getDocument().getValue();
        body_content = body_content_ide.getSession().getDocument().getValue();


        var now = new Date(); 
        var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        // Update the PLT and PUT it on the server
        selectedPLT.set("default_head_content", head_content);
        selectedPLT.set("default_body_content", body_content);
        selectedPLT.set("updated_at_human_readable", (new Date()).toISOString());
        timeUpdate();
        selectedPLT.save({}, { 
            params: parameters,
            //data: $.param(parameters), 
            success: function() {
                // Add growler notification
                var unique_id = $.gritter.add({
                // (string | mandatory) the heading of the notification
                title: 'Changes Saved',
                // (string | mandatory) the text inside the notification
                text: 'All your changes have been saved.',
                // (string | optional) the image to display on the left
                image: '/images/logo.svg',
                // (int | optional) the time you want it to be alive for before fading out
                time: '3000',
                // (string | optional) the class name you want to apply to that specific message
                class_name: 'btm-save-growl',
                // sticky
                sticky: false
                });

                // Mark changes as saved
                $.warnunsaved("reset");          
            },
            error: function() {
                alert("Whoops! It appears something went wrong. Be careful, changes were not saved!");
            }
        });
        
    });

    // Cancel PLT changes
    $('#cancelButton').on('click', function(event){
        //Ask to confirm
        var userChoice;
        var conf = confirm("Are you sure you want to discard your changes?");           

        if (conf == true){
            //Set userChoice to string "Changes Discarded" for alerting user
            userChoice = "Changes discarded";
            // Populate the IDE(s)
            head_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_head_content"));
            body_content_ide.getSession().getDocument().setValue(selectedPLT.get("default_body_content"));
            // Add growler notification
            var unique_id = $.gritter.add({
            // (string | mandatory) the heading of the notification
            title: userChoice,
            // (string | mandatory) the text inside the notification
            text: 'All changes have been discarded.',
            // (string | optional) the image to display on the left
            image: '/images/logo.svg',
            // (int | optional) the time you want it to be alive for before fading out
            time: '3000',
            // (string | optional) the class name you want to apply to that specific message
            class_name: 'btm-cancel-growl',
            // sticky
            sticky: false
            });           
        }
        return false;
    });

    // Rename PLTs
        var inputEL = $('#plt-name-edit');
        var nameEL = $('#plt-name h4');

    

    $("#plt-name-edit").on("blur", function() {
        $('#plt-name-edit-button').addClass('icon-pencil');
        inputEL.hide();
        nameEL.show();
            
                if (saveButtonClick == true || keyEnter==13){

                    keyEnter=0;
                    saveButtonClick=false;

                    selectedPLT.set("title", $('#plt-name h4').text());
                    selectedPLT.save({}, { 
                    params: parameters,
                        success: function() {
                            // Add growler notification
                            var unique_id = $.gritter.add({
                                // (string | mandatory) the heading of the notification
                                title: 'Name Saved',
                                // (string | mandatory) the text inside the notification
                                text: 'Name changed to '+$('#plt-name h4').text(),
                                // (string | optional) the image to display on the left
                                image: '/images/logo.svg',
                                // (int | optional) the time you want it to be alive for before fading out
                                time: '3000',
                                // (string | optional) the class name you want to apply to that specific message
                                class_name: 'btm-save-growl',
                                // sticky
                                sticky: false,
                                // (function) before the gritter notice is opened
                                before_open: function(){
                                    if($('.gritter-item-wrapper').length == 1){
                                        // Returning false prevents a new gritter from opening
                                        return false;
                                    }
                                }   
                            }); 
                        },
                        error: function() {
                            alert("Whoops! It appears something went wrong. Be careful, changes were not saved!");
                        }
                    });
                    return false;
                }      
    });

    $('#plt-name-edit-button').on("click", function(){
        if (inputEL.is(':hidden')&&nameEL.is(':visible')){
            inputEL.show();
            nameEL.hide();
            inputEL.val(selectedPLT.get('title'));
            $(this).removeClass('icon-pencil');
            inputEL.focus();
        }
    });


    // Create New PLTS

    function createNewPLT(collectionView, kind) {
        plt = new PLT;
        plt.set("title", "New Template");
        plt.set("kind", kind);
        plt.set("updated_at_human_readable", "less than a second");
        console.log("TEST");
        plt.save("title", "New Template", { 
            params: parameters, 
            wait: true,
            success: function(model, res) {
                plt.set("id", res['id']);
            },
            error: function() {
                console.log("Failed to Save New Template");
        }});  
        collectionView.collection.push(plt);    
    }

    $("#newPLTGlobal").on("click", function() {
        createNewPLT(GlobalCollectionView, "global");
    });

    $("#newPLTTemplate").on("click", function() {
        createNewPLT(TemplateCollectionView, "template");
    });

    $("#newPLTWidget").on("click", function() {
        createNewPLT(WidgetCollectionView, "widget");
    });

    // Delete Template
    $("#plt-templateDeleteButton").click(function() {
        if (confirm("Are you sure you want to delete this template?")) {
            $('#devcenter-welcome').css({"display":"block"});
            $('.editorExpandButton').css({"display":"none"});

            selectedPLT.destroy({data: $.param(parameters) + "&" + railsCSRF()});

        }
    });

    // Start the router and history
    var router = new Router;
    Backbone.history.start();

    // Expand and Collapse the Editor Windows



    function editorButtonClassToggle(classObj){
        var folderClass = classObj.find('span');
        var className = folderClass.attr('class');

        // Remove the existing classes
        folderClass.removeClass('icon-expand icon-contract');
        
        // Check to see what the state was, and do the opposite
        if (className == "icon-expand"){
            folderClass.addClass('icon-contract');
        }else{
            folderClass.addClass('icon-expand');
        }
    };

    function editorFullScreen(classObj){
        $("#container-wrapper").toggleClass("fullscreen")
        $(".scrollpane-ide").toggleClass("fullscreen")
        $(".editorContainer").toggleClass("fullscreen")
        classObj.closest(".editorWrapper").toggleClass("fullwidth");
    };



    $("#editorExpand1").on('click', function(){
        editorButtonClassToggle($(this));
        editorFullScreen($(this));
        $("#editorWrapper2").toggleClass("hidden");
        editor.resize();
    });

    $("#editorExpand2").on('click', function(){
        editorButtonClassToggle($(this));
        editorFullScreen($(this));
        $("#editorWrapper1").toggleClass("hidden");
        editor2.resize();
    })


});