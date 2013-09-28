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
                    if (lines[i].length < 100 && i < 500){
                        var termRecord = that.store.createRecord('term', {
                            termText: lines[i]
                        });
                        termRecord.get('files').pushObject(fileRecord);
                        termRecord.save();
                        if (i===0){
                            that.transitionToRoute('term', termRecord);
                        }
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
                    } else{
                        console.log('Error while reading file: Line too long or too many lines');
                    }
                }
            };

            reader.readAsText(file, "UTF-8");
        }
    }
});