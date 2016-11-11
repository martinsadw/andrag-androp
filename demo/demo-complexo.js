app.controller('DemoController', function($scope, $interval, Data, DragInfo, UUID) {
  this.dragData = DragInfo.dragData;
  this.hasData = DragInfo.hasData;
  this.type = DragInfo.type;
  this.actionAllowed = DragInfo.actionAllowed;
  this.mouseX = DragInfo.x;
  this.mouseY = DragInfo.y;

  this.list1Enabled = true;
  this.list2Enabled = true;

  this.maxTrashSize = 6;

  this.createObject = function(list, event) {
    var data = event.data; // Should I copy the object?

    var item = list.find(function(element) { return element.id == data.id; });
    if(list.indexOf(item) >= 0) return false; // Check if object is already on the container

    data.id = UUID.new();
    data.x = event.elemX;
    data.y = event.elemY;
    list.push(data);

    event.actionUsed = "copy"
  }
  this.removeItem = function(list, data) {
    var item = list.find(function(element) { return element.id == data.id; });
    var itemIndex = list.indexOf(item);

    if(itemIndex >= 0)
    {
      $scope.$apply(function() {
        list.splice(itemIndex, 1);
      });
    }
  }
  this.move = function(list, data, event) {
    var item = list.find(function(element) { return element.id == data.id; });

    $scope.$apply(function() {
      item.x = event.elemX;
      item.y = event.elemY;
    });
  }

  this.data = Data;

  // Por alguma razão os valores so atualizam com o '$interval'
  $interval(function(){}, 33);
})
.factory('Data', function(UUID) {
  return {
    list1: [
      { id: UUID.new(), title: 'A', desc: 'aaaaaa' },
      { id: UUID.new(), title: 'B', desc: 'bbbbbb' }
    ],
    list2: [
      { id: UUID.new(), title: 'D', desc: 'cccccc' },
      { id: UUID.new(), title: 'E', desc: 'dddddd' }
    ],
    trash: [
      { id: UUID.new(), title: '1', desc: '111111', x: 100, y: 100 },
      { id: UUID.new(), title: '2', desc: '222222', x: 300, y: 100 },
      { id: UUID.new(), title: '3', desc: '333333', x: 100, y: 300 }
    ]
  };
});
