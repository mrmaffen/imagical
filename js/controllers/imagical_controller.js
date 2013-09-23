Imagical.ImagicalController = Ember.ArrayController.extend({
    actions: {
        readFile: function () {
            var reader = new FileReader();
            reader.onload = function(e) {
                // Print the contents of the file
                var text = e.target.result;

                var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks

                for(var i = 0; i < lines.length; i++) {
                    if (lines[i].length > 240){
                        output.push('<li>' + lines[i] + '<br>');
                    }
                }
            };

            reader.readAsText(f,"UTF-8");
            // Get the todo title set by the "New Todo" text field
            var title = this.get('newTitle');
            if (!title.trim()) { return; }

            // Create the new Todo model
            var todo = this.store.createRecord('todo', {
                title: title,
                isCompleted: false
            });

            // Save the new model
            todo.save();
        }
    }
});