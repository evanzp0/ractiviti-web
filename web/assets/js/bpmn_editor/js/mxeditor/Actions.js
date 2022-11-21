/**
 * Copyright (c) 2006-2020, JGraph Ltd
 * Copyright (c) 2006-2020, draw.io AG
 *
 * Constructs the actions object for the given UI.
 */
function Actions(editorUi)
{
	this.editorUi = editorUi;
	this.actions = new Object();
	this.init();
};

/**
 * Adds the default actions.
 */
Actions.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var isGraphEnabled = function()
	{
		return Action.prototype.isEnabled.apply(this, arguments) && graph.isEnabled();
	};

	// File actions
	this.addAction('publish', function() { ui.publishBpmn(); }, null, null, null).isEnabled = isGraphEnabled;
	this.addAction('extras', function()
	{
		var dlg = new EditDiagramDialog(ui);
		ui.showDialog(dlg.container, 620, 420, true, false);
		dlg.init();
	});

	// Edit actions
	this.addAction('undo', function() { ui.undo(); }, null, 'sprite-undo', Editor.ctrlKey + '+Z');
	this.addAction('redo', function() { ui.redo(); }, null, 'sprite-redo', (!mxClient.IS_WIN) ? Editor.ctrlKey + '+Shift+Z' : Editor.ctrlKey + '+Y');
	this.addAction('cut', function() { mxClipboard.cut(graph); }, null, 'sprite-cut', Editor.ctrlKey + '+X');
	this.addAction('copy', function()
	{
		try
		{
			mxClipboard.copy(graph);
		}
		catch (e)
		{
			ui.handleError(e);
		}
	}, null, 'sprite-copy', Editor.ctrlKey + '+C');
	this.addAction('paste', function()
	{
		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			mxClipboard.paste(graph);
		}
	}, false, 'sprite-paste', Editor.ctrlKey + '+V');
	this.addAction('pasteHere', function(evt)
	{
		if (graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent()))
		{
			graph.getModel().beginUpdate();
			try
			{
				var cells = mxClipboard.paste(graph);
				
				if (cells != null)
				{
					var includeEdges = true;
					
					for (var i = 0; i < cells.length && includeEdges; i++)
					{
						includeEdges = includeEdges && graph.model.isEdge(cells[i]);
					}

					var t = graph.view.translate;
					var s = graph.view.scale;
					var dx = t.x;
					var dy = t.y;
					var bb = null;
					
					if (cells.length == 1 && includeEdges)
					{
						var geo = graph.getCellGeometry(cells[0]);
						
						if (geo != null)
						{
							bb = geo.getTerminalPoint(true);
						}
					}

					bb = (bb != null) ? bb : graph.getBoundingBoxFromGeometry(cells, includeEdges);
					
					if (bb != null)
					{
						var x = Math.round(graph.snap(graph.popupMenuHandler.triggerX / s - dx));
						var y = Math.round(graph.snap(graph.popupMenuHandler.triggerY / s - dy));
						
						graph.cellsMoved(cells, x - bb.x, y - bb.y);
					}
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	});
	
	function deleteCells(includeEdges)
	{
		// Cancels interactive operations
		graph.escape();
		var select = graph.deleteCells(graph.getDeletableCells(graph.getSelectionCells()), includeEdges);
		
		if (select != null)
		{
			graph.setSelectionCells(select);
		}
	};
	
	this.addAction('delete', function(evt)
	{
		deleteCells(evt != null && mxEvent.isControlDown(evt));
	}, null, null, 'Delete');
	this.addAction('deleteAll', function()
	{
		if (!graph.isSelectionEmpty())
		{
			graph.getModel().beginUpdate();
			try
			{
				var cells = graph.getSelectionCells();
				
				for (var i = 0; i < cells.length; i++)
				{
					graph.cellLabelChanged(cells[i], '');
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	});
	this.addAction('deleteLabels', function()
	{
		if (!graph.isSelectionEmpty())
		{
			graph.getModel().beginUpdate();
			try
			{
				var cells = graph.getSelectionCells();
				
				for (var i = 0; i < cells.length; i++)
				{
					graph.cellLabelChanged(cells[i], '');
				}
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	}, null, null, Editor.ctrlKey + '+Delete');
	this.addAction('duplicate', function()
	{
		try
		{
			graph.setSelectionCells(graph.duplicateCells());
			graph.scrollCellToVisible(graph.getSelectionCell());
		}
		catch (e)
		{
			ui.handleError(e);
		}
	}, null, null, Editor.ctrlKey + '+D');
	this.put('turn', new Action(mxResources.get('turn') + ' / ' + mxResources.get('reverse'), function(evt)
	{
		graph.turnShapes(graph.getSelectionCells(), (evt != null) ? mxEvent.isShiftDown(evt) : false);
	}, null, null, Editor.ctrlKey + '+R'));
	this.addAction('selectVertices', function() { graph.selectVertices(null, true); }, null, null, Editor.ctrlKey + '+Shift+I');
	this.addAction('selectEdges', function() { graph.selectEdges(); }, null, null, Editor.ctrlKey + '+Shift+E');
	this.addAction('selectAll', function() { graph.selectAll(null, true); }, null, null, Editor.ctrlKey + '+A');
	this.addAction('selectNone', function() { graph.clearSelection(); }, null, null, Editor.ctrlKey + '+Shift+A');
	this.addAction('lockUnlock', function()
	{
		if (!graph.isSelectionEmpty())
		{
			graph.getModel().beginUpdate();
			try
			{
				var defaultValue = graph.isCellMovable(graph.getSelectionCell()) ? 1 : 0;
				graph.toggleCellStyles(mxConstants.STYLE_MOVABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_RESIZABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_ROTATABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_DELETABLE, defaultValue);
				graph.toggleCellStyles(mxConstants.STYLE_EDITABLE, defaultValue);
				graph.toggleCellStyles('connectable', defaultValue);
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	}, null, null, Editor.ctrlKey + '+L');

	// Navigation actions
	this.addAction('home', function() { graph.home(); }, null, null, 'Shift+Home');
	this.addAction('exitGroup', function() { graph.exitGroup(); }, null, null, Editor.ctrlKey + '+Shift+Home');
	this.addAction('enterGroup', function() { graph.enterGroup(); }, null, null, Editor.ctrlKey + '+Shift+End');
	this.addAction('collapse', function() { graph.foldCells(true); }, null, null, Editor.ctrlKey + '+Home');
	this.addAction('expand', function() { graph.foldCells(false); }, null, null, Editor.ctrlKey + '+End');
	
	// Arrange actions
	this.addAction('toFront', function() { graph.orderCells(false); }, null, null, Editor.ctrlKey + '+Shift+F');
	this.addAction('toBack', function() { graph.orderCells(true); }, null, null, Editor.ctrlKey + '+Shift+B');
	this.addAction('group', function()
	{
		if (graph.isEnabled())
		{
			var cells = mxUtils.sortCells(graph.getSelectionCells(), true);

			if (cells.length == 1 && !graph.isTable(cells[0]) && !graph.isTableRow(cells[0]))
			{
				graph.setCellStyles('container', '1');
			}
			else
			{
				cells = graph.getCellsForGroup(cells);
				
				if (cells.length > 1)
				{
					graph.setSelectionCell(graph.groupCells(null, 0, cells));
				}
			}
		}
	}, null, null, Editor.ctrlKey + '+G');
	this.addAction('ungroup', function()
	{
		if (graph.isEnabled())
		{
			var cells = graph.getSelectionCells();
			
	        graph.model.beginUpdate();
			try
			{
				var temp = graph.ungroupCells();
				
				// Clears container flag for remaining cells
				if (cells != null)
				{
					for (var i = 0; i < cells.length; i++)
			    	{
						if (graph.model.contains(cells[i]))
						{
							if (graph.model.getChildCount(cells[i]) == 0 &&
								graph.model.isVertex(cells[i]))
							{
								graph.setCellStyles('container', '0', [cells[i]]);
							}
							
							temp.push(cells[i]);
						}
			    	}
				}
		    }
			finally
			{
				graph.model.endUpdate();
			}
	
			graph.setSelectionCells(temp);
		}
	}, null, null, Editor.ctrlKey + '+Shift+U');
	this.addAction('removeFromGroup', function()
	{
		if (graph.isEnabled())
		{
			var cells = graph.getSelectionCells();
			
			// Removes table rows and cells
			if (cells != null)
			{
				var temp = [];
				
				for (var i = 0; i < cells.length; i++)
		    	{
					if (!graph.isTableRow(cells[i]) &&
						!graph.isTableCell(cells[i]))
					{
						temp.push(cells[i]);
					}
		    	}
				
				graph.removeCellsFromParent(temp);
			}
		}
	});

	this.addAction('editData...', function()
	{
		var cell = graph.getSelectionCell() || graph.getModel().getRoot();
		ui.showDataDialog(cell);
	}, null, null, Editor.ctrlKey + '+M');

	this.addAction('wordWrap', function()
	{
    	var state = graph.getView().getState(graph.getSelectionCell());
    	var value = 'wrap';
    	
		graph.stopEditing();
    	
    	if (state != null && state.style[mxConstants.STYLE_WHITE_SPACE] == 'wrap')
    	{
    		value = null;
    	}

       	graph.setCellStyles(mxConstants.STYLE_WHITE_SPACE, value);
	});
	// View actions
	this.addAction('resetView', function()
	{
		graph.zoomTo(1);
		ui.resetScrollbars();
	}, null, null, 'Home');
	this.addAction('zoomIn', function(evt)
	{
		if (graph.isFastZoomEnabled())
		{
			graph.lazyZoom(true, true, ui.buttonZoomDelay);
		}
		else
		{
			graph.zoomIn();
		}
	}, null, null, Editor.ctrlKey + ' + (Numpad) / Alt+Mousewheel');
	this.addAction('zoomOut', function(evt)
	{
		if (graph.isFastZoomEnabled())
		{
			graph.lazyZoom(false, true, ui.buttonZoomDelay);
		}
		else
		{
			graph.zoomOut();
		}
	}, null, null, Editor.ctrlKey + ' - (Numpad) / Alt+Mousewheel');
	this.addAction('fitWindow', function()
	{
		var bounds = (graph.isSelectionEmpty()) ? graph.getGraphBounds() :
			graph.getBoundingBox(graph.getSelectionCells())
		var t = graph.view.translate;
		var s = graph.view.scale;
		
		bounds.x = bounds.x / s - t.x;
		bounds.y = bounds.y / s - t.y;
		bounds.width /= s;
		bounds.height /= s;

		if (graph.backgroundImage != null)
		{
			bounds.add(new mxRectangle(0, 0, graph.backgroundImage.width, graph.backgroundImage.height));
		}
		
		if (bounds.width == 0 || bounds.height == 0)
		{
			graph.zoomTo(1);
			ui.resetScrollbars();
		}
		else
		{
			graph.fitWindow(bounds);
		}
	}, null, null, Editor.ctrlKey + '+Shift+H');
	this.addAction('fitPage', mxUtils.bind(this, function()
	{
		if (!graph.pageVisible)
		{
			this.get('pageView').funct();
		}
		
		var fmt = graph.pageFormat;
		var ps = graph.pageScale;
		var cw = graph.container.clientWidth - 10;
		var ch = graph.container.clientHeight - 10;
		var scale = Math.floor(20 * Math.min(cw / fmt.width / ps, ch / fmt.height / ps)) / 20;
		graph.zoomTo(scale);
		
		if (mxUtils.hasScrollbars(graph.container))
		{
			var pad = graph.getPagePadding();
			graph.container.scrollTop = pad.y * graph.view.scale - 1;
			graph.container.scrollLeft = Math.min(pad.x * graph.view.scale, (graph.container.scrollWidth - graph.container.clientWidth) / 2) - 1;
		}
	}), null, null, Editor.ctrlKey + '+J');
	this.addAction('fitTwoPages', mxUtils.bind(this, function()
	{
		if (!graph.pageVisible)
		{
			this.get('pageView').funct();
		}
		
		var fmt = graph.pageFormat;
		var ps = graph.pageScale;
		var cw = graph.container.clientWidth - 10;
		var ch = graph.container.clientHeight - 10;
		
		var scale = Math.floor(20 * Math.min(cw / (2 * fmt.width) / ps, ch / fmt.height / ps)) / 20;
		graph.zoomTo(scale);
		
		if (mxUtils.hasScrollbars(graph.container))
		{
			var pad = graph.getPagePadding();
			graph.container.scrollTop = Math.min(pad.y, (graph.container.scrollHeight - graph.container.clientHeight) / 2);
			graph.container.scrollLeft = Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2);
		}
	}), null, null, Editor.ctrlKey + '+Shift+J');
	this.addAction('fitPageWidth', mxUtils.bind(this, function()
	{
		if (!graph.pageVisible)
		{
			this.get('pageView').funct();
		}
		
		var fmt = graph.pageFormat;
		var ps = graph.pageScale;
		var cw = graph.container.clientWidth - 10;

		var scale = Math.floor(20 * cw / fmt.width / ps) / 20;
		graph.zoomTo(scale);
		
		if (mxUtils.hasScrollbars(graph.container))
		{
			var pad = graph.getPagePadding();
			graph.container.scrollLeft = Math.min(pad.x * graph.view.scale,
				(graph.container.scrollWidth - graph.container.clientWidth) / 2);
		}
	}));
	this.put('customZoom', new Action(mxResources.get('custom') + '...', mxUtils.bind(this, function()
	{
		var dlg = new FilenameDialog(this.editorUi, parseInt(graph.getView().getScale() * 100), mxResources.get('apply'), mxUtils.bind(this, function(newValue)
		{
			var val = parseInt(newValue);
			
			if (!isNaN(val) && val > 0)
			{
				graph.zoomTo(val / 100);
			}
		}), mxResources.get('zoom') + ' (%)');
		this.editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}), null, null, Editor.ctrlKey + '+0'));
	this.addAction('pageScale...', mxUtils.bind(this, function()
	{
		var dlg = new FilenameDialog(this.editorUi, parseInt(graph.pageScale * 100), mxResources.get('apply'), mxUtils.bind(this, function(newValue)
		{
			var val = parseInt(newValue);
			
			if (!isNaN(val) && val > 0)
			{
				var change = new ChangePageSetup(ui, null, null, null, val / 100);
				change.ignoreColor = true;
				change.ignoreImage = true;
				
				graph.model.execute(change);
			}
		}), mxResources.get('pageScale') + ' (%)');
		this.editorUi.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}));

	// Option actions
	var action = null;

	action = this.addAction('scrollbars', function()
	{
		ui.setScrollbars(!ui.hasScrollbars());
	});
	action.setToggleAction(true);
	action.setSelectedCallback(function() { return graph.scrollbars; });
	action = this.addAction('pageView', mxUtils.bind(this, function()
	{
		ui.setPageVisible(!graph.pageVisible);
	}));

	action = this.addAction('outline', mxUtils.bind(this, function()
	{
		if (this.outlineWindow == null)
		{
			// LATER: Check layers window for initial placement
			this.outlineWindow = new OutlineWindow(ui, document.body.offsetWidth - 260, 100, 180, 180);
			this.outlineWindow.window.addListener('show', function()
			{
				ui.fireEvent(new mxEventObject('outline'));
			});
			this.outlineWindow.window.addListener('hide', function()
			{
				ui.fireEvent(new mxEventObject('outline'));
			});
			this.outlineWindow.window.setVisible(true);
			ui.fireEvent(new mxEventObject('outline'));
		}
		else
		{
			this.outlineWindow.window.setVisible(!this.outlineWindow.window.isVisible());
		}
	}), null, null, Editor.ctrlKey + '+Shift+O');
	
	// for test encode to / decode from bpmn
	this.addAction('encodeToBpmn', function()
	{
		var model = graph.model;
		var rst = encodeBpmn(model);

		console.log(rst);
	});

	this.addAction('decodeFromBpmn', function()
	{
		var demo = '<?xml version="1.0" encoding="UTF-8"?><definitions><process id="" name=""><sequenceFlow id="10" sourceRef="9" targetRef="11" /><startEvent id="9" name="" /><userTask id="11" name="" /></process><BPMNDiagram id="BPMNDiagram_"><BPMNPlane id="BPMNPlane_" bpmnElement=""><BPMNShape id="BPMNShape_10" bpmnElement="10" style="edgeStyle=orthogonalEdgeStyle;shape=connector;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;labelBackgroundColor=#ffffff;endArrow=classic;strokeColor=#000000;strokeWidth=2;fontFamily=Helvetica;fontSize=14;fontColor=#000000;align=center;entryX=0;entryY=0.25;entryDx=0;entryDy=0;" /><BPMNShape id="BPMNShape_9" bpmnElement="9"><Bounds x="100" y="240" height="40" width="40" /></BPMNShape><BPMNShape id="BPMNShape_11" bpmnElement="11"><Bounds x="275" y="340" height="80" width="150" /></BPMNShape></BPMNPlane></BPMNDiagram></definitions>';
		demo = mxUtils.parseXml(demo);
		var model = graph.model;
		var rst = decodeBpmn(demo);

		var codec = new mxCodec(demo);
		codec.decode(rst, model);

		console.log(mxUtils.getPrettyXml(rst));
	});

	action.setToggleAction(true);
	action.setSelectedCallback(mxUtils.bind(this, function() { return this.outlineWindow != null && this.outlineWindow.window.isVisible(); }));
};

/**
 * Registers the given action under the given name.
 */
Actions.prototype.addAction = function(key, funct, enabled, iconCls, shortcut)
{
	var title;
	
	if (key.substring(key.length - 3) == '...')
	{
		key = key.substring(0, key.length - 3);
		title = mxResources.get(key) + '...';
	}
	else
	{
		title = mxResources.get(key);
	}
	
	return this.put(key, new Action(title, funct, enabled, iconCls, shortcut));
};

/**
 * Registers the given action under the given name.
 */
Actions.prototype.put = function(name, action)
{
	this.actions[name] = action;
	
	return action;
};

/**
 * Returns the action for the given name or null if no such action exists.
 */
Actions.prototype.get = function(name)
{
	return this.actions[name];
};

/**
 * Constructs a new action for the given parameters.
 */
function Action(label, funct, enabled, iconCls, shortcut)
{
	mxEventSource.call(this);
	this.label = label;
	this.funct = this.createFunction(funct);
	this.enabled = (enabled != null) ? enabled : true;
	this.iconCls = iconCls;
	this.shortcut = shortcut;
	this.visible = true;
};

// Action inherits from mxEventSource
mxUtils.extend(Action, mxEventSource);

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.createFunction = function(funct)
{
	return funct;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setEnabled = function(value)
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
Action.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setToggleAction = function(value)
{
	this.toggleAction = value;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.setSelectedCallback = function(funct)
{
	this.selectedCallback = funct;
};

/**
 * Sets the enabled state of the action and fires a stateChanged event.
 */
Action.prototype.isSelected = function()
{
	return this.selectedCallback();
};
