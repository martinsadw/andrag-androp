angular.module("AndragAndrop", [])
   .factory('TrackMouse', function() {
      var mouseX = 0;
      var mouseY = 0;
      angular.element(document).on('mousemove', function(event) {
         mouseX = event.pageX;
         mouseY = event.pageY;
      })
      // Por alguma razão o evento 'drag' retorna 0 como a posição do mouse
      // O evento 'dragover' não possui esse problema
      angular.element(document).on('dragover', function(event) {
         mouseX = event.pageX;
         mouseY = event.pageY;
      })
      return {
         x: function(){ return mouseX; },
         y: function(){ return mouseY; }
      }
   })
   .factory('DragInfo', function(TrackMouse) {
      var dragData = {};
      var type = "none/none";
      var actionAllowed = "move";
      var actionUsed = "none";
      var elemX = 0;
      var elemY = 0;

      return {
         setDragData: function(value) { dragData = value; },
         dragData: function(){ return dragData; },
         setType: function(value) { type = value; },
         type: function(){ return type; },
         setActionAllowed: function(value) { actionAllowed = value; },
         actionAllowed: function(){ return actionAllowed; },
         setActionUsed: function(value) { actionUsed = value; },
         actionUsed: function(){ return actionUsed; },
         setElemX: function(value) { elemX = value; },
         elemX: function(){ return elemX; },
         setElemY: function(value) { elemY = value; },
         elemY: function(){ return elemY; },
         x: TrackMouse.x,
         y: TrackMouse.y,
         hasData: function() { return Object.keys(dragData).length !== 0 || dragData.constructor !== Object; }
      };
   })
   .factory('UUID', function() {
      function generateUUID() {
         var d = new Date().getTime();
         var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
         });
         return uuid;
      };

      return {
         new: generateUUID,
         empty: function() { return '00000000-0000-0000-0000-000000000000'; }
      };
   })
   .directive('rtmDragObject', function($rootScope, DragInfo) {
      return {
         restrict: 'A',
         link: function($scope, element, attr) {
            element.attr('draggable', 'true');

            if(attr.rtmDisableIf)
            {
               $scope.$watch(attr.rtmDisableIf, function(disabled) {
                  element.attr("draggable", !disabled)
               });
            }

            element.on("dragstart", function(event) {
               this.classList.add('rtm-dragging');

               var data = $scope.$eval(attr.rtmDragObject);
               event.dataTransfer.setData('Text', angular.toJson(data));
               DragInfo.setDragData(data);

               var type = attr.rtmDragType || "none/none";
               DragInfo.setType(type);

               var actionAllowed = attr.rtmDragAction || "move";
               event.dataTransfer.effectAllowed = actionAllowed;
               DragInfo.setActionAllowed(actionAllowed);

               var dragIcon = document.createElement('img');
               dragIcon.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
               dragIcon.width = 100;
               event.dataTransfer.setDragImage(dragIcon, -10, -10);

               $rootScope.$broadcast('rtm-dragstart');
               return false;
            })
            element.on("dragend", function(event) {
               this.classList.remove('rtm-dragging');

               var actionUsed = DragInfo.actionUsed();

               var elemX = DragInfo.elemX();
               var elemY = DragInfo.elemY();

               //event.clientX and event.clientY are inconsistent
               var dragEvent = {
                  elemX: elemX,
                  elemY: elemY,
                  actionUsed: actionUsed,
                  originalEvent: event
               };
               switch(actionUsed)
               {
                  case "move":
                  $scope.$eval(attr.rtmOnmove, {event: dragEvent});
                  break;
                  case "copy":
                  $scope.$eval(attr.rtmOncopy, {event: dragEvent});
                  break;
                  case "link":
                  $scope.$eval(attr.rtmOnlink, {event: dragEvent});
                  break;
               }
               $scope.$eval(attr.rtmOndragend, {event: dragEvent});

               DragInfo.setDragData({});
               DragInfo.setType("none/none");
               DragInfo.setActionAllowed("move");
               DragInfo.setActionUsed("none");

               $rootScope.$broadcast('rtm-dragend');
               return false;
            })
         }
      };
   })
   .directive('rtmDragContainer', function(DragInfo) {
      return {
         restrict: 'A',
         link: function($scope, element, attr) {
            element.on('dragover', function(event) {
               if(event.preventDefault) event.preventDefault();
               //if(event.stopPropagation) event.stopPropagation();

               if(!isDropAllowed()) return true;

               event.dataTransfer.dropEffect = 'all';
               return false;
            });

            element.on('dragenter', function(event) {
               if(event.preventDefault) event.preventDefault();

               if(!isDropAllowed()) return true;

               angular.element(event.target).addClass('rtm-dragover');
            });
            element.on('dragleave', function(event) {
               angular.element(event.target).removeClass('rtm-dragover');
            });

            element.on('drop', function(event) {
               if(event.preventDefault) event.preventDefault();
               if(event.stopPropagation) event.stopPropagation();

               if(!isDropAllowed()) return true;

               angular.element(event.target).removeClass('rtm-dragover');

               var data = event.dataTransfer.getData('Text');
               data = angular.fromJson(data);

               var actionAllowed = event.dataTransfer.dropEffect;
               // BUG(2016-09-08): In Chrome-Windows dropEffect is always "none"
               if(actionAllowed === "none")
               actionAllowed = DragInfo.actionAllowed();

               var actionUsed = actionAllowed;

               var elemPos = element[0].getBoundingClientRect();
               var elemX = DragInfo.x() - (elemPos.left + window.pageXOffset - element[0].scrollLeft);
               var elemY = DragInfo.y() - (elemPos.top + window.pageYOffset - element[0].scrollTop);

               DragInfo.setElemX(elemX);
               DragInfo.setElemY(elemY);
               //event.clientX and event.clientY are inconsistent
               var dragEvent = {
                  data: data,
                  elemX: elemX,
                  elemY: elemY,
                  actionAllowed: actionAllowed,
                  actionUsed: actionUsed,
                  originalEvent: event
               };
               // the actionUsed can be changed in the callback
               $scope.$eval(attr.rtmOndrop, {event: dragEvent});

               DragInfo.setActionUsed(actionUsed);
            });

            $scope.$on("rtm-dragstart", function() {
               if(!isDropAllowed()) return true;

               element.addClass('rtm-dragstart');
            });
            $scope.$on("rtm-dragend", function() {
               element.removeClass('rtm-dragstart');
            });

            function isDropAllowed()
            {
               if(!DragInfo.hasData()) return false;

               if(attr.rtmAllowedTypes && DragInfo.hasData())
               {
                  var allowed = attr.rtmAllowedTypes.split(" ");
                  if(angular.isArray(allowed) && allowed.indexOf(DragInfo.type()) === -1)
                  return false;
               }

               if(attr.rtmDisableIf && $scope.$eval(attr.rtmDisableIf)) return false;

               return true;
            }
         }
      };
   });
