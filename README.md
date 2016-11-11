Andrag Androp
=============

Crie aplicações web com funcionalidades de arrastar e soltar de forma simples utilizando apenas AngularJS. Sem jQuery.

Services
--------

### DragInfo

Armazena informações sobre as ações de Drag and Drop

#### Properties:
* __data:__ _(JSON)_. Informações sobre o drag-object;
* __type:__ _(String)_. MIME Type do drag-object;
* __actionAllowed:__ _(String separada por espaço)_. Ações suportadas pelo drag-object;
* __actionUsed:__ _(String)_. Utilizado pelo drag-container para especificar qual ação ele utilizará. Se esse valor for "none" o Drag and Drop será cancelado;
* __elemX:__ _(Integer)_. Posição X do mouse em relação ao drag-container. Usado apenas durante o onDrop;
* __elemY:__ _(Integer)_. Posição Y do mouse em relação ao drag-container. Usado apenas durante o onDrop;
* __x:__ _(Integer)_. Posição X do mouse em relação à página;
* __y:__ _(Integer)_. Posição Y do mouse em relação à página.

Directives
----------

### rtmDragObject

#### Attributes:
* __rtm-drag-object:__ Define os dados do drag-object. Torna o elemento arrastavel;
* __rtm-drag-type:__ Define o tipo do drag-object;
* __rtm-drag-action:__ _(String separada por espaço)_. Define as ações suportadas pelo drag-object;
* __rtm-disable-if:__ _(Boolean)_. Desabilita o Drag and Drop caso seja verdadeiro.

#### Callbacks:
* __rtm-ondragend:__ Chamado após qualquer ação de Drag and Drop;
* __rtm-oncopy:__ Chamado após uma ação _copy_;
* __rtm-onmove:__ Chamado após uma ação _move_;
* __rtm-onlink:__ Chamado após uma ação _link_.

#### Classes:
* __rtm-dragging:__ Atribuída quando o elemento começa a ser arrastado.

### rtmDragContainer

#### Attributes:
* __rtm-drag-container:__ Define os dados do drag-container. Torna o elemento arrastavel;
* __rtm-allowed-types:__ _(String separada por espaço)_ Define os tipos de drag-object suportados;
* __rtm-disable-if:__ _(Boolean)_. Desabilita o Drag and Drop caso seja verdadeiro.

#### Callbacks:
* __rtm-ondrop:__ Chamado após qualquer ação de Drag and Drop.

#### Classes:
* __rtm-dragstart:__ Atribuída quando algum drag-object começa a ser arrastado;
* __rtm-dragover:__ Atribuída quando o drag-object é arrastado sobre o drag-container.


License
-------

MIT License  
Copyright (c) 2016 André F. Martins  
Copyright (c) 2016 RooTM Soluções em Sistemas Multimídia Ltda  
