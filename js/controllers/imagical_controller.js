Imagical.ImagicalController = Ember.ArrayController.extend({
    actions: {
        readInputFile: function(e){
            console.log("readInputFile");
            var reader = new FileReader();
            var file = e.target.files[0];
            var that = this;
            
            reader.onload = function(e) {
                // Print the contents of the file
                var text = e.target.result;
                var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
                
                var fileRecord = that.store.createRecord('file', {
                    fileName: file.name
                });
                fileRecord.save();
                that.transitionToRoute('file', fileRecord);
            
                for (var i = 0; i < lines.length; i++){
                    var termRecord = that.store.createRecord('term', {
                        termText: lines[i]
                    });
                    termRecord.get('file').pushObject(fileRecord);
                    if (i===0){
                        that.transitionToRoute('term', termRecord);
                        
                        for (var j = 0; j < 10; j++ ){
                            var testRecord = that.store.createRecord('imageresult', {
                                url: "http://placehold.it/400x350/"+Math.round(Math.random()*9)+"0"+Math.round(Math.random()*9)+"0"+Math.round(Math.random()*9)+"0/ffffff.png&text=test",
                                thumbNailUrl: "http://placehold.it/400x350/"+Math.round(Math.random()*9)+"0"+Math.round(Math.random()*9)+"0"+Math.round(Math.random()*9)+"0/ffffff.png&text=test"
                            });
                            testRecord.save();
                            termRecord.get('imageresults').pushObject(testRecord);
                        }
                    }
                    termRecord.save();
                    //fileRecord.get('terms').pushObject(termRecord);
                    /*this.store.find(Imagical.Term, {termText: tt}).then( 
                            function(t){
                                if (t){
                                    console.log('term ´'+tt+'´ not found, creating new one');
                                    this.store.createRecord('term', {
                                            termText: tt
                                    });
                                }
                            }
                        ).then (
                            null,
                            function(reason){
                                console.error(reason);
                            }
                        );             
                        */
                }
            };

            reader.readAsText(file, "UTF-8");
        }
    }
});