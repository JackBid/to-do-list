// Wrap in anonymous function so that the project has its own scope
(function() {

  /*
  Object for the object literal pattern that contains the app, this means that all the
  funcitons are methods within an object. This makes the project more structured and
  assosiates the various methods in one object
  */

  var to_do_list = {

    // Initialise the app by invoking various methods
    init : function(){
      // this.cacheDom gets all the elements from the webpage and allows us to interact with them
      this.cacheDom();

      // Bind all buttons to events
      this.bindEvents();

      // The addTaskContainer should initially be hiden and appear only when the user clicks to show it
      this.$addTaskContainer.hide();

      if(!this.supportsWebstorage){
        alert("This browser does not support local storage - your task won't be saved after you leave. Try updating your browser.");
      } else {
        // Find events that our stored in the browser from previous use
        this.getStoredItems();
      }

    },

    // Converts webpage elements into a jquery object that we can interact with
    cacheDom : function(){
      this.$addTaskButton = $(".add-task-button");
      this.$taskIcon = $(".task-toggle-icon");
      this.$addTaskContainer = $(".add-task-container");
      this.$taskList = $(".to-do-container ol");
      this.$taskTitle = $("#task-title-input");
      this.$submitTaskButton = $("#submit-task-button");
      this.$taskCompleteBox = $(".status-incomplete");
    },

    // Binds all the buttons to events
    bindEvents : function(){
        this.$addTaskButton.on("click", this.showTaskAdd.bind(this));
        this.$submitTaskButton.on("click", this.addTask.bind(this));
        this.$taskCompleteBox.on("click", function(){
          // Task needs to be a parameter for this function.
          to_do_list.taskComplete($(this));
        });
    },

    // When a new task is added the list is updated by binding new events
    update : function(){
      this.$taskCompleteBox = $(".status-incomplete");
      this.$taskCompleteBox.on("click", function(){
        to_do_list.taskComplete($(this));
      });
    },

    // Return true or false whether the browser supports web storage
    supportsWebstorage : function(){
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch(e) {
        return false;
      }
    },

    // This methods finds all the stored list items from when the user last used the app
    getStoredItems : function(){

      // Put all the stored tasks in the array items
      var items = [];
      for(var i = localStorage.length-1; i >=0; i--){
        items.push(localStorage.key(i));
      }

      // Cycle through these tasks and add each of them to the list
      for(var j = items.length-1; j >= 0; j--){
        this.$taskList.append("<li><p>" + items[j] + "</p><div class=\"status status-incomplete\"></div></li>");
      }
      // Call update so that these task will have the needed functionality
      this.update();
    },

    // Show or hide the user interface for adding a task
    showTaskAdd : function(){
      this.$addTaskContainer.toggle();

      // Find out whether the icon is a plus or minus and make it the opposite
      var state = this.$taskIcon.text();
      if(state === "+"){
        this.$taskIcon.html("-");
        this.$taskIcon.addClass("negative-icon");
      }else if(state === "-"){
        this.$taskIcon.html("+");
        this.$taskIcon.removeClass("negative-icon");
      }
    },

    // Add a task to our list when it is submitted
    addTask : function(){
      var task = {
        title: this.$taskTitle.val()
      }
      // Check if the user has entered anything, or if their input is too long
      if(task.title.length === 0){
        alert("Please enter a task!");
      }else if(task.title.length >= 50){
        alert("Your task is too long, try shortening your title or breaking it down into smaller tasks.");
      }else{
        // Add task to list
        var taskToAdd = "<li><p>" + task.title + "</p><div class=\"status status-incomplete\"></div></li>";
        this.$taskList.append(taskToAdd);
        // Clear the value of the input box
        this.$taskTitle.val("");
        if(this.supportsWebstorage){
          // If webstorage is available, add this task to it
          localStorage.setItem(task.title, task.title);
        }
        // Call update on new tasks
        this.update();
      }
    },

    // When a task is complete remove it from the list after some animations
    taskComplete : function($completeTask){
      // Change the CSS classes - changes the style of the element
      $completeTask.removeClass("status-incomplete");
      $completeTask.addClass("status-complete");

      // Find the text next to the checkbox
      var task = $completeTask.parent().find("p");
      if(this.supportsWebstorage){
        // Remove item from storage if storage is being used
        localStorage.removeItem(task.text());
      }

      // Add new styles/animations
      task.addClass("task-complete-text");
      task.fadeOut(600);
      $completeTask.fadeOut(600).promise().done(function(){
        // Once fadeOut is complete, hide the element
        this.parent().remove();
      });

    }

  }
  // Calls the Initialising function
  to_do_list.init();

})();
