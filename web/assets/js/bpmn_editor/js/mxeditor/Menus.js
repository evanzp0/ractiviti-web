/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
Menus = function(editorUi)
{
	this.editorUi = editorUi;
	this.menus = new Object();
	this.init();
	
	// Pre-fetches checkmark image
	if (!mxClient.IS_SVG)
	{
		new Image().src = this.checkmarkImage;
	}
};

/**
 * Sets the default font family.
 */
Menus.prototype.defaultFont = 'Helvetica';

/**
 * Sets the default font size.
 */
Menus.prototype.defaultFontSize = '12';

/**
 * Sets the default font size.
 */
Menus.prototype.defaultMenuItems = ['file', 'edit', 'view', 'arrange', 'test'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.defaultFonts = ['Helvetica', 'Verdana', 'Times New Roman', 'Garamond', 'Comic Sans MS',
           		             'Courier New', 'Georgia', 'Lucida Console', 'Tahoma'];

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.init = function()
{
	var graph = this.editorUi.editor.graph;
	var isGraphEnabled = mxUtils.bind(graph, graph.isEnabled);

	this.customFonts = [];
	this.customFontSizes = [];

	this.put('align', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		menu.addItem(mxResources.get('leftAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, parent);
		menu.addItem(mxResources.get('center'), null, function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, parent);
		menu.addItem(mxResources.get('rightAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, parent);
		menu.addSeparator(parent);
		menu.addItem(mxResources.get('topAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_TOP); }, parent);
		menu.addItem(mxResources.get('middle'), null, function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, parent);
		menu.addItem(mxResources.get('bottomAlign'), null, function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, parent);
	})));

	this.put('arrange', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['toFront', 'toBack', '-'], parent);
		this.addMenuItems(menu, ['-', 'group', 'ungroup', 'removeFromGroup', '-', ], parent);
	}))).isEnabled = isGraphEnabled;

	this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ((this.editorUi.format != null) ? ['formatPanel'] : []).
			concat(['outline', '-', 'pageView', 'pageScale', '-', 'scrollbars', 'tooltips', '-',
			        'grid', 'guides', '-', 'connectionArrows', 'connectionPoints', '-',
			        'resetView', 'zoomIn', 'zoomOut'], parent));
	})));

	this.put('viewZoom', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['resetView', '-'], parent);
		var scales = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
		
		for (var i = 0; i < scales.length; i++)
		{
			(function(scale)
			{
				menu.addItem((scale * 100) + '%', null, function()
				{
					graph.zoomTo(scale);
				}, parent);
			})(scales[i]);
		}

		this.addMenuItems(menu, ['-', 'fitWindow', 'fitPageWidth', 'fitPage', 'fitTwoPages', '-', 'customZoom'], parent);
	})));

	this.put('file', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['save', 'extras'], parent);
	})));

	this.put('edit', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['undo', 'redo', '-', 'cut', 'copy', 'paste', 'delete', '-', 'duplicate', '-',
			'editData', '-',
			'selectVertices', 'selectEdges', 'selectAll', 'selectNone']);
	})));

	this.put('test', new Menu(mxUtils.bind(this, function(menu, parent)
	{
		this.addMenuItems(menu, ['encodeToBpmn'], parent);
		this.addMenuItems(menu, ['decodeFromBpmn'], parent);
	}))).isEnabled = isGraphEnabled;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.put = function(name, menu)
{
	this.menus[name] = menu;
	
	return menu;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.get = function(name)
{
	return this.menus[name];
};

/**
 * Adds the given submenu.
 */
Menus.prototype.addSubmenu = function(name, menu, parent, label)
{
	var entry = this.get(name);
	
	if (entry != null)
	{
		var enabled = entry.isEnabled();
	
		if (menu.showDisabled || enabled)
		{
			var submenu = menu.addItem(label || mxResources.get(name), null, null, parent, null, enabled);
			this.addMenu(name, menu, submenu);
		}
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Menus.prototype.addMenu = function(name, popupMenu, parent)
{
	var menu = this.get(name);
	
	if (menu != null && (popupMenu.showDisabled || menu.isEnabled()))
	{
		this.get(name).execute(popupMenu, parent);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItem = function(menu, key, parent, trigger, sprite, label)
{
	var action = this.editorUi.actions.get(key);

	if (action != null && (menu.showDisabled || action.isEnabled()) && action.visible)
	{
		var item = menu.addItem(label || action.label, null, function()
		{
			action.funct(trigger);
		}, parent, sprite, action.isEnabled());
		
		// Adds checkmark image
		if (action.toggleAction && action.isSelected())
		{
			menu.addCheckmark(item, Editor.checkmarkImage);
		}

		this.addShortcut(item, action);
		
		return item;
	}
	
	return null;
};

/**
 * Adds a checkmark to the given menuitem.
 */
Menus.prototype.addShortcut = function(item, action)
{
	if (action.shortcut != null)
	{
		var td = item.firstChild.nextSibling.nextSibling;
		var span = document.createElement('span');
		span.style.color = 'gray';
		mxUtils.write(span, action.shortcut);
		td.appendChild(span);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addMenuItems = function(menu, keys, parent, trigger, sprites)
{
	for (var i = 0; i < keys.length; i++)
	{
		if (keys[i] == '-')
		{
			menu.addSeparator(parent);
		}
		else
		{
			this.addMenuItem(menu, keys[i], parent, trigger, (sprites != null) ? sprites[i] : null);
		}
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createPopupMenu = function(menu, cell, evt)
{
	menu.smartSeparators = true;
	
	this.addPopupMenuHistoryItems(menu, cell, evt);
	this.addPopupMenuEditItems(menu, cell, evt);
	this.addPopupMenuArrangeItems(menu, cell, evt);
	this.addPopupMenuCellItems(menu, cell, evt);
	this.addPopupMenuSelectionItems(menu, cell, evt);
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addPopupMenuHistoryItems = function(menu, cell, evt)
{
	if (this.editorUi.editor.graph.isSelectionEmpty())
	{
		this.addMenuItems(menu, ['undo', 'redo'], null, evt);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addPopupMenuEditItems = function(menu, cell, evt)
{
	if (this.editorUi.editor.graph.isSelectionEmpty())
	{
		this.addMenuItems(menu, ['pasteHere'], null, evt);
	}
	else
	{
		this.addMenuItems(menu, ['delete', '-', 'cut', 'copy', '-', 'duplicate'], null, evt);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addPopupMenuArrangeItems = function(menu, cell, evt)
{
	var graph = this.editorUi.editor.graph;
	
	if (!graph.isSelectionEmpty())
	{
		this.addMenuItems(menu, ['-', 'toFront', 'toBack'], null, evt);
	}	

	if (graph.getSelectionCount() > 1)	
	{
		this.addMenuItems(menu, ['-', 'group'], null, evt);
	}
	else if (graph.getSelectionCount() == 1 && !graph.getModel().isEdge(cell) &&
		!graph.isSwimlane(cell) && graph.getModel().getChildCount(cell) > 0)
	{
		this.addMenuItems(menu, ['-', 'ungroup'], null, evt);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addPopupMenuCellItems = function(menu, cell, evt)
{
	var graph = this.editorUi.editor.graph;
	cell = graph.getSelectionCell();
	var state = graph.view.getState(cell);
	menu.addSeparator();
	
	if (state != null)
	{
		if (graph.getSelectionCount() == 1)
		{
			this.addMenuItems(menu, ['-', 'editData'], null, evt);
		}
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.addPopupMenuSelectionItems = function(menu, cell, evt)
{
	if (this.editorUi.editor.graph.isSelectionEmpty())
	{
		this.addMenuItems(menu, ['-', 'selectVertices', 'selectEdges', 'selectAll'], null, evt);
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.createMenubar = function(container)
{
	var menubar = new Menubar(this.editorUi, container);
	var menus = this.defaultMenuItems;
	
	for (var i = 0; i < menus.length; i++)
	{
		(mxUtils.bind(this, function(menu)
		{
			var elt = menubar.addMenu(mxResources.get(menus[i]), mxUtils.bind(this, function()
			{
				// Allows extensions of menu.funct
				menu.funct.apply(this, arguments);
			}));
			
			this.menuCreated(menu, elt);
		}))(this.get(menus[i]));
	}

	return menubar;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menus.prototype.menuCreated = function(menu, elt, className)
{
	if (elt != null)
	{
		className = (className != null) ? className : 'geItem';
		
		menu.addListener('stateChanged', function()
		{
			elt.enabled = menu.enabled;
			
			if (!menu.enabled)
			{
				elt.className = className + ' mxDisabled';
				
				if (document.documentMode == 8)
				{
					elt.style.color = '#c3c3c3';
				}
			}
			else
			{
				elt.className = className;
				
				if (document.documentMode == 8)
				{
					elt.style.color = '';
				}
			}
		});
	}
};

/**
 * Construcs a new menubar for the given editor.
 */
function Menubar(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
};

/**
 * Adds the menubar elements.
 */
Menubar.prototype.hideMenu = function()
{
	this.editorUi.hideCurrentMenu();
};

/**
 * Adds a submenu to this menubar.
 */
Menubar.prototype.addMenu = function(label, funct, before)
{
	var elt = document.createElement('a');
	elt.className = 'geItem';
	mxUtils.write(elt, label);
	this.addMenuHandler(elt, funct);
	
    if (before != null)
    {
    	this.container.insertBefore(elt, before);
    }
    else
    {
    	this.container.appendChild(elt);
    }
	
	return elt;
};

/**
 * Adds a handler for showing a menu in the given element.
 */
Menubar.prototype.addMenuHandler = function(elt, funct)
{
	if (funct != null)
	{
		var show = true;
		
		var clickHandler = mxUtils.bind(this, function(evt)
		{
			if (show && elt.enabled == null || elt.enabled)
			{
				this.editorUi.editor.graph.popupMenuHandler.hideMenu();
				var menu = new mxPopupMenu(funct);
				menu.div.className += ' geMenubarMenu';
				menu.smartSeparators = true;
				menu.showDisabled = true;
				menu.autoExpand = true;
				
				// Disables autoexpand and destroys menu when hidden
				menu.hideMenu = mxUtils.bind(this, function()
				{
					mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
					this.editorUi.resetCurrentMenu();
					menu.destroy();
				});

				var offset = mxUtils.getOffset(elt);
				menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt);
				this.editorUi.setCurrentMenu(menu, elt);
			}
			
			mxEvent.consume(evt);
		});
		
		// Shows menu automatically while in expanded state
		mxEvent.addListener(elt, 'mousemove', mxUtils.bind(this, function(evt)
		{
			if (this.editorUi.currentMenu != null && this.editorUi.currentMenuElt != elt)
			{
				this.editorUi.hideCurrentMenu();
				clickHandler(evt);
			}
		}));
		
		// Hides menu if already showing and prevents focus
        mxEvent.addListener(elt, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown',
        	mxUtils.bind(this, function(evt)
		{
			show = this.currentElt != elt;
			evt.preventDefault();
		}));

		mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
		{
			clickHandler(evt);
			show = true;
		}));
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
Menubar.prototype.destroy = function()
{
	// do nothing
};

/**
 * Constructs a new action for the given parameters.
 */
function Menu(funct, enabled)
{
	mxEventSource.call(this);
	this.funct = funct;
	this.enabled = (enabled != null) ? enabled : true;
};

// Menu inherits from mxEventSource
mxUtils.extend(Menu, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.setEnabled = function(value)
{
	if (this.enabled != value)
	{
		this.enabled = value;
		this.fireEvent(new mxEventObject('stateChanged'));
	}
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Menu.prototype.execute = function(menu, parent)
{
	this.funct(menu, parent);
};

/**
 * "Installs" menus in EditorUi.
 */
EditorUi.prototype.createMenus = function()
{
	return new Menus(this);
};


/**
 * Adds a style change item to the given menu.
 */
 Menus.prototype.edgeStyleChange = function(menu, label, keys, values, sprite, parent, reset)
 {
	 return menu.addItem(label, null, mxUtils.bind(this, function()
	 {
		 var graph = this.editorUi.editor.graph;
		 graph.stopEditing(false);
		 
		 graph.getModel().beginUpdate();
		 try
		 {
			 var cells = graph.getSelectionCells();
			 var edges = [];
			 
			 for (var i = 0; i < cells.length; i++)
			 {
				 var cell = cells[i];
				 
				 if (graph.getModel().isEdge(cell))
				 {
					 if (reset)
					 {
						 var geo = graph.getCellGeometry(cell);
			 
						 // Resets all edge points
						 if (geo != null)
						 {
							 geo = geo.clone();
							 geo.points = null;
							 graph.getModel().setGeometry(cell, geo);
						 }
					 }
					 
					 for (var j = 0; j < keys.length; j++)
					 {
						 graph.setCellStyles(keys[j], values[j], [cell]);
					 }
					 
					 edges.push(cell);
				 }
			 }
			 
			 this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', keys,
				 'values', values, 'cells', edges));
		 }
		 finally
		 {
			 graph.getModel().endUpdate();
		 }
	 }), parent, sprite);
 };
 
 /**
  * Adds a style change item to the given menu.
  */
 Menus.prototype.styleChange = function(menu, label, keys, values, sprite, parent, fn, post)
 {
	 var apply = this.createStyleChangeFunction(keys, values);
	 
	 return menu.addItem(label, null, mxUtils.bind(this, function()
	 {
		 var graph = this.editorUi.editor.graph;
		 
		 if (fn != null && graph.cellEditor.isContentEditing())
		 {
			 fn();
		 }
		 else
		 {
			 apply(post);
		 }
	 }), parent, sprite);
 };
 
 /**
  * 
  */
 Menus.prototype.createStyleChangeFunction = function(keys, values)
 {
	 return mxUtils.bind(this, function(post)
	 {
		 var graph = this.editorUi.editor.graph;
		 graph.stopEditing(false);
		 
		 graph.getModel().beginUpdate();
		 try
		 {
			 var cells = graph.getSelectionCells();
			 
			 for (var i = 0; i < keys.length; i++)
			 {
				 graph.setCellStyles(keys[i], values[i], cells);
 
				 // Removes CSS alignment to produce consistent output
				 if (keys[i] == mxConstants.STYLE_ALIGN)
				 {
					 graph.updateLabelElements(cells, function(elt)
					 {
						 elt.removeAttribute('align');
						 elt.style.textAlign = null;
					 });
				 }
				 
				 // Updates autosize after font changes
				 if (keys[i] == mxConstants.STYLE_FONTFAMILY)
				 {
					 for (var j = 0; j < cells.length; j++)
					 {
						 if (graph.model.getChildCount(cells[j]) == 0)
						 {
							 graph.autoSizeCell(cells[j], false);
						 }
					 }
				 }
			 }
			 
			 if (post != null)
			 {
				 post();
			 }
			 
			 this.editorUi.fireEvent(new mxEventObject('styleChanged',
				 'keys', keys, 'values', values, 'cells', cells));
		 }
		 finally
		 {
			 graph.getModel().endUpdate();
		 }
	 });
 };
 