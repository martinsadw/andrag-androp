app.controller('DemoController', function(DragInfo) {
   this.eventAlert = function(event) {
      alert(event.data.name);
   }
});
